import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── TTS PROVIDER REGISTRY ─────────────────────────────────────
// Order matters: first = primary, second = fallback, etc.
interface TTSProvider {
  name: string;
  envKey: string;
  timeoutMs: number;
  synthesize: (text: string, apiKey: string, timeoutMs: number) => Promise<{ audio: ArrayBuffer; contentType: string }>;
}

async function synthesizeElevenLabs(
  text: string,
  apiKey: string,
  timeoutMs: number
): Promise<{ audio: ArrayBuffer; contentType: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const voiceId = "pNInz6obpgDQGcFmaJgB"; // Adam voice
    const resp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.slice(0, 5000),
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`ElevenLabs [${resp.status}]: ${errText}`);
    }

    const audio = await resp.arrayBuffer();
    return { audio, contentType: "audio/mpeg" };
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

async function synthesizeHuggingFaceKokoro(
  text: string,
  apiKey: string,
  timeoutMs: number
): Promise<{ audio: ArrayBuffer; contentType: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const resp = await fetch(
      "https://router.huggingface.co/fal-ai/fal-ai/kokoro/american-english",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.slice(0, 5000) }),
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`HF Kokoro [${resp.status}]: ${errText}`);
    }

    const ct = resp.headers.get("Content-Type") || "";

    // fal-ai returns JSON with audio URL
    if (ct.includes("application/json")) {
      const data = await resp.json();
      const audioUrl = data?.audio?.url;
      if (!audioUrl) throw new Error("HF Kokoro: no audio URL in response");

      const audioResp = await fetch(audioUrl);
      if (!audioResp.ok) throw new Error(`HF Kokoro: audio fetch failed [${audioResp.status}]`);

      const audio = await audioResp.arrayBuffer();
      const audioCt = data?.audio?.content_type || "audio/wav";
      return { audio, contentType: audioCt };
    }

    // Direct audio response
    if (ct.includes("audio/")) {
      const audio = await resp.arrayBuffer();
      return { audio, contentType: ct };
    }

    throw new Error(`HF Kokoro: unexpected response type: ${ct}`);
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

// ─── PROVIDER ARRAY (reorder / add / remove as needed) ─────────
const TTS_PROVIDERS: TTSProvider[] = [
  {
    name: "huggingface-kokoro",
    envKey: "HUGGINGFACE_API_KEY",
    timeoutMs: 20000,
    synthesize: synthesizeHuggingFaceKokoro,
  },
  {
    name: "elevenlabs",
    envKey: "ELEVENLABS_API_KEY",
    timeoutMs: 15000,
    synthesize: synthesizeElevenLabs,
  },
  // Add more providers here, e.g.:
  // {
  //   name: "openai-tts",
  //   envKey: "OPENAI_API_KEY",
  //   timeoutMs: 10000,
  //   synthesize: synthesizeOpenAI,
  // },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing text" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Filter to providers whose API key is configured
    const activeProviders = TTS_PROVIDERS.filter((p) => Deno.env.get(p.envKey));

    if (activeProviders.length === 0) {
      return new Response(
        JSON.stringify({ error: "No TTS API keys configured", fallback: true }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const errors: string[] = [];

    for (const provider of activeProviders) {
      try {
        const apiKey = Deno.env.get(provider.envKey)!;
        console.log(`TTS: trying ${provider.name}`);
        const { audio, contentType } = await provider.synthesize(text, apiKey, provider.timeoutMs);
        console.log(`TTS: success with ${provider.name} (${contentType}, ${audio.byteLength} bytes)`);

        return new Response(audio, {
          headers: {
            ...corsHeaders,
            "Content-Type": contentType,
            "X-TTS-Provider": provider.name,
          },
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`TTS: ${provider.name} failed: ${msg}`);
        errors.push(`${provider.name}: ${msg}`);
      }
    }

    return new Response(
      JSON.stringify({ error: "All TTS providers failed", details: errors, fallback: true }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("voice-speak error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
