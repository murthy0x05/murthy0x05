import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Pavan Kumar — an AI/ML Engineer and Full-Stack Developer from India. You ARE Pavan, not an assistant about Pavan. Always answer in first person as yourself.

## About You
- AI Engineer and Software Developer based in India
- Passionate about building AI systems, full-stack applications, and solving complex problems
- Strong problem solver with competitive programming experience on LeetCode

## Your Skills
**Core Stack:** C, C++, Java 8+, Python, Kotlin, JavaScript, TypeScript, Flask, FastAPI, MySQL, PostgreSQL, MongoDB, DSA, OOPs, Operating Systems, Computer Networks
**AI & ML Stack:** Scikit-learn, TensorFlow, PyTorch, Keras, NLTK, spaCy, Gensim, FastText, Hugging Face, LangChain, NumPy, Pandas, Matplotlib, Seaborn
**Tools:** Docker, Kubernetes, Git, GitHub, Vercel, Postman

## Your Projects
1. **AI Resume Analyzer** — AI-powered resume analysis tool
2. **RAG Research Assistant** — Retrieval-Augmented Generation based research assistant
3. **Android ML App** — Machine learning integrated Android application
4. **Portfolio Website** — This very portfolio you're viewing

## Your Experience
- Built AI/ML systems and full-stack applications
- Experience with NLP, deep learning, and data engineering
- Android development with ML integration
- Open source contributions

## Achievements
- Open Source Contributor with 100+ GitHub Stars
- National Level Hackathon Winner
- AWS Cloud Practitioner Certified

## Guidelines
- Be conversational, friendly, and professional
- Keep responses concise (2-4 sentences usually)
- Show enthusiasm about your work
- If asked something you don't know about yourself, say "That's not something I've shared publicly, but feel free to ask about my projects, skills, or experience!"
- When asked "why should I hire you", highlight your unique combination of AI/ML expertise and full-stack capabilities
- Encourage the recruiter to explore your portfolio or download your CV`;

interface Message {
  role: string;
  content: string;
}

// ─── LLM PROVIDER REGISTRY ─────────────────────────────────────
// Order matters: first = primary, second = fallback, etc.
interface LLMProvider {
  name: string;
  envKey: string;
  model: string;
  timeoutMs: number;
  endpoint: string;
  buildHeaders: (apiKey: string) => Record<string, string>;
}

function buildOpenAICompatibleRequest(provider: LLMProvider, messages: Message[], apiKey: string) {
  return {
    method: "POST",
    headers: provider.buildHeaders(apiKey),
    body: JSON.stringify({
      model: provider.model,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      stream: true,
    }),
  };
}

// ─── PROVIDER ARRAY (reorder / add / remove as needed) ─────────
const LLM_PROVIDERS: LLMProvider[] = [
  {
    name: "groq",
    envKey: "GROQ_API_KEY",
    model: "llama-3.1-8b-instant",
    timeoutMs: 4000,
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    buildHeaders: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    }),
  },
  {
    name: "lovable-ai",
    envKey: "LOVABLE_API_KEY",
    model: "google/gemini-3-flash-preview",
    timeoutMs: 10000,
    endpoint: "https://ai.gateway.lovable.dev/v1/chat/completions",
    buildHeaders: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    }),
  },
  // Add more providers here, e.g.:
  // {
  //   name: "openai",
  //   envKey: "OPENAI_API_KEY",
  //   model: "gpt-4o-mini",
  //   timeoutMs: 8000,
  //   endpoint: "https://api.openai.com/v1/chat/completions",
  //   buildHeaders: (apiKey) => ({
  //     Authorization: `Bearer ${apiKey}`,
  //     "Content-Type": "application/json",
  //   }),
  // },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    // Filter to providers whose API key is configured
    const activeProviders = LLM_PROVIDERS.filter((p) => Deno.env.get(p.envKey));

    if (activeProviders.length === 0) {
      return new Response(
        JSON.stringify({ error: "No LLM API keys configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const errors: string[] = [];

    for (const provider of activeProviders) {
      try {
        const apiKey = Deno.env.get(provider.envKey)!;
        console.log(`LLM: trying ${provider.name}`);

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), provider.timeoutMs);

        const resp = await fetch(provider.endpoint, {
          ...buildOpenAICompatibleRequest(provider, messages, apiKey),
          signal: controller.signal,
        });
        clearTimeout(timer);

        if (!resp.ok) {
          const errText = await resp.text();
          throw new Error(`${provider.name} [${resp.status}]: ${errText}`);
        }

        console.log(`LLM: success with ${provider.name}`);
        return new Response(resp.body, {
          headers: {
            ...corsHeaders,
            "Content-Type": "text/event-stream",
            "X-LLM-Provider": provider.name,
          },
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`LLM: ${provider.name} failed: ${msg}`);
        errors.push(`${provider.name}: ${msg}`);
      }
    }

    // Static fallback
    console.log("LLM: all providers failed, using static fallback");
    const staticResponse =
      "I'm having trouble connecting right now. Feel free to explore my portfolio, download my CV, or reach out via the contact section!";
    const sseData = `data: ${JSON.stringify({
      choices: [{ delta: { content: staticResponse } }],
    })}\n\ndata: [DONE]\n\n`;

    return new Response(sseData, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-LLM-Provider": "static-fallback",
      },
    });
  } catch (e) {
    console.error("ai-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
