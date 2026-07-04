// Original NES-style pixel art, generated in code and baked to data-URL
// spritesheets at load. No external image assets — license-clean and owned.
// Flat colors, no gradients, 3–4 colors per sprite, per the art direction.

const P = {
  grass: '#5aa02c',
  grassDk: '#3f7d1f',
  rough: '#47861f',
  path: '#d9c08a',
  pathDk: '#c2a566',
  sand: '#e6d6a8',
  water: '#3a86c8',
  waterLt: '#6fb3e0',
  wall: '#b9532f',
  wallDk: '#8a3c22',
  roof: '#7a4a2e',
  roofDk: '#5e3822',
  floor: '#caa06a',
  floorDk: '#a5814f',
  green: '#4fae3f',
  greenDk: '#3c8a30',
  door: '#3a2a1a',
  court: '#b6603a',
  courtLine: '#f0e6d0',
  trunk: '#6e4a25',
  leaf: '#2f6b1f',
  leafDk: '#245417',
  skin: '#eab88a',
  hair: '#3a2a1a',
  navy: '#26467f',
  navyDk: '#1a3159',
  dark: '#333333',
  white: '#e8e8e8',
  chefW: '#dfe3e6',
  green2: '#2f7d4f',
  khaki: '#b6a06a',
  red: '#b23b32',
}

type Grid = (string | null)[][]

function canvasOf(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  return [c, ctx]
}

function drawGrid(ctx: CanvasRenderingContext2D, grid: Grid, ox: number, oy: number) {
  for (let y = 0; y < grid.length; y++)
    for (let x = 0; x < grid[y].length; x++) {
      const col = grid[y][x]
      if (!col) continue
      ctx.fillStyle = col
      ctx.fillRect(ox + x, oy + y, 1, 1)
    }
}

function fill(base: string): Grid {
  return Array.from({ length: 16 }, () => Array.from({ length: 16 }, () => base))
}
function speck(g: Grid, color: string, coords: [number, number][]) {
  for (const [x, y] of coords) g[y][x] = color
  return g
}

const SPECKS: [number, number][] = [
  [2, 3], [11, 2], [5, 8], [14, 6], [8, 12], [3, 13], [13, 11], [7, 5],
]

function tileGrass(): Grid {
  return speck(fill(P.grass), P.grassDk, SPECKS)
}
function tilePath(): Grid {
  return speck(fill(P.path), P.pathDk, [[1, 1], [6, 4], [12, 9], [3, 11], [9, 14], [14, 2]])
}
function tileWater(): Grid {
  const g = fill(P.water)
  for (const y of [3, 8, 13]) for (let x = 2; x < 14; x += 4) { g[y][x] = P.waterLt; g[y][x + 1] = P.waterLt }
  return g
}
function tileSand(): Grid {
  return speck(fill(P.sand), P.pathDk, [[4, 5], [10, 10], [13, 3]])
}
function tileTree(): Grid {
  const g = fill(P.grass)
  for (let y = 0; y < 11; y++)
    for (let x = 2; x < 14; x++) {
      const dx = x - 8, dy = y - 5
      if (dx * dx + dy * dy < 34) g[y][x] = (x + y) % 3 === 0 ? P.leafDk : P.leaf
    }
  for (let y = 11; y < 16; y++) { g[y][7] = P.trunk; g[y][8] = P.trunk }
  return g
}
function tileWall(): Grid {
  const g = fill(P.wall)
  for (let y = 0; y < 16; y++) g[y][0] = P.wallDk
  for (let x = 0; x < 16; x++) { g[0][x] = P.wallDk; g[15][x] = P.wallDk }
  for (const y of [5, 10]) for (let x = 1; x < 15; x++) g[y][x] = P.wallDk
  return g
}
function tileRoof(): Grid {
  const g = fill(P.roof)
  for (let y = 0; y < 16; y += 3) for (let x = 0; x < 16; x++) g[y][x] = P.roofDk
  return g
}
function tileFloor(): Grid {
  const g = fill(P.floor)
  for (let x = 0; x < 16; x++) { g[0][x] = P.floorDk; g[8][x] = P.floorDk }
  return g
}
function tileGreen(): Grid {
  return speck(fill(P.green), P.greenDk, SPECKS)
}
function tileFlower(): Grid {
  const g = fill(P.grass)
  for (const [x, y] of [[3, 3], [7, 5], [11, 3], [5, 9], [10, 10], [13, 7]] as [number, number][]) {
    g[y][x] = P.red
    g[y][x + 1] = P.white
  }
  return g
}
function tileDoor(): Grid {
  const g = tileWall()
  for (let y = 3; y < 16; y++) for (let x = 4; x < 12; x++) g[y][x] = P.door
  return g
}
function tileCourt(): Grid {
  const g = fill(P.court)
  for (let x = 0; x < 16; x++) g[0][x] = P.courtLine
  for (let y = 0; y < 16; y++) g[y][0] = P.courtLine
  g[8][8] = P.courtLine
  return g
}
function tileRough(): Grid {
  return speck(fill(P.rough), P.grassDk, SPECKS)
}

