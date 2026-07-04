import { lazy, Suspense, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { makeReducer, initialState } from './engine/reducer'
import { earnedBadges } from './engine/scoring'
import {
  clearSave,
  loadGame,
  loadLeaderboard,
  recordRun,
  saveGame,
} from './engine/persistence'
import {
  loadCustomScenarios,
  mergeScenarios,
  saveCustomScenarios,
} from './engine/customScenarios'
import { fetchRemoteRuns, remoteEnabled, syncRun } from './engine/remote'
import type { LeaderboardEntry, RunRecord, Scenario } from './engine/types'
import { SCENARIOS, INITIAL_BOARD, BOARD_BENCH } from './content'
import { Dashboard } from './components/Dashboard'
import { StartScreen } from './components/StartScreen'
import { SeasonIntro } from './components/SeasonIntro'
import { ScenarioCard } from './components/ScenarioCard'
import { FeedbackPanel } from './components/FeedbackPanel'
import { BoardReview } from './components/BoardReview'
import { YearEnd } from './components/YearEnd'
import { GameOver } from './components/GameOver'
import { AuthorTool } from './components/AuthorTool'
import { ManagerDashboard } from './components/ManagerDashboard'
import { ALL_EVENTS } from './world/sim'
import { HEARD_COMPLAINTS } from './world/events/heard'

// Loaded on demand — keeps Phaser (~1.7 MB) out of the classic-mode bundle.
const WorldGame = lazy(() => import('./components/world/WorldGame'))

// Lets the Manager Dashboard resolve titles for world-mode decisions too.
const WORLD_SCENARIO_INDEX = Object.fromEntries([
  ...Object.values(ALL_EVENTS)
    .filter((e) => e.scenario)
    .map((e) => [e.scenario!.id, { title: e.scenario!.title, competency: e.scenario!.competency }]),
  ...HEARD_COMPLAINTS.map((c) => [c.id, { title: c.title, competency: c.competency }]),
]) as unknown as Record<string, Scenario>

function useHashRoute(): string {
  const [route, setRoute] = useState(() => window.location.hash)
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}

export default function App() {
  const route = useHashRoute()
  const [custom, setCustom] = useState<Scenario[]>(loadCustomScenarios)
  const scenarios = useMemo(() => mergeScenarios(SCENARIOS, custom), [custom])

  const reducer = useMemo(
    () =>
      makeReducer({
        scenarios,
        initialBoard: INITIAL_BOARD,
        boardBench: BOARD_BENCH,
      }),
    [scenarios],
  )

  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const [savedGame] = useState(loadGame)
  const [localBoard, setLocalBoard] = useState<LeaderboardEntry[]>(loadLeaderboard)
  const [remoteBoard, setRemoteBoard] = useState<LeaderboardEntry[]>([])
  const recordedRef = useRef(false)

  // With Supabase configured, the leaderboard becomes cohort-wide.
  useEffect(() => {
    if (!remoteEnabled) return
    fetchRemoteRuns().then((runs) =>
      setRemoteBoard(
        runs.map((r) => ({
          name: r.name,
          xp: r.xp,
          badges: r.badges,
          outcome: r.outcome,
          date: r.date,
        })),
      ),
    )
  }, [])

  const leaderboard = useMemo(() => {
    const seen = new Set<string>()
    return [...remoteBoard, ...localBoard]
      .filter((e) => {
        const key = `${e.name}|${e.xp}|${e.date}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10)
  }, [remoteBoard, localBoard])

  // Autosave on every state change while a run is live.
  useEffect(() => {
    if (state.screen !== 'start' && state.screen !== 'gameOver') saveGame(state)
  }, [state])

  // Record the run once on game over (local always, Supabase when configured).
  useEffect(() => {
    if (state.screen === 'gameOver' && state.gameOver && !recordedRef.current) {
      recordedRef.current = true
      clearSave()
      const run: RunRecord = {
        name: state.playerName,
        xp: state.xp,
        outcome: state.gameOver.reason,
        badges: earnedBadges(state.competencyScores),
        competencyScores: state.competencyScores,
        choiceLog: state.fullLog,
        date: new Date().toISOString().slice(0, 10),
      }
      setLocalBoard(recordRun(run))
      void syncRun(run)
    }
    if (state.screen === 'start') recordedRef.current = false
  }, [state])

  if (route === '#author') {
    return (
      <AuthorTool
        builtIn={SCENARIOS}
        custom={custom}
        onChange={(next) => {
          setCustom(next)
          saveCustomScenarios(next)
        }}
      />
    )
  }

  if (route === '#dashboard') {
    return <ManagerDashboard scenarios={{ ...scenarios, ...WORLD_SCENARIO_INDEX }} />
  }

  if (route === '#world') {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-club-900 flex items-center justify-center text-cream-100 font-display">
            ⛳ Opening the grounds…
          </div>
        }
      >
        <WorldGame />
      </Suspense>
    )
  }

  const currentScenario = state.currentScenarioId
    ? scenarios[state.currentScenarioId]
    : null

  const lastScenario = state.lastChoice ? scenarios[state.lastChoice.scenarioId] : null
  const lastChoice =
    lastScenario?.choices.find((c) => c.id === state.lastChoice?.choiceId) ?? null

  if (state.screen === 'start') {
    return (
      <StartScreen
        savedGame={savedGame}
        leaderboard={leaderboard}
        onStart={(name) => dispatch({ type: 'START', playerName: name })}
        onResume={() => savedGame && dispatch({ type: 'RESUME', state: savedGame })}
      />
    )
  }

  return (
    <div className="min-h-screen">
      {state.screen !== 'gameOver' && <Dashboard state={state} />}

      {state.screen === 'seasonIntro' && (
        <SeasonIntro state={state} onBegin={() => dispatch({ type: 'BEGIN_SEASON' })} />
      )}

      {state.screen === 'scenario' && currentScenario && (
        <ScenarioCard
          scenario={currentScenario}
          position={state.scenarioPos + 1}
          total={state.seasonQueue.length}
          onChoose={(choiceId) => dispatch({ type: 'CHOOSE', choiceId })}
        />
      )}

      {state.screen === 'feedback' && lastScenario && lastChoice && (
        <FeedbackPanel
          scenario={lastScenario}
          choice={lastChoice}
          onContinue={() => dispatch({ type: 'CONTINUE' })}
        />
      )}

      {state.screen === 'boardReview' && (
        <BoardReview state={state} onNext={() => dispatch({ type: 'NEXT_SEASON' })} />
      )}

      {state.screen === 'yearEnd' && (
        <YearEnd state={state} onBeginYear={() => dispatch({ type: 'BEGIN_YEAR' })} />
      )}

      {state.screen === 'gameOver' && (
        <GameOver
          state={state}
          leaderboard={leaderboard}
          onRestart={() => dispatch({ type: 'RESTART' })}
        />
      )}
    </div>
  )
}
