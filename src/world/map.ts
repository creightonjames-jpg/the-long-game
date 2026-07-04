// Cedar Ridge as one tile grid: exterior grounds (rows 0–31) and the clubhouse
// interior (rows 32–47), connected by door teleports. Frame indices match
// TERRAIN_TILES in art.ts:
// 0 grass 1 path 2 water 3 sand 4 tree 5 wall 6 roof 7 floor 8 green 9 flower 10 door 11 court 12 rough

export const MAP_W = 40
export const MAP_H = 48

const G = 0, P = 1, W = 2, S = 3, T = 4, WA = 5, R = 6, F = 7, GR = 8, FL = 9, D = 10, C = 11, RO = 12

function rect(m: number[][], x: number, y: number, w: number, h: number, v: number) {
  for (let j = y; j < y + h; j++)
    for (let i = x; i < x + w; i++) if (m[j]?.[i] !== undefined) m[j][i] = v
}

export function buildMap(): number[][] {
  const m = Array.from({ length: MAP_H }, () => Array.from({ length: MAP_W }, () => G))

  // Perimeter trees + the band separating exterior from interior section.
  rect(m, 0, 0, MAP_W, 1, T)
  rect(m, 0, 0, 1, MAP_H, T)
  rect(m, MAP_W - 1, 0, 1, MAP_H, T)
  rect(m, 0, MAP_H - 1, MAP_W, 1, T)
  rect(m, 0, 29, MAP_W, 3, T)

  // --- Exterior grounds ---
  // Parking lot (top-left)
  rect(m, 3, 2, 7, 4, P)
  // Golf course (right side): rough, greens, bunkers
  rect(m, 26, 2, 12, 12, RO)
  rect(m, 30, 4, 4, 4, GR)
  rect(m, 28, 9, 3, 2, S)
  rect(m, 34, 10, 3, 2, S)
  // Paths
  rect(m, 3, 14, 34, 2, P) // main east-west
  rect(m, 10, 5, 2, 10, P) // parking → main
  rect(m, 18, 12, 2, 3, P) // clubhouse door → main
  rect(m, 10, 16, 2, 11, P) // main → pool/tennis
  rect(m, 22, 16, 2, 11, P) // main → maintenance/range
  // Clubhouse (exterior shell)
  rect(m, 14, 6, 10, 6, R)
  m[11][18] = D
  m[11][19] = D
  // Pro shop
  rect(m, 4, 8, 4, 3, R)
  m[10][5] = D
  // Pool
  rect(m, 4, 18, 6, 5, S)
  rect(m, 5, 19, 4, 3, W)
  // Tennis
  rect(m, 13, 19, 3, 4, C)
  rect(m, 17, 19, 3, 4, C)
  // Maintenance building
  rect(m, 25, 22, 4, 3, R)
  m[24][26] = D
  // Driving range
  rect(m, 30, 21, 8, 7, RO)
  rect(m, 31, 22, 2, 5, GR)
  // Flowers
  m[3][12] = FL; m[16][6] = FL; m[17][30] = FL; m[5][24] = FL

  // --- Clubhouse interior ---
  rect(m, 1, 32, 38, 16, F) // floor slab
  // Ring walls
  rect(m, 1, 32, 38, 1, WA)
  rect(m, 1, 47, 38, 1, WA)
  rect(m, 1, 32, 1, 16, WA)
  rect(m, 38, 32, 1, 16, WA)
  // Top rooms: Dining | Kitchen | Ballroom (dividers)
  rect(m, 14, 33, 1, 7, WA)
  rect(m, 24, 33, 1, 7, WA)
  // Wall between top rooms and corridor, with doorways
  rect(m, 2, 40, 36, 1, WA)
  m[40][7] = F; m[40][8] = F
  m[40][19] = F; m[40][20] = F
  m[40][30] = F; m[40][31] = F
  // Corridor rows 41–42 (already floor)
  // Wall between corridor and bottom rooms, with doorways
  rect(m, 2, 43, 36, 1, WA)
  m[43][7] = F; m[43][8] = F
  m[43][19] = F; m[43][20] = F
  m[43][30] = F; m[43][31] = F
  // Bottom rooms: Admin | Fitness | Facilities (dividers)
  rect(m, 14, 44, 1, 3, WA)
  rect(m, 24, 44, 1, 3, WA)
  // Exit door (east end of corridor) → teleports outside
  m[41][38] = D
  m[42][38] = D

  return m
}

/** Stepping onto key → GM appears at value. */
export const TELEPORTS: Record<string, { tx: number; ty: number }> = {
  '18,11': { tx: 19, ty: 41 }, // clubhouse front door → lobby
  '19,11': { tx: 19, ty: 41 },
  '38,41': { tx: 19, ty: 13 }, // lobby east door → outside the clubhouse
  '38,42': { tx: 19, ty: 13 },
}

