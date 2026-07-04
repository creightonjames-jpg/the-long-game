import { useState } from 'react'
import type { GameState, LeaderboardEntry } from '../engine/types'

export function StartScreen({
  savedGame,
  leaderboard,
  onStart,
  onResume,
}: {
  savedGame: GameState | null
  leaderboard: LeaderboardEntry[]
  onStart: (name: string) => void
  onResume: () => void
}) {
  const [name, setName] = useState('')

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">⛳</div>
          <h1 className="font-display text-4xl text-club-800 font-bold">The Long Game</h1>
          <p className="font-display italic text-club-700 mt-2">A Country Club GM Simulator · Cedar Ridge Country Club</p>
          <p className="text-sm text-club-900/70 mt-4 leading-relaxed">
            You are the newly hired General Manager / COO of a private, member-owned club.
            Over two years, keep the members delighted, the board confident, the staff loyal,
            and the P&L in the black — by making the calls a real GM makes, and living with
            the consequences.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-cream-200 shadow-sm p-6">
          <label className="block text-sm font-medium text-club-900/80 mb-2">
            Your name, General Manager
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && onStart(name.trim())}
            placeholder="e.g. J. Creighton"
            className="w-full rounded-lg border border-cream-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-club-500 mb-4"
          />
          <button
            onClick={() => name.trim() && onStart(name.trim())}
            disabled={!name.trim()}
            className="w-full bg-club-800 hover:bg-club-700 disabled:opacity-40 text-white font-semibold rounded-lg py-3 transition-colors"
          >
            Take the Job (classic mode)
          </button>
          <a
            href="#world"
            className="block text-center w-full mt-2 bg-gold-500 hover:bg-gold-600 text-club-900 font-bold rounded-lg py-3 transition-colors"
          >
            🎮 World Edition — walk the club (v2)
          </a>
          {savedGame && (
            <button
              onClick={onResume}
              className="w-full mt-2 border border-club-700 text-club-800 hover:bg-club-100 font-semibold rounded-lg py-3 transition-colors"
            >
              Resume — {savedGame.playerName}, Year {savedGame.year}
            </button>
          )}
        </div>

        {leaderboard.length > 0 && (
          <div className="mt-6 bg-white rounded-xl border border-cream-200 shadow-sm p-6">
            <h2 className="font-display text-lg text-club-800 font-semibold mb-3">
              🏆 Clubhouse Leaderboard
            </h2>
            <ol className="space-y-1.5">
              {leaderboard.map((e, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>
                    <span className="text-club-900/50 mr-2">{i + 1}.</span>
                    {e.name}
                    {e.outcome === 'terminated' && (
                      <span className="ml-2 text-xs text-red-500">(terminated)</span>
                    )}
                  </span>
                  <span className="font-semibold text-gold-600">{e.xp} XP</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <p className="text-center text-[11px] text-club-900/40 mt-6">
          Training content aligned to the CMAA competency framework · Century Golf Partners GM pipeline
        </p>
        <p className="text-center text-xs mt-3 space-x-4">
          <a href="#author" className="text-club-700 hover:underline">
            ✏️ Scenario Studio
          </a>
          <a href="#dashboard" className="text-club-700 hover:underline">
            📊 Manager Dashboard
          </a>
        </p>
      </div>
    </div>
  )
}
