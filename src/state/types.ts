export type Attributes = {
  academic: number
  funds: number
  reputation: number
  studentLove: number
}

export type YearFlags = {
  eventChosen: boolean
  purchased: boolean
}

export type Application = {
  id: string
  name: string
  yearsTotal: number
  yearsLeft: number
  costPerYear: Partial<Attributes>
  rewardOnComplete: Partial<Attributes>
  minRequirement: Partial<Attributes>
}

export type GameState = {
  year: number
  maxYears: number
  attrs: Attributes
  studentCount: number
  application: Application | null
  flags: YearFlags
  gameOver: boolean
  gameOverReason: string | null
}
