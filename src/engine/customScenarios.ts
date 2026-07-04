import type { Scenario } from './types'

const CUSTOM_KEY = 'club-gm-sim:custom-scenarios:v1'

export function loadCustomScenarios(): Scenario[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY)
    return raw ? (JSON.parse(raw) as Scenario[]) : []
  } catch {
    return []
  }
}

export function saveCustomScenarios(scenarios: Scenario[]): void {
  try {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(scenarios))
  } catch {
    /* storage unavailable */
  }
}

/** Custom scenarios override built-ins on id collision — that's how authors edit built-in content. */
export function mergeScenarios(
  builtIn: Record<string, Scenario>,
  custom: Scenario[],
): Record<string, Scenario> {
  return { ...builtIn, ...Object.fromEntries(custom.map((s) => [s.id, s])) }
}

export function validateScenario(s: Scenario): string[] {
  const errors: string[] = []
  if (!s.id.trim()) errors.push('Scenario needs an id.')
  if (!/^[a-z0-9-]+$/.test(s.id)) errors.push('Id must be lowercase letters, numbers, and dashes.')
  if (!s.title.trim()) errors.push('Scenario needs a title.')
  if (!s.prompt.trim()) errors.push('Scenario needs a prompt.')
  if (s.choices.length < 2) errors.push('Scenario needs at least two choices.')
  s.choices.forEach((c, i) => {
    if (!c.label.trim()) errors.push(`Choice ${i + 1} needs a label.`)
    if (!c.feedback.trim()) errors.push(`Choice ${i + 1} needs mentor feedback.`)
    for (const [k, v] of Object.entries(c.effects)) {
      if (typeof v === 'number' && Math.abs(v) > 10)
        errors.push(`Choice ${i + 1}: ${k} effect must be between -10 and +10.`)
    }
  })
  if (!s.choices.some((c) => c.quality === 2))
    errors.push('At least one choice should be a strong call (quality 2) so the scenario is winnable.')
  return errors
}
