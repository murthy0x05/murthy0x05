// Voice input/output with multi-provider fallback
// STT: Deepgram (server) → Browser SpeechRecognition (fallback)
// TTS: ElevenLabs (server) → Browser speechSynthesis (fallback)

const BASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// ─── RECORDING ────────────────────────────────────────────────
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

export function startRecording(
  onResult: (text: string) => void,
  onEnd: () => void
): { stop: () => void } | null {
  // Try MediaRecorder for server-side STT first
  if (navigator.mediaDevices?.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        audioChunks = [];
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
            ? "audio/webm;codecs=opus"
            : "audio/webm",
        });

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunks.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(audioChunks, { type: "audio/webm" });
          audioChunks = [];

          if (blob.size < 100) {
            onEnd();
            return;
          }

          try {
            const text = await transcribeWithFallback(blob);
            if (text) {
              onResult(text);
            } else {
              onEnd();
            }
          } catch {
            onEnd();
          }
        };

        mediaRecorder.start();
      })
      .catch(() => {
        // Mic access denied — fall back to browser STT
        const handle = startBrowserListening(onResult, onEnd);
        if (!handle) onEnd();
      });

    return {
      stop: () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
        }
      },
    };
  }

  // No MediaRecorder support — browser STT
  return startBrowserListening(onResult, onEnd);
}

// ─── SERVER STT (Deepgram with fallback) ─────────────────────
async function transcribeWithFallback(audio: Blob): Promise<string> {
  try {
    console.log("STT: sending to server (Deepgram)");
    const resp = await fetch(`${BASE_URL}/functions/v1/voice-transcribe`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
        "Content-Type": audio.type || "audio/webm",
      },
      body: await audio.arrayBuffer(),
    });

    if (resp.ok) {
      const data = await resp.json();
      console.log(`STT: transcribed via ${data.provider}`);
      return data.text;
    }

    const err = await resp.json().catch(() => ({}));
    console.warn("STT: server failed, details:", err);

    if (err.fallback) {
      console.log("STT: falling back to browser SpeechRecognition");
      return await browserSTTFallback();
    }

    throw new Error(err.error || "STT failed");
  } catch (e) {
    console.warn("STT: server error, trying browser fallback:", e);
    return await browserSTTFallback();
  }
}

function browserSTTFallback(): Promise<string> {
  return new Promise((resolve, reject) => {
    const handle = startBrowserListening(
      (text) => resolve(text),
      () => reject(new Error("Browser STT ended without result"))
    );
    if (!handle) reject(new Error("Browser STT not supported"));
  });
}

// ─── BROWSER SPEECH RECOGNITION (final fallback) ─────────────
export function startBrowserListening(
  onResult: (text: string) => void,
  onEnd: () => void
): { stop: () => void } | null {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = () => onEnd();
  recognition.onend = () => onEnd();

  recognition.start();
  return { stop: () => recognition.stop() };
}

// ─── TTS: ElevenLabs (server) → Browser fallback ─────────────
let currentAudio: HTMLAudioElement | null = null;

export async function speakWithFallback(
  text: string,
  onEnd?: () => void
): Promise<void> {
  stopSpeaking();

  try {
    console.log("TTS: trying ElevenLabs via server");
    const resp = await fetch(`${BASE_URL}/functions/v1/voice-speak`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({ text }),
    });

    const ct = resp.headers.get("Content-Type") || "";
    if (resp.ok && (ct.includes("audio/") || ct.includes("application/octet-stream"))) {
      const provider = resp.headers.get("X-TTS-Provider") || "elevenlabs";
      console.log(`TTS: success with ${provider}`);

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      currentAudio = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        currentAudio = null;
        onEnd?.();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        currentAudio = null;
        console.warn("TTS: audio playback error, falling to browser");
        browserSpeak(text, onEnd);
      };

      await audio.play();
      return;
    }

    // Non-audio response = error/fallback signal
    const err = await resp.json().catch(() => ({}));
    console.warn("TTS: server returned fallback signal:", err);
    browserSpeak(text, onEnd);
  } catch (e) {
    console.warn("TTS: server error, using browser:", e);
    browserSpeak(text, onEnd);
  }
}

function browserSpeak(text: string, onEnd?: () => void) {
  console.log("TTS: falling back to browser speechSynthesis");
  if (!window.speechSynthesis) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
}

// ─── CONTROLS ─────────────────────────────────────────────────
export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
  window.speechSynthesis?.cancel();
}

export function interruptSpeaking(): boolean {
  const wasPlaying = !!(currentAudio && !currentAudio.paused);
  const wasSynthesizing = !!window.speechSynthesis?.speaking;

  stopSpeaking();

  return wasPlaying || wasSynthesizing;
}

export function isSpeechSupported() {
  return !!(
    navigator.mediaDevices?.getUserMedia ||
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}
