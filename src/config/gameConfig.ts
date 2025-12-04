import { Attributes, Application } from '../state/types'

export type AttributeWeights = {
  academic: number
  funds: number
  reputation: number
  studentLove: number
}

export type ThresholdEntry = { year: number; score: number }

export type EffectRange = Partial<{
  academic: { min: number; max: number }
  funds: { min: number; max: number }
  reputation: { min: number; max: number }
  studentLove: { min: number; max: number }
}>

export type EventConfig = {
  id: string
  name: string
  description?: string
  effectRange: EffectRange
}

export type PurchaseItem = {
  id: string
  name: string
  cost: number
  effect: Partial<Attributes>
}

export type RecruitRules = {
  cycleYears: number
  graduateRate: number
  baseRecruitMax: number
  loveRecruitDivisor: number
}

export type StartConfig = {
  attrs: Attributes
  studentCount: number
  maxYears: number
}

export type GameConfig = {
  caps: { loveCap: number }
  weights: AttributeWeights
  assessmentThresholds: ThresholdEntry[]
  recruit: RecruitRules
  start: StartConfig
  perYearLimits: { oneEvent: boolean; onePurchase: boolean; singleApplication: boolean }
  events: EventConfig[]
  purchases: PurchaseItem[]
  applications: Omit<Application, 'yearsLeft'>[]
}

export const config: GameConfig = {
  caps: { loveCap: 100 },
  weights: { academic: 0.5, funds: 0, reputation: 0.3, studentLove: 0.2 },
  assessmentThresholds: [
    { year: 5, score: 60 },
    { year: 10, score: 120 },
    { year: 20, score: 240 },
    { year: 30, score: 360 },
    { year: 40, score: 480 },
  ],
  recruit: { cycleYears: 3, graduateRate: 0.33, baseRecruitMax: 2, loveRecruitDivisor: 25 },
  start: { attrs: { academic: 0, funds: 50, reputation: 0, studentLove: 50 }, studentCount: 3, maxYears: 40 },
  perYearLimits: { oneEvent: true, onePurchase: true, singleApplication: true },
  events: [
    {
      id: 'library-encounter',
      name: '图书馆偶遇',
      description: '被采访或结识合作对象',
      effectRange: { reputation: { min: 0, max: 3 }, academic: { min: -1, max: 4 }, studentLove: { min: -2, max: 3 } },
    },
    {
      id: 'paper-rejected',
      name: '论文被拒',
      description: '重投与反思',
      effectRange: { academic: { min: -5, max: 2 }, reputation: { min: -2, max: 1 }, studentLove: { min: -1, max: 2 } },
    },
    {
      id: 'unexpected-donation',
      name: '校友小额捐赠',
      effectRange: { funds: { min: 5, max: 20 }, reputation: { min: 0, max: 2 } },
    },
  ],
  purchases: [
    { id: 'ergonomic-chair', name: '人体工学椅', cost: 8, effect: { studentLove: 3 } },
    { id: 'gpu-4090', name: '旗舰显卡', cost: 20, effect: { academic: 8, reputation: 1 } },
    { id: 'enamel-cup', name: '满是茶垢的搪瓷杯', cost: 1, effect: { reputation: -1, academic: 1 } },
  ],
  applications: [
    {
      id: 'young-grant',
      name: '青年基金',
      yearsTotal: 3,
      costPerYear: { funds: 5 },
      rewardOnComplete: { academic: 20, reputation: 5 },
      minRequirement: { academic: 10, reputation: 2 },
    },
    {
      id: 'key-lab',
      name: '重点实验室子课题',
      yearsTotal: 4,
      costPerYear: { funds: 8 },
      rewardOnComplete: { academic: 30, reputation: 8 },
      minRequirement: { academic: 20, reputation: 5 },
    },
  ],
}

export function thresholdForYear(year: number) {
  const found = config.assessmentThresholds.find(t => t.year === year)
  return found ? found.score : 0
}
