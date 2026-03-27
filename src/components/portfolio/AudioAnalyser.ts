/**
 * AudioAnalyser – wraps Web Audio API to extract amplitude from speechSynthesis or any audio source.
 * Uses a singleton AudioContext to avoid creation limits.
 */

let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedCtx || sharedCtx.state === "closed") {
    sharedCtx = new AudioContext();
  }
  if (sharedCtx.state === "suspended") {
    sharedCtx.resume();
  }
  return sharedCtx;
}

export class AudioAmplitudeAnalyser {
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private source: MediaStreamAudioSourceNode | MediaElementAudioSourceNode | null = null;
  private animId = 0;
  private _amplitude = 0;
  private _target = 0;
  private running = false;

  get amplitude() {
    return this._amplitude;
  }

  /** Connect to a MediaStream (e.g. from speechSynthesis via MediaStreamDestination) */
  connectStream(stream: MediaStream) {
    this.disconnect();
    const ctx = getAudioContext();
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
    this.source = ctx.createMediaStreamSource(stream);
    this.source.connect(this.analyser);
    this.startLoop();
  }

  /** Connect to an HTMLAudioElement */
  connectElement(el: HTMLAudioElement) {
    this.disconnect();
    const ctx = getAudioContext();
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
    this.source = ctx.createMediaElementSource(el);
    this.source.connect(this.analyser);
    this.analyser.connect(ctx.destination);
    this.startLoop();
  }

  /** Simulate amplitude when we can't capture real audio (speechSynthesis fallback) */
  simulateSpeaking() {
    this.disconnect();
    this.running = true;
    const tick = () => {
      if (!this.running) return;
      // Generate organic-looking fake amplitude
      this._target = 0.3 + Math.random() * 0.5;
      this._amplitude = lerp(this._amplitude, this._target, 0.15);
      this.animId = requestAnimationFrame(tick);
    };
    tick();
  }

  private startLoop() {
    this.running = true;
    const tick = () => {
      if (!this.running || !this.analyser || !this.dataArray) return;
      this.analyser.getByteFrequencyData(this.dataArray);
      // Average amplitude normalized 0-1
      let sum = 0;
      for (let i = 0; i < this.dataArray.length; i++) sum += this.dataArray[i];
      this._target = sum / this.dataArray.length / 255;
      this._amplitude = lerp(this._amplitude, this._target, 0.1);
      this.animId = requestAnimationFrame(tick);
    };
    tick();
  }

  disconnect() {
    this.running = false;
    cancelAnimationFrame(this.animId);
    this.source?.disconnect();
    this.analyser?.disconnect();
    this.source = null;
    this.analyser = null;
    this.dataArray = null;
    this._amplitude = 0;
    this._target = 0;
  }
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
