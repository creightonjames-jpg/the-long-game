import type { GameState, LeaderboardEntry, RunRecord } from './types'

const SAVE_KEY = 'club-gm-sim:save:v1'
const LEADERBOARD_KEY = 'club-gm-sim:leaderboard:v1'
const RUNS_KEY = 'club-gm-sim:runs:v1'

export function saveGame(state: GameState): void {
  try {
    if (state.screen === 'start') return
    localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable (private mode etc.) — play without persistence
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const state = JSON.parse(raw) as GameState
    // Never resume into a finished game.
    if (state.screen === 'gameOver') return null
    // Hydrate fields added after older saves were written.
    state.fullLog = state.fullLog ?? []
    return state
  } catch {
    return null
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    /* noop */
  }
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY)
    return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : []
  } catch {
    return []
  }
}

export function loadRuns(): RunRecord[] {
  try {
    const raw = localStorage.getItem(RUNS_KEY)
    return raw ? (JSON.parse(raw) as RunRecord[]) : []
  } catch {
    return []
  }
}

export function recordRun(run: RunRecord): LeaderboardEntry[] {
  try {
    localStorage.setItem(RUNS_KEY, JSON.stringify([...loadRuns(), run]))
  } catch {
    /* noop */
  }
  const entry: LeaderboardEntry = {
    name: run.name,
    xp: run.xp,
    badges: run.badges,
    outcome: run.outcome,
    date: run.date,
  }
  const board = [...loadLeaderboard(), entry]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10)
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board))
  } catch {
    /* noop */
  }
  return board
}
