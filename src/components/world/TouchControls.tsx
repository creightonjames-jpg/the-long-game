import { useRef } from 'react'
import { worldBus } from '../../world/bus'

const RADIUS = 44 // knob travel in px

// On-screen controls for touch devices: a left-hand analog thumbstick that
// drives the GM (via the 'move' bus event) and a right-hand context button
// that fires the same interaction as the E key. Hidden on desktop.
export function TouchControls({
  near,
  onInteract,
}: {
  near: { kind: 'event' | 'npc'; label: string } | null
  onInteract: () => void
}) {
  const baseRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const activeId = useRef<number | null>(null)

  const setKnob = (dx: number, dy: number) => {
    if (knobRef.current) knobRef.current.style.transform = `translate(${dx * RADIUS}px, ${dy * RADIUS}px)`
  }

  const compute = (clientX: number, clientY: number) => {
    const base = baseRef.current
    if (!base) return
    const rect = base.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    let dx = (clientX - cx) / RADIUS
    let dy = (clientY - cy) / RADIUS
    const mag = Math.hypot(dx, dy)
    if (mag > 1) { dx /= mag; dy /= mag }
    if (Math.hypot(dx, dy) < 0.22) { dx = 0; dy = 0 } // deadzone
    setKnob(dx, dy)
    worldBus.emit('move', { dx, dy })
  }

  const onDown = (e: React.PointerEvent) => {
    activeId.current = e.pointerId
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* capture unsupported for this pointer — dragging still works */
    }
    compute(e.clientX, e.clientY)
  }
  const onMove = (e: React.PointerEvent) => {
    if (activeId.current !== e.pointerId) return
    compute(e.clientX, e.clientY)
  }
  const onUp = (e: React.PointerEvent) => {
    if (activeId.current !== e.pointerId) return
    activeId.current = null
    setKnob(0, 0)
    worldBus.emit('move', { dx: 0, dy: 0 })
  }

  return (
    <>
      <div
        ref={baseRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="absolute bottom-6 left-6 z-30 h-28 w-28 touch-none select-none rounded-full border-2 border-cream-100/40 bg-club-900/45"
        aria-label="Movement joystick"
      >
        <div
          ref={knobRef}
          className="pointer-events-none absolute left-1/2 top-1/2 -ml-7 -mt-7 h-14 w-14 rounded-full border border-club-900/40 bg-cream-100/80"
        />
      </div>

      <button
        onClick={onInteract}
        className={`absolute bottom-9 right-8 z-30 h-20 w-20 touch-none select-none rounded-full text-sm font-bold shadow-lg transition-all ${
          near
            ? 'scale-110 animate-pulse bg-gold-500 text-club-900'
            : 'border border-cream-100/30 bg-club-900/45 text-cream-100/50'
        }`}
        aria-label={near ? `Interact: ${near.label}` : 'Interact'}
      >
        {near ? (near.kind === 'event' ? 'HANDLE' : 'TALK') : '·'}
      </button>
    </>
  )
}
