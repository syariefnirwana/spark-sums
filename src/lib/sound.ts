let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType,
  peak: number,
) {
  const audio = getCtx();
  if (!audio) return;
  const t0 = audio.currentTime + start;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

/** Bright two-note "ding" for a correct answer. */
export function playSuccess() {
  tone(880, 0, 0.18, "sine", 0.25);
  tone(1318.5, 0.09, 0.32, "sine", 0.2);
}

/** Low "buzz" for a wrong answer. */
export function playError() {
  tone(160, 0, 0.18, "square", 0.12);
  tone(110, 0.08, 0.22, "sawtooth", 0.1);
}

/** Soft chime when the session finishes. */
export function playFinish() {
  tone(659.3, 0, 0.25, "sine", 0.2);
  tone(783.99, 0.12, 0.25, "sine", 0.2);
  tone(1046.5, 0.24, 0.5, "sine", 0.22);
}

/** Must be called from a user gesture so mobile browsers unlock audio. */
export function unlockAudio() {
  getCtx();
}
