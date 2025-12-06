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
  },
  {
    id: 'imprisoned',
    name: '隐藏结局：阶下囚',
    tier: 'hidden',
    sequence: ['report_scandal', 'disciplinary_hearing', 'evidence_escalation', 'court_trial'],
    sequenceOptions: { report_scandal: 'pressure_students', disciplinary_hearing: 'refuse_cooperation', evidence_escalation: 'deny_allegations', court_trial: 'accept_verdict' },
    maxAttrs: { studentLoyalty: 10, reputation: 20 },
  },
  {
    id: 'mechanical_ascension',
    name: '隐藏结局：机械飞升',
    tier: 'hidden',
    sequence: ['ai_breakthrough', 'cybernetics_implant', 'mind_upload_trial', 'posthuman_transition'],
    sequenceOptions: { ai_breakthrough: 'publish_and_open', cybernetics_implant: 'approve_implant', mind_upload_trial: 'conduct_upload', posthuman_transition: 'accept_transition' },
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
  },
  {
    id: 'academy_member',
    name: '传奇结局：院士',
    tier: 'legendary',
    sequence: ['paper_publication', 'department_meeting', 'media_feature', 'regional_forum'],
    minAttrs: { reputation: 95 },
  },
  {
    id: 'teacher_of_centuries',
    name: '传奇结局：万世师表',
    tier: 'legendary',
    sequence: ['excellent_teaching_award', 'pedagogy_reform', 'mentorship_program', 'community_outreach', 'teaching_mastery'],
    sequenceOptions: {
      excellent_teaching_award: 'actively_campaign',
      pedagogy_reform: 'curriculum_update',
      mentorship_program: 'launch_program',
      community_outreach: 'run_outreach',
      teaching_mastery: 'accept_mastery'
    },
    minAttrs: { studentLoyalty: 90, reputation: 85 },
  },
  {
    id: 'research_partner_ending',
    name: '传奇结局：科研伴侣幸福',
    tier: 'legendary',
    sequence: ['research_partner_encounter', 'research_partner_develop', 'research_partner_commit', 'research_partner_bliss'],
    sequenceOptions: {
      research_partner_encounter: 'pursue_partner',
      research_partner_develop: 'collaborate_research',
      research_partner_commit: 'accept_commitment',
      research_partner_bliss: 'embrace_life'
    },
    minAttrs: { reputation: 50, academicScore: 50 },
  },
  {
    id: 'student_love_ending',
    name: '传说结局：学生深情',
    tier: 'hidden',
    sequence: ['student_confession', 'student_relationship_secret', 'student_relationship_exposed'],
    sequenceOptions: {
      student_confession: 'accept_confession',
      student_relationship_secret: '繼續_secret',
      student_relationship_exposed: 'admit_and_resign'
    },
    minAttrs: { reputation: -20 },
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
export const chainStartEvents = ['alumni_donation', 'paper_publication', 'department_meeting', 'excellent_teaching_award', 'policy_whitepaper', 'colleague_target_start', 'dean_mentorship_start', 'research_partner_encounter', 'student_confession']
export const hiddenChainStartEvents = ['alien_clue', 'ai_breakthrough']
export const normalChainEventIds = [
  'colleague_target_start','department_politics','committee_battle','clear_name',
  'dean_mentorship_start','special_funding','prestige_speech','lead_center'
]