export const TERRAIN_TILES = [
  tileGrass(), // 0
  tilePath(), // 1
  tileWater(), // 2
  tileSand(), // 3
  tileTree(), // 4
  tileWall(), // 5
  tileRoof(), // 6
  tileFloor(), // 7
  tileGreen(), // 8
  tileFlower(), // 9
  tileDoor(), // 10
  tileCourt(), // 11
  tileRough(), // 12
]

export const COLLISION_INDICES = [2, 4, 5, 6] // water, tree, wall, roof

export function bakeTerrain(): string {
  const [c, ctx] = canvasOf(16 * TERRAIN_TILES.length, 16)
  TERRAIN_TILES.forEach((t, i) => drawGrid(ctx, t, i * 16, 0))
  return c.toDataURL()
}

export interface CharPalette {
  skin: string
  hair: string
  shirt: string
  shirtDk: string
  pants: string
}

export const CHAR_PALETTES: Record<string, CharPalette> = {
  gm: { skin: P.skin, hair: P.hair, shirt: P.navy, shirtDk: P.navyDk, pants: P.dark },
  chef: { skin: P.skin, hair: P.hair, shirt: P.chefW, shirtDk: '#b9bec2', pants: P.dark },
  super: { skin: P.skin, hair: '#5a3a1a', shirt: P.green2, shirtDk: '#215a38', pants: P.khaki },
  pro: { skin: P.skin, hair: '#caa04a', shirt: P.white, shirtDk: '#c2c2c2', pants: P.navy },
  board: { skin: P.skin, hair: '#9a9a9a', shirt: P.red, shirtDk: '#8a2c25', pants: P.dark },
  member: { skin: P.skin, hair: '#3a2a1a', shirt: '#d0a020', shirtDk: '#a87f18', pants: P.khaki },
  fnb: { skin: P.skin, hair: '#2a2a2a', shirt: '#6a3d8a', shirtDk: '#4e2c66', pants: P.dark },
  suit: { skin: P.skin, hair: '#6a6a6a', shirt: '#8a8f98', shirtDk: '#666b73', pants: P.dark },
  staff: { skin: P.skin, hair: '#2a2a1a', shirt: '#2f8f8a', shirtDk: '#1f6a66', pants: P.dark },
}

// dir: 0 down, 1 up, 2 left, 3 right ; frame: 0 stand, 1 step
function drawChar(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  p: CharPalette,
  dir: number,
  frame: number,
) {
  const px = (x: number, y: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(ox + x, oy + y, 1, 1) }
  const r = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(ox + x, oy + y, w, h) }

  r(4, 2, 8, 8, p.skin)
  if (dir === 1) {
    r(4, 2, 8, 6, p.hair)
  } else {
    r(4, 2, 8, 3, p.hair)
    if (dir === 0) { px(6, 6, P.dark); px(9, 6, P.dark) }
    if (dir === 2) px(5, 6, P.dark)
    if (dir === 3) px(10, 6, P.dark)
  }
  r(4, 10, 8, 8, p.shirt)
  r(4, 10, 8, 1, p.shirtDk)
  px(3, 11, p.shirtDk)
  px(12, 11, p.shirtDk)
  const legY = 18
  if (frame === 0) {
    r(5, legY, 3, 6, p.pants)
    r(9, legY, 3, 6, p.pants)
  } else {
    r(4, legY, 3, 6, p.pants)
    r(10, legY, 3, 6, p.pants)
  }
}

/** Animated 8-frame sheet (4 directions × 2 frames), 16×24 each. */
export function bakeCharSheet(paletteKey: string): string {
  const p = CHAR_PALETTES[paletteKey]
  const [c, ctx] = canvasOf(16 * 8, 24)
  let f = 0
  for (let dir = 0; dir < 4; dir++)
    for (let frame = 0; frame < 2; frame++) {
      drawChar(ctx, f * 16, 0, p, dir, frame)
      f++
    }
  return c.toDataURL()
}

/** Static front-facing 16×24 NPC frame. */
export function bakeNpc(paletteKey: string): string {
  const p = CHAR_PALETTES[paletteKey]
  const [c, ctx] = canvasOf(16, 24)
  drawChar(ctx, 0, 0, p, 0, 0)
  return c.toDataURL()
}
