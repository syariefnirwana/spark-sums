// Gentle looping background music synthesized with the Web Audio API.
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let timer: number | null = null;
let step = 0;

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

// C major pentatonic-ish loop, soft and unobtrusive.
const MELODY = [523.25, 659.25, 783.99, 659.25, 587.33, 783.99, 880.0, 659.25];
const BASS = [130.81, 130.81, 174.61, 174.61, 196.0, 196.0, 174.61, 146.83];

function voice(freq: number, dur: number, type: OscillatorType, peak: number) {
  const audio = ctx!;
  const t0 = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(master!);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

/** Start (or resume) the looping background music. */
export function startMusic() {
  const audio = getCtx();
  if (!audio || timer !== null) return;
  if (!master) {
    master = audio.createGain();
    master.gain.value = 0.12;
    master.connect(audio.destination);
  }
  master.gain.value = 0.12;
  step = 0;
  const tick = () => {
    if (!ctx || !master) return;
    voice(MELODY[step % MELODY.length]!, 0.5, "triangle", 0.16);
    if (step % 2 === 0) voice(BASS[step % BASS.length]!, 0.7, "sine", 0.22);
    step += 1;
  };
  tick();
  timer = window.setInterval(tick, 460);
}

/** Stop the background music. */
export function stopMusic() {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
  if (master) master.gain.value = 0;
}
