export type GuidanceTask = {
  id: string
  title: string
  options: Array<{ id: string; text: string; results: Array<{ probability: number; loyalty?: number; favor?: number; stateTag?: string; triggerIncident?: string }> }>
}

export const guidanceByState: Record<string, GuidanceTask[]> = {
  anxiety: [
    {
      id: 'breathing_exercise',
      title: '呼吸放松训练',
      options: [
        { id: 'lead_session', text: '亲自带练', results: [ { probability: 70, loyalty: 2, favor: 3 }, { probability: 30, loyalty: 1 } ] },
        { id: 'send_material', text: '发资料自学', results: [ { probability: 60, loyalty: 1 }, { probability: 40, loyalty: 0 } ] }
      ]
    },
    {
      id: 'counseling_referral',
      title: '辅导转介',
      options: [
        { id: 'book_session', text: '预约辅导', results: [ { probability: 65, loyalty: 2, stateTag: 'motivated' }, { probability: 35, loyalty: 1 } ] },
        { id: 'encourage_peer', text: '同伴支持', results: [ { probability: 60, favor: 2 }, { probability: 40, loyalty: 1 } ] }
      ]
    }
  ],
  burnout: [
    {
      id: 'workload_rebalance',
      title: '工作量重平衡',
      options: [
        { id: 'reduce_tasks', text: '减少任务', results: [ { probability: 70, loyalty: 2, favor: 2 }, { probability: 30, loyalty: 1 } ] },
        { id: 'time_management', text: '时间管理训练', results: [ { probability: 60, loyalty: 2 }, { probability: 40, loyalty: 1 } ] }
      ]
    },
    {
      id: 'goal_reset',
      title: '目标重设',
      options: [
        { id: 'short_goal', text: '制定短期目标', results: [ { probability: 65, loyalty: 2, stateTag: 'motivated' }, { probability: 35, loyalty: 1 } ] }
      ]
    }
  ],
  in_love: [
    {
      id: 'balance_advice',
      title: '平衡建议',
      options: [
        { id: 'schedule', text: '制定学习与约会日程', results: [ { probability: 70, loyalty: 2 }, { probability: 30, loyalty: 1 } ] },
        { id: 'private_talk', text: '单独谈心', results: [ { probability: 60, favor: 3 }, { probability: 40, favor: 1 } ] }
      ]
    }
    ,{
      id: 'forbid_relationship',
      title: '禁止恋爱（恶趣味）',
      options: [
        { id: 'issue_order', text: '下达禁令', results: [ { probability: 60, loyalty: -10, stateTag: 'burnout', triggerIncident: 'incident_assault_report' }, { probability: 40, loyalty: -5 } ] }
      ]
    }
  ],
  lazy: [
    {
      id: 'discipline_plan',
      title: '纪律计划',
      options: [
        { id: 'strict_check', text: '严格检查', results: [ { probability: 50, loyalty: -1 }, { probability: 50, loyalty: 1 } ] },
        { id: 'reward_system', text: '奖励机制', results: [ { probability: 65, loyalty: 2 }, { probability: 35, loyalty: 1 } ] }
      ]
    }
  ],
  motivated: [
    {
      id: 'advanced_training',
      title: '进阶训练',
      options: [
        { id: 'lead_project', text: '带头小项目', results: [ { probability: 70, loyalty: 2, favor: 2 }, { probability: 30, loyalty: 1 } ] },
        { id: 'share_experience', text: '分享经验', results: [ { probability: 60, favor: 2 }, { probability: 40, loyalty: 1 } ] }
      ]
    }
  ],
  yuyu: [
    {
      id: 'insult_die',
      title: '极端辱骂（恶趣味）',
      options: [
        { id: 'say_die', text: '那你怎么不去死', results: [ { probability: 100, loyalty: -20, stateTag: 'burnout', triggerIncident: 'incident_jump' } ] }
      ]
    }
  ]
}

export const attackSkills = [
  { id: 'dragon_palm', name: '降龙十八掌', type: 'special' },
  { id: 'shadow_kick', name: '无影脚', type: 'special' },
  { id: 'sword_form', name: '独孤九剑', type: 'special' }
]
