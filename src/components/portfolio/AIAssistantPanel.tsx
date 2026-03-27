import { useState, useRef, useEffect, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Mic, MicOff } from "lucide-react";
import { startRecording, speakWithFallback, interruptSpeaking, isSpeechSupported } from "./VoiceHandler";
import { AudioAmplitudeAnalyser } from "./AudioAnalyser";
import AIAssistantOrb from "./AIAssistantOrb";

const LiquidOrb = lazy(() => import("./LiquidOrb"));

type Msg = { role: "user" | "assistant"; content: string };
type OrbState = "idle" | "listening" | "processing" | "speaking" | "interrupted";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;

const QUICK_QUESTIONS = ["Tell me about your projects", "What are your skills?", "Why should I hire you?"];

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  onDelta: (t: string) => void;
  onDone: () => void;
  onError: (e: string) => void;
}) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Request failed" }));
      onError(err.error || "Something went wrong");
      return;
    }
    if (!resp.body) {
      onError("No response body");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      let idx: number;
      while ((idx = buf.indexOf("\n")) !== -1) {
        let line = buf.slice(0, idx);
        buf = buf.slice(idx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") {
          onDone();
          return;
        }
        try {
          const parsed = JSON.parse(json);
          const c = parsed.choices?.[0]?.delta?.content;
          if (c) onDelta(c);
        } catch {
          buf = line + "\n" + buf;
          break;
        }
      }
    }
    onDone();
  } catch {
    onError("Network error. Please try again.");
  }
}

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [lastResponse, setLastResponse] = useState("");
  const listenerRef = useRef<{ stop: () => void } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const amplitudeRef = useRef(0);
  const analyserRef = useRef<AudioAmplitudeAnalyser | null>(null);

  useEffect(() => {
    analyserRef.current = new AudioAmplitudeAnalyser();
    return () => analyserRef.current?.disconnect();
  }, []);

  // Listen for toggle from mobile floating bar
  useEffect(() => {
    const handler = () => {
      if (orbState === "speaking") interruptSpeaking();
      analyserRef.current?.disconnect();
      setOpen((o) => !o);
    };
    window.addEventListener("toggle-ai-assistant", handler);
    return () => window.removeEventListener("toggle-ai-assistant", handler);
  }, [orbState]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Keep amplitudeRef in sync with analyser
  useEffect(() => {
    if (orbState !== "speaking") return;
    let running = true;
    const tick = () => {
      if (!running) return;
      amplitudeRef.current = analyserRef.current?.amplitude ?? 0;
      requestAnimationFrame(tick);
    };
    tick();
    return () => { running = false; };
  }, [orbState]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;
      const userMsg: Msg = { role: "user", content: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);
      setOrbState("processing");
      setLastResponse("");

      let assistantSoFar = "";

      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setLastResponse(assistantSoFar);
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant")
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      await streamChat({
        messages: [...messages, userMsg],
        onDelta: upsert,
        onDone: () => {
          setIsLoading(false);
          setOrbState("speaking");
          // Start simulated amplitude for TTS
          analyserRef.current?.simulateSpeaking();
          if (assistantSoFar) {
            speakWithFallback(assistantSoFar, () => {
              analyserRef.current?.disconnect();
              amplitudeRef.current = 0;
              setOrbState("idle");
            });
          } else {
            analyserRef.current?.disconnect();
            setOrbState("idle");
          }
        },
        onError: (err) => {
          setLastResponse(`Sorry, ${err}`);
          setMessages((prev) => [...prev, { role: "assistant", content: `Sorry, ${err}` }]);
          setIsLoading(false);
          setOrbState("idle");
        },
      });
    },
    [messages, isLoading],
  );

  const handleInterrupt = useCallback(() => {
    const wasSpk = interruptSpeaking();
    analyserRef.current?.disconnect();
    amplitudeRef.current = 0;
    if (wasSpk) {
      setOrbState("interrupted");
      // Quick visual bounce then transition to listening
      setTimeout(() => {
        if (isSpeechSupported()) {
          const handle = startRecording(
            (text) => {
              setListening(false);
              sendMessage(text);
            },
            () => {
              setListening(false);
              setOrbState("idle");
            },
          );
          if (handle) {
            listenerRef.current = handle;
            setListening(true);
            setOrbState("listening");
          } else {
            setOrbState("idle");
          }
        } else {
          setOrbState("idle");
        }
      }, 300);
      return true;
    }
    return false;
  }, [sendMessage]);

  const toggleListening = useCallback(() => {
    if (listening) {
      listenerRef.current?.stop();
      setListening(false);
      setOrbState("idle");
      return;
    }
    const handle = startRecording(
      (text) => {
        setListening(false);
        setOrbState("idle");
        sendMessage(text);
      },
      () => {
        setListening(false);
        setOrbState("idle");
      },
    );
    if (handle) {
      listenerRef.current = handle;
      setListening(true);
      setOrbState("listening");
    }
  }, [listening, sendMessage]);

  const handleOrbClick = useCallback(() => {
    // If speaking → interrupt (barge-in)
    if (orbState === "speaking") {
      handleInterrupt();
      return;
    }
    // Otherwise toggle listening
    if (isSpeechSupported()) {
      toggleListening();
    }
  }, [orbState, handleInterrupt, toggleListening]);

  return (
    <>
      <AIAssistantOrb
        state={orbState === "interrupted" ? "idle" : (orbState as any)}
        onClick={() => {
          if (orbState === "speaking") interruptSpeaking();
          analyserRef.current?.disconnect();
          setOpen((o) => !o);
        }}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 z-50 w-[360px] max-h-[520px] flex flex-col rounded-2xl border border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl sm:w-[380px] max-sm:inset-2 max-sm:bottom-20 max-sm:right-2 max-sm:left-2 max-sm:w-auto max-sm:max-h-[80vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 animate-pulse" />
                <span className="text-sm font-medium text-white/70">Take a quick interview</span>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  interruptSpeaking();
                  analyserRef.current?.disconnect();
                }}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Central Orb Area */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0 py-6 px-4 gap-4">
              <Suspense
                fallback={
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-green-400 animate-pulse" />
                }
              >
                <LiquidOrb
                  amplitudeRef={amplitudeRef}
                  state={orbState}
                  onClick={handleOrbClick}
                  size={128}
                />
              </Suspense>

              {/* Last response text */}
              <div className="w-full max-h-[120px] overflow-y-auto mt-4">
                {lastResponse ? (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-white/50 text-center leading-relaxed px-2"
                  >
                    {lastResponse.length > 200 ? lastResponse.slice(-200) + "..." : lastResponse}
                  </motion.p>
                ) : (
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {QUICK_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-[11px] px-2.5 py-1 rounded-full border border-white/8 text-white/40 hover:text-white/70 hover:border-white/20 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-white/5 p-3 flex items-center gap-2">
              {isSpeechSupported() && (
                <button
                  onClick={toggleListening}
                  className={`p-2 rounded-lg transition-colors ${
                    listening ? "bg-red-500/20 text-red-400" : "text-white/30 hover:text-white/50"
                  }`}
                  title={listening ? "Stop listening" : "Voice input"}
                >
                  {listening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              )}
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Chat with me..."
                className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 border border-white/5 focus:outline-none focus:border-white/15"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-lg text-white/30 hover:text-white/50 disabled:opacity-20 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
