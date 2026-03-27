import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── STT PROVIDER REGISTRY ─────────────────────────────────────
// Order matters: first = primary, second = fallback, etc.
// To change priority, just reorder. To disable, comment out or remove.
interface STTProvider {
  name: string;
  envKey: string;           // env var name for the API key
  model?: string;           // model identifier if applicable
  timeoutMs: number;
  transcribe: (audio: ArrayBuffer, contentType: string, apiKey: string, model: string, timeoutMs: number) => Promise<string>;
}

async function transcribeDeepgram(
  audioBuffer: ArrayBuffer,
  contentType: string,
  apiKey: string,
  model: string,
  timeoutMs: number
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const resp = await fetch(
      `https://api.deepgram.com/v1/listen?model=${model}&smart_format=true&language=en`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": contentType,
        },
        body: audioBuffer,
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Deepgram ${model} [${resp.status}]: ${errText}`);
    }

    const data = await resp.json();
    const transcript =
      data?.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim();
    if (!transcript) throw new Error(`Deepgram ${model}: empty transcript`);
    return transcript;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

// ─── PROVIDER ARRAY (reorder / add / remove as needed) ─────────
const STT_PROVIDERS: STTProvider[] = [
  {
    name: "deepgram-nova-3",
    envKey: "DEEPGRAM_API_KEY",
    model: "nova-3",
    timeoutMs: 8000,
    transcribe: transcribeDeepgram,
  },
  {
    name: "deepgram-nova-2",
    envKey: "DEEPGRAM_API_KEY",
    model: "nova-2",
    timeoutMs: 8000,
    transcribe: transcribeDeepgram,
  },
  // Add more providers here, e.g.:
  // {
  //   name: "whisper-openai",
  //   envKey: "OPENAI_API_KEY",
  //   model: "whisper-1",
  //   timeoutMs: 10000,
  //   transcribe: transcribeOpenAIWhisper,
  // },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get("content-type") || "audio/webm";
    const audioBuffer = await req.arrayBuffer();

    if (audioBuffer.byteLength < 100) {
      return new Response(
        JSON.stringify({ error: "Audio too short" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Filter to providers whose API key is configured
    const activeProviders = STT_PROVIDERS.filter((p) => Deno.env.get(p.envKey));

    if (activeProviders.length === 0) {
      return new Response(
        JSON.stringify({ error: "No STT API keys configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const errors: string[] = [];

    for (const provider of activeProviders) {
      try {
        const apiKey = Deno.env.get(provider.envKey)!;
        console.log(`STT: trying ${provider.name}`);
        const text = await provider.transcribe(audioBuffer, contentType, apiKey, provider.model || "", provider.timeoutMs);
        console.log(`STT: success with ${provider.name}`);
        return new Response(
          JSON.stringify({ text, provider: provider.name }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`STT: ${provider.name} failed: ${msg}`);
        errors.push(`${provider.name}: ${msg}`);
      }
    }

    return new Response(
      JSON.stringify({ error: "All STT providers failed", details: errors, fallback: true }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("voice-transcribe error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
