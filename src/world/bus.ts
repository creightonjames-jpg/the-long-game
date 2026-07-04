// Tiny event bridge between the Phaser world and React.
// Phaser → React: 'ready', 'gmTile' {tx,ty,zone}
// React → Phaser: 'pause', 'resume', 'warp' {tx,ty},
//                 'marker:add' {id,tx,ty,severity}, 'marker:remove' {id}
type Handler = (payload: any) => void

class Bus {
  private handlers: Record<string, Handler[]> = {}
  on(event: string, fn: Handler): () => void {
    ;(this.handlers[event] ??= []).push(fn)
    return () => {
      this.handlers[event] = (this.handlers[event] ?? []).filter((h) => h !== fn)
    }
  }
  emit(event: string, payload?: any): void {
    for (const fn of this.handlers[event] ?? []) fn(payload)
  }
}

export const worldBus = new Bus()
export const TILE = 16
