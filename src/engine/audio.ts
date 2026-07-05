// Synthesized NES-style sound effects via the Web Audio API — no audio files,
// all generated in code (license-clean, tiny bundle). Respects a persisted
// mute setting; the audio context unlocks on the first (gesture-driven) play.
const SFX_KEY = 'club-gm-sim:sfx:v1'

let enabled = ((): boolean => {
  try {
    return localStorage.getItem(SFX_KEY) !== 'off'
  } catch {
    return true
  }
})()

let ctx: AudioContext | null = null

export function isSfxEnabled(): boolean {
  return enabled
}

export function setSfxEnabled(v: boolean): void {
  enabled = v
  try {
    localStorage.setItem(SFX_KEY, v ? 'on' : 'off')
  } catch {
    /* storage unavailable */
  }
}

function getCtx(): AudioContext | null {
  try {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    if (!ctx) ctx = new Ctor()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function blip(
  c: AudioContext,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType,
  vol: number,
  slideTo?: number,
): void {
  const t = c.currentTime + start
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (slideTo) osc.frequency.linearRampToValueAtTime(slideTo, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

export type Sfx =
  | 'select' | 'open' | 'good' | 'mid' | 'bad' | 'xp'
  | 'badge' | 'alert' | 'door' | 'recap' | 'win' | 'lose'

export function sfx(name: Sfx): void {
  if (!enabled) return
  const c = getCtx()
  if (!c) return
  const v = 0.12
  switch (name) {
    case 'select': blip(c, 480, 0, 0.07, 'square', v); break
    case 'open': blip(c, 330, 0, 0.08, 'square', v); blip(c, 494, 0.06, 0.1, 'square', v); break
    case 'good': [523, 659, 784].forEach((f, i) => blip(c, f, i * 0.06, 0.12, 'square', v)); break
    case 'mid': blip(c, 440, 0, 0.09, 'square', v); blip(c, 440, 0.1, 0.09, 'square', v * 0.8); break
    case 'bad': blip(c, 220, 0, 0.28, 'sawtooth', v, 90); break
    case 'xp': blip(c, 988, 0, 0.06, 'square', v * 0.8); break
    case 'badge': [523, 659, 784, 1047].forEach((f, i) => blip(c, f, i * 0.08, 0.16, 'square', v)); break
    case 'alert': blip(c, 880, 0, 0.1, 'square', v); blip(c, 660, 0.12, 0.14, 'square', v); break
    case 'door': blip(c, 196, 0, 0.14, 'triangle', v, 130); break
    case 'recap': blip(c, 392, 0, 0.1, 'triangle', v); blip(c, 523, 0.1, 0.14, 'triangle', v); break
    case 'win': [523, 659, 784, 1047, 1319].forEach((f, i) => blip(c, f, i * 0.1, 0.2, 'square', v)); break
    case 'lose': [392, 330, 262, 196].forEach((f, i) => blip(c, f, i * 0.12, 0.22, 'sawtooth', v * 0.9)); break
  }
}