export interface Zone {
  name: string
  x: number
  y: number
  w: number
  h: number
}

// First match wins — interior rooms before broad exterior regions.
export const ZONES: Zone[] = [
  { name: 'Dining Room', x: 2, y: 33, w: 12, h: 7 },
  { name: 'Kitchen', x: 15, y: 33, w: 9, h: 7 },
  { name: 'Ballroom', x: 25, y: 33, w: 13, h: 7 },
  { name: 'Admin Offices', x: 2, y: 44, w: 12, h: 3 },
  { name: 'Fitness Room', x: 15, y: 44, w: 9, h: 3 },
  { name: 'Facilities Office', x: 25, y: 44, w: 13, h: 3 },
  { name: 'Clubhouse Lobby', x: 2, y: 41, w: 37, h: 2 },
  { name: 'Parking Lot', x: 2, y: 1, w: 9, h: 6 },
  { name: 'Golf Course', x: 26, y: 2, w: 13, h: 12 },
  { name: 'Pro Shop', x: 3, y: 7, w: 6, h: 5 },
  { name: 'Pool', x: 3, y: 17, w: 8, h: 7 },
  { name: 'Tennis Courts', x: 12, y: 18, w: 9, h: 6 },
  { name: 'Maintenance', x: 24, y: 21, w: 6, h: 5 },
  { name: 'Driving Range', x: 30, y: 21, w: 9, h: 7 },
  { name: 'Clubhouse', x: 13, y: 5, w: 12, h: 8 },
]

/** Where event markers appear (and where events "happen") per zone. */
export const ANCHORS: Record<string, { tx: number; ty: number }> = {
  'Parking Lot': { tx: 5, ty: 4 },
  'Golf Course': { tx: 31, ty: 8 },
  'Pro Shop': { tx: 6, ty: 12 },
  Pool: { tx: 7, ty: 23 },
  'Tennis Courts': { tx: 16, ty: 21 },
  Maintenance: { tx: 26, ty: 26 },
  'Driving Range': { tx: 34, ty: 25 },
  'Dining Room': { tx: 7, ty: 36 },
  Kitchen: { tx: 19, ty: 36 },
  Ballroom: { tx: 30, ty: 36 },
  'Admin Offices': { tx: 7, ty: 45 },
  'Fitness Room': { tx: 19, ty: 45 },
  'Facilities Office': { tx: 30, ty: 45 },
  'Clubhouse Lobby': { tx: 19, ty: 42 },
}

export interface NpcSpec {
  id: string
  name: string
  palette: string
  tx: number
  ty: number
  flavor: string
}

export const NPCS: NpcSpec[] = [
  { id: 'pro', name: 'Head Pro', palette: 'pro', tx: 6, ty: 13, flavor: '"Tee sheet\'s full through two o\'clock. Good day to be us."' },
  { id: 'president', name: 'Hal Whitmore', palette: 'board', tx: 21, ty: 13, flavor: '"Walk with me sometime — the members like seeing their GM outside."' },
  { id: 'member', name: 'Mrs. Ashford', palette: 'member', tx: 12, ty: 16, flavor: '"Lovely morning! The hydrangeas by the ninth are spectacular this year."' },
  { id: 'super', name: 'Superintendent', palette: 'super', tx: 26, ty: 27, flavor: '"Greens are rolling true today. Don\'t let anyone tell you different."' },
  { id: 'aquatics', name: 'Aquatics Mgr', palette: 'staff', tx: 8, ty: 23, flavor: '"Chairs out, chemicals balanced, guards briefed. We\'re ready."' },
  { id: 'tennis', name: 'Tennis Pro', palette: 'staff', tx: 16, ty: 23, flavor: '"Clinic at four — we\'ve got twelve juniors signed up. Twelve!"' },
  { id: 'chef', name: 'Chef Laurent', palette: 'chef', tx: 18, ty: 37, flavor: '"Taste this reduction later. It will change your afternoon."' },
  { id: 'elena', name: 'Elena Ruiz', palette: 'fnb', tx: 8, ty: 37, flavor: '"Forty-two covers on the books tonight. The room will sing."' },
  { id: 'catering', name: 'Danielle', palette: 'staff', tx: 30, ty: 37, flavor: '"Saturday\'s floor plan is on your desk. Third revision. Don\'t ask."' },
  { id: 'controller', name: 'Controller', palette: 'suit', tx: 6, ty: 45, flavor: '"Month-end close is Tuesday. I\'ll have the variance detail ready."' },
  { id: 'facilities', name: 'Gus', palette: 'suit', tx: 29, ty: 45, flavor: '"Boiler\'s humming. She\'s older than both of us, but she\'s humming."' },
]

export const SPAWN = { tx: 19, ty: 15 }
