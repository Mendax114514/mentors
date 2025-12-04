export type Persona = {
  id: string
  name: string
  cost: number
  effects: {
    attributes?: Partial<{
      academicScore: number
      funding: number
      reputation: number
      studentLoyalty: number
    }>
    hidden?: Partial<{
      exploitEfficiency: number
      studentSatisfaction: number
      networkingPower: number
    }>
  }
  tag: '学术' | '学生' | '社交'
  description?: string
}

export const personas: Persona[] = [
  {
    id: 'overseas-scholar',
    name: '海外学者',
    cost: 8,
    tag: '学术',
    effects: {
      attributes: { reputation: 10, academicScore: 5 },
      hidden: { networkingPower: 1.2 }
    },
    description: '海归背景，人脉广，早期声望更高'
  },
  {
    id: 'status-quo',
    name: '守旧派',
    cost: -2,
    tag: '学术',
    effects: {
      attributes: { reputation: -2 },
      hidden: { exploitEfficiency: 1.05 }
    },
    description: '坚持旧有路径，获得额外属性点，但声望略降'
  },
  {
    id: 'slack-king',
    name: '摸鱼王',
    cost: -3,
    tag: '学生',
    effects: {
      attributes: { academicScore: -10 },
      hidden: { studentSatisfaction: 1.1 }
    },
    description: '工作松散，满意度略升，获得额外属性点'
  },
  {
    id: 'forum-warrior',
    name: '论坛键政',
    cost: -2,
    tag: '社交',
    effects: {
      attributes: { reputation: -7 },
      hidden: { networkingPower: 1.05 }
    },
    description: '社交口碑下降，获得额外属性点'
  },
  {
    id: 'strict-but-fair',
    name: '苛刻但公平',
    cost: -1,
    tag: '学生',
    effects: {
      attributes: { studentLoyalty: -2, academicScore: 1 },
      hidden: { exploitEfficiency: 1.1 }
    },
    description: '压榨效率略升，学生爱戴下降，获得少量属性点'
  },
  {
    id: 'applied-engineer',
    name: '应用派',
    cost: 6,
    tag: '学术',
    effects: {
      attributes: { academicScore: 6, funding: 8 },
      hidden: { networkingPower: 1.1, projectMultiplierEnterprise: 0.5 }
    },
    description: '偏应用研究，拿横向更容易'
  },
  {
    id: 'academic-master',
    name: '学术大师',
    cost: 10,
    tag: '学术',
    effects: {
      attributes: { academicScore: 30 },
      hidden: { exploitEfficiency: 1.1, projectMultiplierNational: 0.5 }
    },
    description: '论文把握能力强，科研推进更快'
  },
  {
    id: 'theorist',
    name: '理论派',
    cost: 6,
    tag: '学术',
    effects: {
      attributes: { academicScore: 20 },
      hidden: { studentSatisfaction: 0.95 }
    },
    description: '偏重理论，学生满意度略受影响'
  },
  {
    id: 'affable',
    name: '平易近人',
    cost: 5,
    tag: '学生',
    effects: {
      attributes: { studentLoyalty: 12, reputation: 3 },
      hidden: { studentSatisfaction: 1.1, loyaltyRateBonus: 1 }
    },
    description: '学生满意度高，招生更顺畅'
  },
  {
    id: 'strict-mentor',
    name: '严师',
    cost: 4,
    tag: '学生',
    effects: {
      attributes: { academicScore: 3 },
      hidden: { studentSatisfaction: 0.9, exploitEfficiency: 1.15 }
    },
    description: '要求严格，推进进度更快但满意度略降'
  },
  {
    id: 'pua-master',
    name: 'PUA大师',
    cost: 4,
    tag: '学生',
    effects: {
      attributes: { academicScore: 4 },
      hidden: { exploitEfficiency: 1.5, studentSatisfaction: 0.8, loyaltyRateBonus: -1 }
    },
    description: '压榨效率提升，但学生满意度下降'
  },
  {
    id: 'social-master',
    name: '社交大师',
    cost: 7,
    tag: '社交',
    effects: {
      attributes: { reputation: 8, funding: 5 },
      hidden: { networkingPower: 1.4, loyaltyRateBonus: 0.5 }
    },
    description: '拉投资、找合作更容易'
  }
]
