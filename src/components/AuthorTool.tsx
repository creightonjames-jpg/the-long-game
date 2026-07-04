import { useRef, useState } from 'react'
import type { Choice, CompetencyKey, Scenario, StatKey } from '../engine/types'
import { COMPETENCY_LABELS, STAT_LABELS } from '../engine/types'
import { validateScenario } from '../engine/customScenarios'
import { ScenarioCard } from './ScenarioCard'

const STAT_KEYS = Object.keys(STAT_LABELS) as StatKey[]
const COMPETENCY_KEYS = Object.keys(COMPETENCY_LABELS) as CompetencyKey[]

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

function emptyChoice(n: number): Choice {
  return { id: `choice-${n}`, label: '', effects: {}, quality: 1, feedback: '' }
}

function emptyScenario(): Scenario {
  return {
    id: '',
    competency: 'governance',
    pool: 'core',
    title: '',
    speaker: '',
    prompt: '',
    choices: [emptyChoice(1), emptyChoice(2), emptyChoice(3)],
  }
}

const inputCls =
  'w-full rounded-lg border border-cream-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-club-500'
const labelCls = 'block text-xs font-semibold text-club-900/60 mb-1'

function ChoiceEditor({
  choice,
  index,
  scenarioIds,
  onChange,
  onRemove,
}: {
  choice: Choice
  index: number
  scenarioIds: string[]
  onChange: (c: Choice) => void
  onRemove: () => void
}) {
  return (
    <div className="border border-cream-200 rounded-lg p-4 space-y-3 bg-cream-50/50">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-club-800">Choice {index + 1}</span>
        <div className="flex items-center gap-3">
          <select
            value={choice.quality}
            onChange={(e) =>
              onChange({ ...choice, quality: Number(e.target.value) as 0 | 1 | 2 })
            }
            className="text-xs rounded border border-cream-200 px-2 py-1"
          >
            <option value={2}>Strong call (2)</option>
            <option value={1}>Defensible (1)</option>
            <option value={0}>Costly move (0)</option>
          </select>
          <button onClick={onRemove} className="text-xs text-red-500 hover:underline">
            Remove
          </button>
        </div>
      </div>
      <div>
        <label className={labelCls}>What the player does</label>
        <textarea
          value={choice.label}
          onChange={(e) => onChange({ ...choice, label: e.target.value })}
          rows={2}
          className={inputCls}
          placeholder="e.g. Decline warmly, citing club comp policy."
        />
      </div>
      <div>
        <label className={labelCls}>Mentor's note (the teaching moment)</label>
        <textarea
          value={choice.feedback}
          onChange={(e) => onChange({ ...choice, feedback: e.target.value })}
          rows={3}
          className={inputCls}
          placeholder="Why this works or backfires, in CMAA competency language."
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {STAT_KEYS.map((k) => (
          <div key={k}>
            <label className={labelCls}>{STAT_LABELS[k].split(' ')[0]}</label>
            <input
              type="number"
              min={-10}
              max={10}
              value={choice.effects[k] ?? 0}
              onChange={(e) => {
                const v = Number(e.target.value)
                const effects = { ...choice.effects }
                if (v === 0) delete effects[k]
                else effects[k] = v
                onChange({ ...choice, effects })
              }}
              className={inputCls}
            />
          </div>
        ))}
        <div>
          <label className={labelCls}>Meddling Δ</label>
          <input
            type="number"
            min={-20}
            max={20}
            value={choice.micro ?? 0}
            onChange={(e) => {
              const v = Number(e.target.value)
              onChange({ ...choice, micro: v === 0 ? undefined : v })
            }}
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label className={labelCls}>Follow-up scenario (optional consequence)</label>
        <select
          value={choice.followUpId ?? ''}
          onChange={(e) =>
            onChange({ ...choice, followUpId: e.target.value || undefined })
          }
          className={inputCls}
        >
          <option value="">— none —</option>
          {scenarioIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export function AuthorTool({
  builtIn,
  custom,
  onChange,
}: {
  builtIn: Record<string, Scenario>
  custom: Scenario[]
  onChange: (scenarios: Scenario[]) => void
}) {
  const [draft, setDraft] = useState<Scenario | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [notice, setNotice] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const customIds = new Set(custom.map((s) => s.id))
  const allIds = [...new Set([...Object.keys(builtIn), ...custom.map((s) => s.id)])].sort()
  const builtInList = Object.values(builtIn).filter((s) => !customIds.has(s.id))

  function startNew() {
    setDraft(emptyScenario())
    setIsNew(true)
    setErrors([])
    setNotice('')
  }

  function startEdit(s: Scenario) {
    setDraft(JSON.parse(JSON.stringify(s)))
    setIsNew(false)
    setErrors([])
    setNotice('')
  }

  function save() {
    if (!draft) return
    const normalized: Scenario = {
      ...draft,
      id: draft.id || slugify(draft.title),
      speaker: draft.speaker?.trim() || undefined,
      choices: draft.choices.map((c, i) => ({ ...c, id: c.id || `choice-${i + 1}` })),
    }
    const errs = validateScenario(normalized)
    if (isNew && builtIn[normalized.id] && !customIds.has(normalized.id)) {
      // Saving over a built-in id is allowed — it becomes an override — but say so.
      setNotice(`Heads up: "${normalized.id}" overrides a built-in scenario.`)
    }
    if (errs.length > 0) {
      setErrors(errs)
      return
    }
    const next = [...custom.filter((s) => s.id !== normalized.id), normalized]
    onChange(next)
    setDraft(null)
    setErrors([])
    setNotice(`Saved "${normalized.title}" — it's now live in the game's scenario pool.`)
  }

  function remove(id: string) {
    onChange(custom.filter((s) => s.id !== id))
    if (draft?.id === id) setDraft(null)
    setNotice(
      builtIn[id]
        ? `Removed override — the built-in "${id}" is back.`
        : `Deleted custom scenario "${id}".`,
    )
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(custom, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'club-gm-custom-scenarios.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function importJson(file: File) {
    file.text().then((text) => {
      try {
        const parsed = JSON.parse(text) as Scenario[]
        if (!Array.isArray(parsed)) throw new Error('Expected a JSON array of scenarios')
        const bad = parsed.flatMap((s) => validateScenario(s).map((e) => `${s.id || '?'}: ${e}`))
        if (bad.length > 0) {
          setErrors(bad.slice(0, 8))
          return
        }
        const byId = new Map([...custom, ...parsed].map((s) => [s.id, s]))
        onChange([...byId.values()])
        setErrors([])
        setNotice(`Imported ${parsed.length} scenario(s).`)
      } catch (e) {
        setErrors([`Import failed: ${e instanceof Error ? e.message : 'invalid JSON'}`])
      }
    })
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white/80 border-b border-cream-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-display text-club-800 font-semibold">
            ⛳ Club GM Simulator · Scenario Studio
          </span>
          <div className="flex items-center gap-4 text-sm">
            <button onClick={exportJson} className="text-club-700 hover:underline">
              Export JSON
            </button>
            <button onClick={() => fileRef.current?.click()} className="text-club-700 hover:underline">
              Import JSON
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) importJson(f)
                e.target.value = ''
              }}
            />
            <a href="#" className="text-club-700 hover:underline">
              ← Back to game
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Scenario list */}
        <div className="space-y-4">
          <button
            onClick={startNew}
            className="w-full bg-club-800 hover:bg-club-700 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
          >
            + New Scenario
          </button>

          {custom.length > 0 && (
            <div className="bg-white rounded-xl border border-cream-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gold-600 mb-2">
                Custom ({custom.length})
              </p>
              <ul className="space-y-1">
                {custom.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => startEdit(s)}
                      className="text-sm text-left text-club-800 hover:underline truncate"
                    >
                      {s.title || s.id}
                      {builtIn[s.id] && (
                        <span className="ml-1 text-[10px] text-amber-600">(override)</span>
                      )}
                    </button>
                    <button
                      onClick={() => remove(s.id)}
                      className="text-[11px] text-red-400 hover:text-red-600 shrink-0"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-xl border border-cream-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-club-900/50 mb-2">
              Built-in ({builtInList.length})
            </p>
            <ul className="space-y-1 max-h-96 overflow-y-auto">
              {builtInList.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => startEdit(s)}
                    className="text-sm text-left text-club-900/70 hover:text-club-800 hover:underline truncate w-full"
                    title="Opens a copy — saving creates a custom override"
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-club-900/40 mt-2">
              Editing a built-in saves a custom override; delete the override to restore it.
            </p>
          </div>
        </div>

        {/* Editor + preview */}
        <div className="space-y-6 min-w-0">
          {notice && (
            <div className="bg-club-100 text-club-800 text-sm rounded-lg px-4 py-3">{notice}</div>
          )}
          {errors.length > 0 && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">
              <ul className="list-disc ml-4">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {!draft ? (
            <div className="bg-white rounded-xl border border-cream-200 p-10 text-center text-club-900/50">
              Select a scenario to edit, or create a new one. Custom scenarios are stored in this
              browser and go live in the game immediately — export JSON to share them or hand them
              to engineering for the permanent content files.
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-cream-200 p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Title</label>
                    <input
                      value={draft.title}
                      onChange={(e) => {
                        const title = e.target.value
                        setDraft({
                          ...draft,
                          title,
                          id: isNew && (!draft.id || draft.id === slugify(draft.title)) ? slugify(title) : draft.id,
                        })
                      }}
                      className={inputCls}
                      placeholder="The Comped Dinner Tab"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Id (unique, kebab-case)</label>
                    <input
                      value={draft.id}
                      onChange={(e) => setDraft({ ...draft, id: e.target.value })}
                      className={inputCls}
                      disabled={!isNew}
                      placeholder="the-comped-dinner-tab"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Competency track</label>
                    <select
                      value={draft.competency}
                      onChange={(e) =>
                        setDraft({ ...draft, competency: e.target.value as CompetencyKey })
                      }
                      className={inputCls}
                    >
                      {COMPETENCY_KEYS.map((k) => (
                        <option key={k} value={k}>
                          {COMPETENCY_LABELS[k]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Pool</label>
                    <select
                      value={draft.pool}
                      onChange={(e) =>
                        setDraft({ ...draft, pool: e.target.value as Scenario['pool'] })
                      }
                      className={inputCls}
                    >
                      <option value="core">Core (drawn each season)</option>
                      <option value="interference">Interference (high meddling only)</option>
                      <option value="followUp">Follow-up (linked from a choice)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Speaker (who confronts you)</label>
                    <input
                      value={draft.speaker ?? ''}
                      onChange={(e) => setDraft({ ...draft, speaker: e.target.value })}
                      className={inputCls}
                      placeholder="Bud Reinhart, Greens Chair"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>The situation</label>
                  <textarea
                    value={draft.prompt}
                    onChange={(e) => setDraft({ ...draft, prompt: e.target.value })}
                    rows={4}
                    className={inputCls}
                    placeholder="Set the scene: who wants what, what it costs, and why it's not obvious…"
                  />
                </div>

                <div className="space-y-4">
                  {draft.choices.map((c, i) => (
                    <ChoiceEditor
                      key={i}
                      choice={c}
                      index={i}
                      scenarioIds={allIds}
                      onChange={(next) =>
                        setDraft({
                          ...draft,
                          choices: draft.choices.map((x, j) => (j === i ? next : x)),
                        })
                      }
                      onRemove={() =>
                        setDraft({ ...draft, choices: draft.choices.filter((_, j) => j !== i) })
                      }
                    />
                  ))}
                  <button
                    onClick={() =>
                      setDraft({
                        ...draft,
                        choices: [...draft.choices, emptyChoice(draft.choices.length + 1)],
                      })
                    }
                    className="text-sm text-club-700 hover:underline"
                  >
                    + Add choice
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={save}
                    className="bg-club-800 hover:bg-club-700 text-white font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors"
                  >
                    Save to game
                  </button>
                  <button
                    onClick={() => {
                      setDraft(null)
                      setErrors([])
                    }}
                    className="border border-cream-200 hover:border-club-500 rounded-lg px-6 py-2.5 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-club-900/50 mb-2 px-6">
                  Live preview
                </p>
                <div className="pointer-events-none opacity-95 -mx-6">
                  <ScenarioCard
                    scenario={{
                      ...draft,
                      title: draft.title || 'Untitled scenario',
                      prompt: draft.prompt || 'The situation text will appear here…',
                      choices: draft.choices.length
                        ? draft.choices.map((c, i) => ({
                            ...c,
                            label: c.label || `Choice ${i + 1} text…`,
                          }))
                        : [emptyChoice(1)],
                    }}
                    position={1}
                    total={3}
                    onChoose={() => {}}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
