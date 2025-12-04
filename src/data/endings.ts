export type EndingRule = {
  id: string
  name: string
  tier: 'normal' | 'legendary' | 'hidden'
  sequence?: string[]
  sequenceOptions?: Record<string, string>
  requiredEquipmentIds?: string[]
  minAttrs?: Partial<{ academicScore: number; funding: number; reputation: number; studentLoyalty: number }>
  maxAttrs?: Partial<{ academicScore: number; funding: number; reputation: number; studentLoyalty: number }>
  minYear?: number
  triggerAtEndOnly?: boolean
}

export const endings: EndingRule[] = [
  {
    id: 'business_elite',
    name: '传奇结局：商界精英',
    tier: 'legendary',
    sequence: ['alumni_donation', 'enterprise_collab_deepening', 'market_launch', 'board_invite', 'ipo_preparation'],
    sequenceOptions: { enterprise_collab_deepening: 'sign_pilot', market_launch: 'launch', board_invite: 'accept_seat', ipo_preparation: 'file_prospectus' },
    minAttrs: { reputation: 60, funding: 50 },
    minYear: 20,
  },
  {
    id: 'imprisoned',
    name: '隐藏结局：阶下囚',
    tier: 'hidden',
    sequence: ['report_scandal', 'disciplinary_hearing', 'evidence_escalation', 'court_trial'],
    sequenceOptions: { report_scandal: 'pressure_students', disciplinary_hearing: 'refuse_cooperation', evidence_escalation: 'deny_allegations', court_trial: 'accept_verdict' },
    maxAttrs: { studentLoyalty: 10, reputation: 20 },
    minYear: 10,
  },
  {
    id: 'mechanical_ascension',
    name: '隐藏结局：机械飞升',
    tier: 'hidden',
    sequence: ['ai_breakthrough'],
    requiredEquipmentIds: ['equipment_11', 'equipment_1a', 'equipment_7a'],
    minAttrs: { academicScore: 95 },
  },
  {
    id: 'alien_visit',
    name: '隐藏结局：探访外星',
    tier: 'hidden',
    sequence: ['alien_clue', 'signal_analysis', 'contact_protocol', 'alien_contact'],
    minAttrs: { reputation: 85 },
  },
  {
    id: 'distinguished_politician',
    name: '传奇结局：杰出政客',
    tier: 'legendary',
    sequence: ['policy_whitepaper', 'public_hearing', 'education_reform_pilot', 'city_council_advisory'],
    sequenceOptions: {
      policy_whitepaper: 'draft_submit',
      public_hearing: 'speak_support',
      education_reform_pilot: 'run_pilot',
      city_council_advisory: 'accept_advisory'
    },
    minAttrs: { reputation: 90 },
  },
  {
    id: 'nobel_prize',
    name: '传奇结局：诺贝尔奖',
    tier: 'legendary',
    sequence: ['paper_publication', 'conference_invitation', 'ai_breakthrough', 'grant_breakthrough', 'global_keynote'],
    minAttrs: { academicScore: 95, reputation: 90 },
    minYear: 25,
  },
  {
    id: 'academy_member',
    name: '传奇结局：院士',
    tier: 'legendary',
    sequence: ['paper_publication', 'department_meeting', 'media_feature', 'regional_forum'],
    minAttrs: { reputation: 95 },
    minYear: 25,
  },
  {
    id: 'teacher_of_centuries',
    name: '传奇结局：万世师表',
    tier: 'legendary',
    sequence: ['excellent_teaching_award'],
    minAttrs: { studentLoyalty: 90, reputation: 85 },
    minYear: 20,
  },
]

export function checkEnding(params: {
  attributes: { academicScore: number; funding: number; reputation: number; studentLoyalty: number }
  eventHistory: Array<{ eventId: string; optionId?: string }>
  purchasedEquipmentIds: string[]
  currentYear?: number
  maxYears?: number
}): { id: string; name: string; tier: 'normal' | 'legendary' | 'hidden' } | null {
  const { attributes, eventHistory, purchasedEquipmentIds, currentYear = 0, maxYears = 40 } = params
  for (const rule of endings) {
    // sequence in-order check (not necessarily contiguous)
    if (rule.sequence && rule.sequence.length) {
      let idx = 0
      for (const h of eventHistory) {
        if (h.eventId === rule.sequence[idx]) {
          idx++
          if (idx >= rule.sequence.length) break
        }
      }
      if (idx < rule.sequence.length) continue
    }
    if (rule.requiredEquipmentIds && rule.requiredEquipmentIds.length) {
      const ok = rule.requiredEquipmentIds.every(id => purchasedEquipmentIds.includes(id))
      if (!ok) continue
    }
    if (rule.sequenceOptions) {
      let ok = true
      for (const [ev, opt] of Object.entries(rule.sequenceOptions)) {
        const found = eventHistory.find(h => h.eventId === ev && h.optionId === opt)
        if (!found) { ok = false; break }
      }
      if (!ok) continue
    }
    if (rule.minYear && currentYear < rule.minYear) continue
    if (rule.triggerAtEndOnly && currentYear < maxYears) continue
    if (rule.minAttrs) {
      let ok = true
      for (const [k, v] of Object.entries(rule.minAttrs)) {
        if ((attributes as any)[k] < (v as number)) { ok = false; break }
      }
      if (!ok) continue
    }
    if (rule.maxAttrs) {
      let ok = true
      for (const [k, v] of Object.entries(rule.maxAttrs)) {
        if ((attributes as any)[k] > (v as number)) { ok = false; break }
      }
      if (!ok) continue
    }
    return { id: rule.id, name: rule.name, tier: rule.tier }
  }
  return null
}

// 任务链起始事件池（用于在链路断开后随机开启新的链路）
export const chainStartEvents = ['alumni_donation', 'paper_publication', 'department_meeting', 'excellent_teaching_award', 'policy_whitepaper']
export const hiddenChainStartEvents = ['alien_clue', 'ai_breakthrough']
