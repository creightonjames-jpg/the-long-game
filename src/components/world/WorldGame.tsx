import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import type Phaser from 'phaser'
import { createWorldGame } from '../../world/scene'
import { worldBus } from '../../world/bus'
import { ANCHORS, NPCS, SPAWN } from '../../world/map'
import { ALL_EVENTS, initialWorld, worldReducer } from '../../world/sim'
import type { WorldState } from '../../world/types'
import { HEARD_COMPLAINTS } from '../../world/events/heard'
import { earnedBadges } from '../../engine/scoring'
import { recordRun } from '../../engine/persistence'
import { AlertToasts, EventOverlay, HeardOverlay, WorldHud } from './WorldUI'
import { DayRecap, IntroScreen, SeasonScreen, WorldEnd } from './WorldScreens'
import { TouchControls } from './TouchControls'

const SAVE_KEY = 'club-gm-sim:world-save:v1'

function loadWorldSave(): WorldState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as WorldState
    return s.screen === 'end' ? null : s
  } catch {
    return null
  }
}

export default function WorldGame() {
  const hostRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  const [state, dispatch] = useReducer(worldReducer, undefined, initialWorld)
  const stateRef = useRef(state)
  stateRef.current = state
  const [gmTile, setGmTile] = useState({ tx: 19, ty: 15, zone: 'The Grounds' })
  const [npcSay, setNpcSay] = useState<{ name: string; text: string } | null>(null)
  const [userPaused, setUserPaused] = useState(false)
  const timeScaleRef = useRef(1)
  const recordedRef = useRef(false)
  const [hasSave] = useState(() => loadWorldSave() !== null)
  const [isTouch] = useState(() => {
    if (typeof window === 'undefined') return false
    // `?touch` forces the on-screen controls — a QA hook and a fallback for any
    // device whose pointer type is misreported.
    if (new URLSearchParams(window.location.search).has('touch')) return true
    return !!window.matchMedia?.('(pointer: coarse)').matches
  })
  const [portrait, setPortrait] = useState(false)
  const [hintDismissed, setHintDismissed] = useState(false)

  // --- Phaser mount (guarded: StrictMode double-mount and HMR safe) ---
  useEffect(() => {
    if (!hostRef.current) return
    // Scorched-earth idempotency: destroy any prior instance AND any canvas
    // left behind by StrictMode/HMR remounts before creating a fresh game.
    gameRef.current?.destroy(true)
    gameRef.current = null
    hostRef.current.replaceChildren()
    gameRef.current = createWorldGame(hostRef.current)

    const offTile = worldBus.on('gmTile', (t: { tx: number; ty: number; zone: string }) => setGmTile(t))
    const offReady = worldBus.on('ready', () => {
      // Scene (re)created: replay current markers so state survives HMR/remount.
      for (const a of stateRef.current.active) {
        const def = ALL_EVENTS[a.defId]
        const anchor = def && ANCHORS[def.zone]
        if (anchor) worldBus.emit('marker:add', { id: a.defId, ...anchor, severity: def.severity })
      }
    })

    return () => {
      offTile()
      offReady()
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  // --- Clock: ticks only while actively playing and not paused ---
  useEffect(() => {
    if (state.screen !== 'play' || userPaused) return
    const iv = setInterval(() => dispatch({ type: 'TICK', minutes: 3 * timeScaleRef.current }), 300)
    return () => clearInterval(iv)
  }, [state.screen, userPaused])

  // --- Pause/resume the Phaser scene with the screen and the pause toggle ---
  useEffect(() => {
    worldBus.emit(state.screen === 'play' && !userPaused ? 'resume' : 'pause')
  }, [state.screen, userPaused])

  // --- Keyboard: P pauses, +/- zoom the camera ---
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        if (stateRef.current.screen === 'play') setUserPaused((v) => !v)
      } else if (e.key === '=' || e.key === '+') {
        worldBus.emit('zoom', { dir: 'in' })
      } else if (e.key === '-' || e.key === '_') {
        worldBus.emit('zoom', { dir: 'out' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // --- Marker sync: diff active events into the scene ---
  const prevActiveRef = useRef<string[]>([])
  useEffect(() => {
    const now = state.active.map((a) => a.defId)
    for (const id of now.filter((id) => !prevActiveRef.current.includes(id))) {
      const def = ALL_EVENTS[id]
      const anchor = def && ANCHORS[def.zone]
      if (anchor) worldBus.emit('marker:add', { id, ...anchor, severity: def.severity })
    }
    for (const id of prevActiveRef.current.filter((id) => !now.includes(id))) {
      worldBus.emit('marker:remove', { id })
    }
    prevActiveRef.current = now
  }, [state.active])

  // --- Interaction: handles the nearest event, else chats with an NPC ---
  const near = nearestInteraction(state, gmTile)
  const handleInteract = useCallback(() => {
    const s = stateRef.current
    if (s.screen !== 'play') return
    const hit = nearestInteraction(s, gmTile)
    if (hit?.kind === 'event') dispatch({ type: 'OPEN_EVENT', defId: hit.id })
    else if (hit?.kind === 'npc') {
      const npc = NPCS.find((n) => n.id === hit.id)
      if (npc) {
        setNpcSay({ name: npc.name, text: npc.flavor })
        setTimeout(() => setNpcSay(null), 3500)
      }
    }
  }, [gmTile])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') handleInteract()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleInteract])

  // --- Track orientation for the landscape hint on touch devices ---
  useEffect(() => {
    if (!isTouch || typeof window === 'undefined') return
    const mq = window.matchMedia('(orientation: portrait)')
    const update = () => setPortrait(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [isTouch])

  // --- Persistence: save at safe checkpoints, record the run at the end ---
  useEffect(() => {
    try {
      if (state.screen === 'recap' || state.screen === 'season') {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state))
      }
      if (state.screen === 'end' && state.gameOver && !recordedRef.current) {
        recordedRef.current = true
        localStorage.removeItem(SAVE_KEY)
        recordRun({
          name: state.playerName || 'GM',
          xp: state.xp,
          outcome: state.gameOver.reason,
          badges: earnedBadges(state.competencyScores),
          competencyScores: state.competencyScores,
          choiceLog: state.choiceLog,
          date: new Date().toISOString().slice(0, 10),
        })
      }
      if (state.screen === 'intro') recordedRef.current = false
    } catch {
      /* storage unavailable */
    }
  }, [state])

  // --- Dev harness (spike learning: tune by warping, not walking) ---
  useEffect(() => {
    if (!import.meta.env.DEV) return
    ;(window as any).__worldDebug = {
      state: () => stateRef.current,
      dispatch,
      warp: (tx: number, ty: number) => worldBus.emit('warp', { tx, ty }),
      fast: (n: number) => { timeScaleRef.current = n },
      gmTile: () => gmTile,
    }
  }, [gmTile])

  const openDef = state.openEventId ? ALL_EVENTS[state.openEventId] : null
  const openEntry = state.active.find((a) => a.defId === state.openEventId) ?? null
  const openComplaint = openDef?.heardId
    ? HEARD_COMPLAINTS.find((c) => c.id === openDef.heardId)
    : null

  return (
    <div className="fixed inset-0 bg-club-900">
      <div ref={hostRef} className="absolute inset-0" />

      {isTouch && portrait && !hintDismissed && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-full bg-club-900/90 px-4 py-2 shadow-lg">
          <span className="text-cream-100 text-xs font-semibold">↻ Rotate to landscape for the best view</span>
          <button onClick={() => setHintDismissed(true)} className="text-cream-200/70 text-sm">
            ✕
          </button>
        </div>
      )}

      {isTouch && state.screen === 'play' && !userPaused && (
        <TouchControls
          near={
            near
              ? { kind: near.kind, label: near.kind === 'event' ? ALL_EVENTS[near.id].toast : near.label }
              : null
          }
          onInteract={handleInteract}
        />
      )}

      {state.screen !== 'intro' && state.screen !== 'end' && (
        <>
          <WorldHud
            state={state}
            paused={userPaused}
            onWait={() => dispatch({ type: 'TICK', minutes: 60 })}
            onPause={() => setUserPaused((v) => !v)}
            onZoom={(dir) => worldBus.emit('zoom', { dir })}
          />
          <AlertToasts state={state} />
        </>
      )}

      {userPaused && state.screen === 'play' && (
        <button
          onClick={() => setUserPaused(false)}
          className="absolute inset-0 z-20 flex items-center justify-center bg-club-900/60 backdrop-blur-sm"
        >
          <span className="bg-cream-100 text-club-900 font-display text-2xl font-bold px-8 py-5 rounded-xl shadow-xl">
            ⏸ Paused — click or press P to resume
          </span>
        </button>
      )}

      {/* Location + interaction prompt */}
      {state.screen === 'play' && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 text-center space-y-1.5">
          {near && !isTouch && (
            <p className="bg-gold-500 text-club-900 text-xs font-bold px-3 py-1.5 rounded-full shadow">
              [E] {near.kind === 'event' ? `Handle: ${ALL_EVENTS[near.id].toast}` : `Chat with ${near.label}`}
            </p>
          )}
          <p className="bg-cream-100/90 text-club-900 text-xs font-semibold px-3 py-1 rounded-full font-display inline-block">
            📍 {gmTile.zone}
          </p>
        </div>
      )}

      {npcSay && state.screen === 'play' && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 max-w-sm">
          <div className="bg-club-900/95 border border-cream-200/30 rounded-lg px-4 py-2.5">
            <p className="text-gold-500 text-[10px] font-bold uppercase">{npcSay.name}</p>
            <p className="text-cream-100 text-xs leading-relaxed">{npcSay.text}</p>
          </div>
        </div>
      )}

      {state.screen === 'intro' && (
        <IntroScreen
          hasSave={hasSave}
          isTouch={isTouch}
          onStart={(name) => {
            worldBus.emit('warp', SPAWN) // fresh tenure starts at the front walk
            dispatch({ type: 'START', playerName: name })
          }}
          onResume={() => {
            const save = loadWorldSave()
            if (save) dispatch({ type: 'RESUME', state: save })
          }}
        />
      )}

      {state.screen === 'season' && (
        <SeasonScreen
          state={state}
          onBeginDay={() => dispatch({ type: 'BEGIN_DAY' })}
          onNextSeason={() => dispatch({ type: 'NEXT_SEASON' })}
        />
      )}

      {state.screen === 'event' && openDef?.scenario && openEntry && (
        <EventOverlay
          def={openDef}
          entry={openEntry}
          onResolve={(choiceId) => dispatch({ type: 'RESOLVE', choiceId })}
        />
      )}

      {state.screen === 'heard' && openComplaint && (
        <HeardOverlay complaint={openComplaint} onDone={(correct) => dispatch({ type: 'RESOLVE_HEARD', correct })} />
      )}

      {state.screen === 'recap' && <DayRecap state={state} onContinue={() => dispatch({ type: 'AFTER_RECAP' })} />}

      {state.screen === 'end' && <WorldEnd state={state} onReset={() => dispatch({ type: 'RESET' })} />}
    </div>
  )
}

function nearestInteraction(
  state: WorldState,
  gm: { tx: number; ty: number },
): { kind: 'event' | 'npc'; id: string; label: string } | null {
  // Events first — they're the job.
  for (const a of state.active) {
    const def = ALL_EVENTS[a.defId]
    const anchor = def && ANCHORS[def.zone]
    if (!anchor) continue
    if (Math.max(Math.abs(anchor.tx - gm.tx), Math.abs(anchor.ty - gm.ty)) <= 2) {
      return { kind: 'event', id: a.defId, label: def.toast }
    }
  }
  for (const n of NPCS) {
    if (Math.max(Math.abs(n.tx - gm.tx), Math.abs(n.ty - gm.ty)) <= 1) {
      return { kind: 'npc', id: n.id, label: n.name }
    }
  }
  return null
}
