// Read-aloud via the browser's built-in Web Speech API — free, no backend, and
// works on any text including scenarios authored in Scenario Studio. Opt-in
// (off by default; many players read faster than any voice speaks).
const VOICE_KEY = 'club-gm-sim:voice:v1'

const synth: SpeechSynthesis | undefined =
  typeof window !== 'undefined' ? window.speechSynthesis : undefined

let enabled = ((): boolean => {
  try {
    return localStorage.getItem(VOICE_KEY) === 'on'
  } catch {
    return false
  }
})()

export function voiceSupported(): boolean {
  return !!synth
}

export function isVoiceEnabled(): boolean {
  return enabled
}

export function setVoiceEnabled(v: boolean): void {
  enabled = v
  try {
    localStorage.setItem(VOICE_KEY, v ? 'on' : 'off')
  } catch {
    /* storage unavailable */
  }
  if (!v) stopSpeaking()
}

export function speak(text: string): void {
  if (!enabled || !synth || !text) return
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text.replace(/[“”‘’]/g, '"'))
  u.rate = 1
  u.pitch = 1
  synth.speak(u)
}

export function stopSpeaking(): void {
  try {
    synth?.cancel()
  } catch {
    /* noop */
  }
}
