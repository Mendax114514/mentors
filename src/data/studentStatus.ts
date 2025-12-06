export type StudentStatus = {
  id: string
  name: string
  positive?: boolean
  effects: {
    guidanceBonus?: { loyalty?: number; favor?: number }
    passiveDrift?: { loyalty?: number }
    outputMultiplier?: { academic?: number; funding?: number; reputation?: number }
  }
}

export const studentStatuses: StudentStatus[] = [
  { id: 'anxiety', name: '焦虑', effects: { guidanceBonus: { loyalty: 1, favor: 2 }, passiveDrift: { loyalty: -1 }, outputMultiplier: { academic: 0.8, funding: 0.9, reputation: 0.9 } } },
  { id: 'in_love', name: '恋爱', effects: { guidanceBonus: { favor: 2 }, passiveDrift: { loyalty: 0 }, outputMultiplier: { academic: 0.9, funding: 0.95, reputation: 1 } } },
  { id: 'burnout', name: '倦怠', effects: { guidanceBonus: { loyalty: 2, favor: 1 }, passiveDrift: { loyalty: -2 }, outputMultiplier: { academic: 0.6, funding: 0.8, reputation: 0.8 } } },
  { id: 'motivated', name: '积极', positive: true, effects: { guidanceBonus: { loyalty: 1, favor: 1 }, passiveDrift: { loyalty: 1 }, outputMultiplier: { academic: 1.2, funding: 1.1, reputation: 1.1 } } },
  { id: 'lazy', name: '懒惰', effects: { guidanceBonus: { loyalty: 1 }, passiveDrift: { loyalty: -1 }, outputMultiplier: { academic: 0.5, funding: 0.8, reputation: 0.8 } } },
  { id: 'moyu', name: '摸鱼', effects: { guidanceBonus: { loyalty: 1 }, passiveDrift: { loyalty: -1 }, outputMultiplier: { academic: 0.3, funding: 0.7, reputation: 0.7 } } },
  { id: 'yuyu', name: '玉玉症', effects: { guidanceBonus: { favor: 1 }, passiveDrift: { loyalty: -1 }, outputMultiplier: { academic: 0.4, funding: 0.8, reputation: 0.8 } } },
]

export const statusAssignConfig = {
  enable: true,
  probabilities: [
    { id: 'anxiety', p: 0.10 },
    { id: 'in_love', p: 0.06 },
    { id: 'burnout', p: 0.06 },
    { id: 'motivated', p: 0.08 },
    { id: 'lazy', p: 0.06 },
    { id: 'moyu', p: 0.06 },
    { id: 'yuyu', p: 0.03 },
  ]
}

export function randomStatus(): string | undefined {
  if (!statusAssignConfig.enable) return undefined
  const r = Math.random()
  let acc = 0
  for (const { id, p } of statusAssignConfig.probabilities) {
    acc += p
    if (r < acc) return id
  }
  return undefined
}
