import type { GameState, StatKey } from '../engine/types'
import { SEASON_NAMES, STAT_LABELS } from '../engine/types'

const STAT_COLORS: Record<StatKey, string> = {
  financialHealth: 'bg-club-700',
  memberSatisfaction: 'bg-gold-500',
  boardConfidence: 'bg-sky-700',
  staffMorale: 'bg-clay-500',
}

const STAT_ICONS: Record<StatKey, string> = {
  financialHealth: '💰',
  memberSatisfaction: '🥂',
  boardConfidence: '🏛️',
  staffMorale: '🤝',
}

function StatBar({ statKey, value }: { statKey: StatKey; value: number }) {
  const danger = value < 35
  return (
    <div className="flex-1 min-w-[130px]">
      <div className="flex items-center justify-between text-[11px] font-medium text-club-900/70 mb-1">
        <span>
          {STAT_ICONS[statKey]} {STAT_LABELS[statKey]}
        </span>
        <span className={danger ? 'text-red-600 font-bold' : ''}>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-cream-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${danger ? 'bg-red-500' : STAT_COLORS[statKey]}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export function Dashboard({ state }: { state: GameState }) {
  const meddling = state.micromanagement
  return (
    <div className="bg-white/80 backdrop-blur border-b border-cream-200 px-4 py-3 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2 text-xs text-club-900/60">
          <span className="font-display text-sm text-club-800 font-semibold">
            ⛳ Cedar Ridge CC · Year {state.year}, {SEASON_NAMES[state.seasonIndex]}
          </span>
          <span className="font-semibold text-gold-600">{state.xp} XP</span>
        </div>
        <div className="flex gap-4 flex-wrap">
          {(Object.keys(state.stats) as StatKey[]).map((k) => (
            <StatBar key={k} statKey={k} value={state.stats[k]} />
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-club-900/60">
          <span>🌡️ Board Meddling</span>
          <div className="h-1.5 w-36 rounded-full bg-cream-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${meddling >= 55 ? 'bg-red-500' : meddling >= 35 ? 'bg-amber-500' : 'bg-club-500'}`}
              style={{ width: `${meddling}%` }}
            />
          </div>
          {meddling >= 55 && (
            <span className="text-red-600 font-semibold">The board is in your operations</span>
          )}
        </div>
      </div>
    </div>
  )
}
