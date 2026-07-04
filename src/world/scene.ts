import Phaser from 'phaser'
import { bakeCharSheet, bakeNpc, bakeTerrain, CHAR_PALETTES, COLLISION_INDICES } from './art'
import { buildMap, MAP_H, MAP_W, NPCS, SPAWN, TELEPORTS, ZONES } from './map'
import { TILE, worldBus } from './bus'

const SPEED = 96
const SEVERITY_COLORS: Record<number, string> = { 1: '#e8c84a', 2: '#f08a3c', 3: '#e04a3a' }

export class WorldScene extends Phaser.Scene {
  private gm!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private keys!: Record<string, Phaser.Input.Keyboard.Key>
  private markers = new Map<string, Phaser.GameObjects.Container>()
  private facing = 'down'
  private paused = false
  private lastTile = ''
  private unsubs: (() => void)[] = []

  constructor() {
    super('World')
  }

  preload() {
    this.load.spritesheet('terrain', bakeTerrain(), { frameWidth: TILE, frameHeight: TILE })
    this.load.spritesheet('gm', bakeCharSheet('gm'), { frameWidth: 16, frameHeight: 24 })
    for (const key of Object.keys(CHAR_PALETTES)) {
      if (key !== 'gm') this.load.image(`npc-${key}`, bakeNpc(key))
    }
  }

  create() {
    const map = this.make.tilemap({ data: buildMap(), tileWidth: TILE, tileHeight: TILE })
    const tiles = map.addTilesetImage('terrain')!
    const layer = map.createLayer(0, tiles, 0, 0)!
    layer.setCollision(COLLISION_INDICES)

    this.gm = this.physics.add.sprite(SPAWN.tx * TILE + 8, SPAWN.ty * TILE + 12, 'gm', 0)
    this.gm.setSize(12, 10).setOffset(2, 14).setDepth(10)
    this.physics.add.collider(this.gm, layer)

    for (const [dir, start] of [['down', 0], ['up', 2], ['left', 4], ['right', 6]] as const) {
      this.anims.create({
        key: dir,
        frames: this.anims.generateFrameNumbers('gm', { start, end: start + 1 }),
        frameRate: 6,
        repeat: -1,
      })
    }

    for (const spec of NPCS) {
      this.add.sprite(spec.tx * TILE + 8, spec.ty * TILE + 12, `npc-${spec.palette}`).setDepth(9)
      this.add
        .text(spec.tx * TILE + 8, spec.ty * TILE - 8, spec.name, {
          fontFamily: 'monospace',
          fontSize: '7px',
          color: '#ffffff',
          backgroundColor: '#00000088',
        })
        .setOrigin(0.5)
        .setResolution(3)
        .setDepth(20)
    }

    this.cameras.main.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE)
    this.cameras.main.startFollow(this.gm, true, 0.15, 0.15)
    this.cameras.main.setZoom(2.25)
    this.cameras.main.setBackgroundColor('#14351f')

    this.cursors = this.input.keyboard!.createCursorKeys()
    this.keys = this.input.keyboard!.addKeys('W,A,S,D') as Record<string, Phaser.Input.Keyboard.Key>

    // React → Phaser. Handlers are re-registered per scene instance (HMR-safe);
    // unsubscribed on shutdown so stale scenes never receive events.
    this.unsubs = [
      worldBus.on('pause', () => { this.paused = true; this.gm.setVelocity(0); this.gm.anims.stop() }),
      worldBus.on('resume', () => { this.paused = false }),
      worldBus.on('warp', ({ tx, ty }: { tx: number; ty: number }) => {
        this.gm.setPosition(tx * TILE + 8, ty * TILE + 12)
        this.lastTile = ''
      }),
      worldBus.on('marker:add', (m: { id: string; tx: number; ty: number; severity: number }) => this.addMarker(m)),
      worldBus.on('marker:remove', ({ id }: { id: string }) => {
        this.markers.get(id)?.destroy()
        this.markers.delete(id)
      }),
    ]
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.unsubs.forEach((u) => u())
      this.unsubs = []
    })

    worldBus.emit('ready')
    if (import.meta.env.DEV) (window as any).__worldScene = this
  }

  private addMarker(m: { id: string; tx: number; ty: number; severity: number }) {
    if (this.markers.has(m.id)) return
    const x = m.tx * TILE + 8
    const y = m.ty * TILE - 4
    const bang = this.add
      .text(0, 0, '!', {
        fontFamily: 'monospace',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#ffffff',
        backgroundColor: SEVERITY_COLORS[m.severity] ?? '#e04a3a',
        padding: { x: 4, y: 1 },
      })
      .setOrigin(0.5)
      .setResolution(3)
    const container = this.add.container(x, y, [bang]).setDepth(30)
    this.tweens.add({ targets: container, y: y - 5, duration: 420, yoyo: true, repeat: -1, ease: 'sine.inout' })
    this.markers.set(m.id, container)
  }

  update() {
    if (this.paused) {
      this.gm.setVelocity(0)
      return
    }
    let vx = 0
    let vy = 0
    if (this.cursors.left.isDown || this.keys.A.isDown) vx = -SPEED
    else if (this.cursors.right.isDown || this.keys.D.isDown) vx = SPEED
    if (this.cursors.up.isDown || this.keys.W.isDown) vy = -SPEED
    else if (this.cursors.down.isDown || this.keys.S.isDown) vy = SPEED

    this.gm.setVelocity(vx, vy)
    if (vx < 0) this.facing = 'left'
    else if (vx > 0) this.facing = 'right'
    else if (vy < 0) this.facing = 'up'
    else if (vy > 0) this.facing = 'down'

    if (vx !== 0 || vy !== 0) this.gm.anims.play(this.facing, true)
    else {
      this.gm.anims.stop()
      this.gm.setFrame({ down: 0, up: 2, left: 4, right: 6 }[this.facing] ?? 0)
    }

    const tx = Math.floor(this.gm.x / TILE)
    const ty = Math.floor(this.gm.y / TILE)
    const key = `${tx},${ty}`
    if (key !== this.lastTile) {
      this.lastTile = key
      const tp = TELEPORTS[key]
      if (tp) {
        this.gm.setPosition(tp.tx * TILE + 8, tp.ty * TILE + 12)
        this.lastTile = `${tp.tx},${tp.ty}`
        worldBus.emit('gmTile', { tx: tp.tx, ty: tp.ty, zone: zoneAt(tp.tx, tp.ty) })
        return
      }
      worldBus.emit('gmTile', { tx, ty, zone: zoneAt(tx, ty) })
    }
  }
}

export function zoneAt(tx: number, ty: number): string {
  for (const z of ZONES) {
    if (tx >= z.x && tx < z.x + z.w && ty >= z.y && ty < z.y + z.h) return z.name
  }
  return 'The Grounds'
}

// A stateful Phaser module can't hot-swap safely — force a full reload instead
// of accumulating zombie game instances (see roadmap v2 §10 spike notes).
if (import.meta.hot) import.meta.hot.accept(() => window.location.reload())

export function createWorldGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 640,
    height: 448,
    pixelArt: true,
    roundPixels: true,
    backgroundColor: '#14351f',
    physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [WorldScene],
  })
}
