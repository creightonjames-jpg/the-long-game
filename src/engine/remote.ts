import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { RunRecord } from './types'

// Remote sync is optional: without VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// the game runs local-only and every function here degrades to a no-op.
// Schema: supabase/schema.sql
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const remoteEnabled = Boolean(url && anonKey)

let client: SupabaseClient | null = null
function getClient(): SupabaseClient | null {
  if (!remoteEnabled) return null
  if (!client) client = createClient(url!, anonKey!)
  return client
}

interface RunRow {
  player_name: string
  xp: number
  outcome: string
  badges: string[]
  competency_scores: RunRecord['competencyScores']
  choice_log: RunRecord['choiceLog']
  created_at?: string
}

export async function syncRun(run: RunRecord): Promise<boolean> {
  const c = getClient()
  if (!c) return false
  const row: RunRow = {
    player_name: run.name,
    xp: run.xp,
    outcome: run.outcome,
    badges: run.badges,
    competency_scores: run.competencyScores,
    choice_log: run.choiceLog,
  }
  const { error } = await c.from('runs').insert(row)
  if (error) console.warn('Supabase sync failed:', error.message)
  return !error
}

export async function fetchRemoteRuns(): Promise<RunRecord[]> {
  const c = getClient()
  if (!c) return []
  const { data, error } = await c
    .from('runs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)
  if (error || !data) {
    if (error) console.warn('Supabase fetch failed:', error.message)
    return []
  }
  return (data as RunRow[]).map((r) => ({
    name: r.player_name,
    xp: r.xp,
    outcome: r.outcome === 'terminated' ? 'terminated' : 'completed',
    badges: r.badges ?? [],
    competencyScores: r.competency_scores,
    choiceLog: r.choice_log ?? [],
    date: (r.created_at ?? '').slice(0, 10),
  }))
}
