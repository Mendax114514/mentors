import { GameEvent } from '@/types/game';

export const ANNUAL_EVENTS: GameEvent[] = [
  {
    id: 'student_guidance',
    title: '学生指导',
    description: '一名学生希望你能指导他的毕业设计',
    category: 'teaching',
    rarity: 'common',
    weight: 10,
    options: [
      {
        id: 'detailed_guidance',
        text: '详细指导',
        attributeCost: { funding: 2 },
        results: [
          {
            probability: 70,
            attributeChanges: { studentLoyalty: 5, reputation: 4 },
            studentEffects: { studentLoyaltyChange: 1 },
            message: '学生非常感激你的指导，你们建立了良好的关系'
          },
          {
            probability: 30,
            attributeChanges: { studentLoyalty: 4 },
            message: '指导过程很顺利，但学生理解能力有限'
          }
        ]
      },
      {
        id: 'simple_guidance',
        text: '简单指导',
        attributeCost: { funding: 1 },
        results: [
          {
            probability: 100,
            attributeChanges: { studentLoyalty: 2 },
            message: '你提供了一些基本建议'
          }
        ]
      },
      {
        id: 'decline',
        text: '婉拒推荐',
        results: [
          {
            probability: 60,
            attributeChanges: {},
            message: '你推荐了其他导师，学生表示理解'
          },
          {
            probability: 40,
            attributeChanges: { studentLoyalty: -3 },
            message: '学生有些失望地离开了'
          }
        ]
      }
    ]
  },
  {
    id: 'library_volunteer',
    title: '图书馆志愿服务',
    description: '参与图书馆编目与借阅维护',
    category: 'administration',
    rarity: 'common',
    weight: 8,
    options: [
      {
        id: 'join_volunteer',
        text: '参加志愿服务',
        results: [
          { probability: 70, attributeChanges: { reputation: 3 }, message: '服务到位，口碑微涨' },
          { probability: 30, attributeChanges: {}, message: '常规工作，影响有限' }
        ]
      },
      {
        id: 'skip_volunteer',
        text: '婉拒安排',
        results: [
          { probability: 100, attributeChanges: {}, message: '专注研究与教学' }
        ]
      }
    ]
  },
  {
    id: 'mentor_meetup',
    title: '新生导师见面会',
    description: '与新生进行导师制度介绍与交流',
    category: 'teaching',
    rarity: 'common',
    weight: 7,
    options: [
      {
        id: 'prepare_ppt',
        text: '精心准备PPT',
        attributeCost: { academicScore: 2 },
        results: [
          { probability: 60, attributeChanges: { studentLoyalty: 5, reputation: 2 }, message: '学生好感提升' },
          { probability: 40, attributeChanges: { studentLoyalty: 1 }, message: '效果尚可' }
        ]
      },
      {
        id: 'free_talk',
        text: '自由交流',
        results: [
          { probability: 50, attributeChanges: { studentLoyalty: 2 }, message: '气氛轻松' },
          { probability: 50, attributeChanges: { reputation: -2 }, message: '被质疑不够专业' }
        ]
      }
    ]
  },
  {
    id: 'lab_safety_check',
    title: '实验室安全检查',
    description: '开展安全自查与整改',
    category: 'administration',
    rarity: 'common',
    weight: 8,
    options: [
      {
        id: 'rectify_issues',
        text: '整改隐患',
        attributeCost: { funding: 2 },
        results: [
          { probability: 70, attributeChanges: { reputation: 4 }, message: '安全达标，评价提升' },
          { probability: 30, attributeChanges: { reputation: 2 }, message: '基本达标' }
        ]
      },
      {
        id: 'minimal_check',
        text: '走流程检查',
        results: [
          { probability: 60, attributeChanges: {}, message: '无异常，但收获有限' },
          { probability: 40, attributeChanges: { reputation: -5 }, message: '检查不严被点名' }
        ]
      }
    ]
  },
  {
    id: 'equipment_delay',
    title: '设备采购延误',
    description: '供应商延迟交付设备',
    category: 'administration',
    rarity: 'rare',
    weight: 3,
    options: [
      {
        id: 'urge_vendor',
        text: '催促供应商',
        results: [
          { probability: 60, attributeChanges: { reputation: 3 }, message: '交付加速' },
          { probability: 40, attributeChanges: { academicScore: -2 }, message: '项目进度受影响' }
        ]
      },
      {
        id: 'change_vendor',
        text: '更换供应商',
        attributeCost: { funding: 3 },
        results: [
          { probability: 50, attributeChanges: { academicScore: 2 }, message: '新设备到位，进度恢复' },
          { probability: 50, attributeChanges: { reputation: -2 }, message: '更换引发争议' }
        ]
      }
    ]
  },
  {
    id: 'joint_project',
    title: '跨校联合课题',
    description: '与其他高校共同申报联合课题',
    category: 'research',
    rarity: 'epic',
    weight: 2,
    options: [
      {
        id: 'lead_application',
        text: '牵头申报',
        attributeCost: { funding: 3 },
        results: [
          { probability: 60, attributeChanges: { academicScore: 4, reputation: 2 }, message: '方案获认可' },
          { probability: 40, attributeChanges: { academicScore: 2 }, message: '进入复审' }
        ]
      },
      {
        id: 'participate_only',
        text: '参与为主',
        results: [
          { probability: 100, attributeChanges: { academicScore: 2 }, message: '积累合作经验' }
        ]
      }
    ]
  },
  {
    id: 'alumni_talk',
    title: '校友返校演讲',
    description: '邀请成功校友进行经验分享',
    category: 'administration',
    rarity: 'rare',
    weight: 3,
    options: [
      {
        id: 'host_event',
        text: '主持活动',
        results: [
          { probability: 70, attributeChanges: { reputation: 3 }, message: '影响力提升' },
          { probability: 30, attributeChanges: { reputation: 1 }, message: '活动顺利' }
        ]
      },
      {
        id: 'delegate_event',
        text: '交由学院安排',
        results: [
          { probability: 100, attributeChanges: {}, message: '效果一般' }
        ]
      }
    ]
  },
  {
    id: 'startup_incubator',
    title: '学生创业孵化',
    description: '支持学生团队进入孵化器',
    category: 'administration',
    rarity: 'rare',
    weight: 3,
    options: [
      {
        id: 'mentor_support',
        text: '导师支持',
        attributeCost: { funding: 3 },
        results: [
          { probability: 60, attributeChanges: { reputation: 3 }, message: '项目进展良好' },
          { probability: 40, attributeChanges: { reputation: 1 }, message: '项目尚需打磨' }
        ]
      },
      {
        id: 'observe_only',
        text: '观望支持',
        results: [
          { probability: 100, attributeChanges: {}, message: '保持关注' }
        ]
      }
    ]
  },
  {
    id: 'international_visit',
    title: '国际交流访问',
    description: '参与短期国际访问交流',
    category: 'research',
    rarity: 'rare',
    weight: 2,
    options: [
      {
        id: 'apply_grant',
        text: '申请资助出访',
        attributeCost: { funding: 4 },
        results: [
          { probability: 60, attributeChanges: { reputation: 4, academicScore: 3 }, message: '交流顺利' },
          { probability: 40, attributeChanges: { reputation: 1 }, message: '收获一般' }
        ]
      },
      {
        id: 'no_visit',
        text: '放弃出访',
        results: [
          { probability: 100, attributeChanges: {}, message: '专注本地事务' }
        ]
      }
    ]
  },
  {
    id: 'final_evaluation',
    title: '期末教学评估',
    description: '学生匿名评价教学质量',
    category: 'teaching',
    rarity: 'common',
    weight: 9,
    options: [
      {
        id: 'respond_feedback',
        text: '积极回应',
        results: [
          { probability: 70, attributeChanges: { reputation: 3, studentLoyalty: 2 }, message: '教学口碑提升' },
          { probability: 30, attributeChanges: { reputation: 1 }, message: '改进有限' }
        ]
      },
      {
        id: 'ignore_feedback',
        text: '置之不理',
        results: [
          { probability: 60, attributeChanges: { reputation: -2 }, message: '口碑受损' },
          { probability: 40, attributeChanges: {}, message: '影响有限' }
        ]
      }
    ]
  },
  {
    id: 'ethics_training',
    title: '科研伦理培训',
    description: '参加科研伦理与规范培训',
    category: 'administration',
    rarity: 'common',
    weight: 8,
    options: [
      {
        id: 'attend_training',
        text: '认真参加',
        results: [
          { probability: 70, attributeChanges: { reputation: 2 }, message: '规范意识提升' },
          { probability: 30, attributeChanges: {}, message: '学习一般' }
        ]
      },
      {
        id: 'skip_training',
        text: '缺席培训',
        results: [
          { probability: 100, attributeChanges: { reputation: -2 }, message: '被通报批评' }
        ]
      }
    ]
  },
  {
    id: 'paper_ghostwriting_offer',
    title: '论文代写邀约',
    description: '有人提供论文代写服务邀约',
    category: 'special',
    rarity: 'legendary',
    weight: 1,
    options: [
      {
        id: 'reject_offer',
        text: '严词拒绝',
        results: [
          { probability: 100, attributeChanges: { reputation: 2 }, message: '坚守学术底线，口碑提升' }
        ]
      },
      {
        id: 'consider_offer',
        text: '考虑一下',
        attributeCost: { funding: 5 },
        results: [
          { probability: 50, attributeChanges: { reputation: -4 }, message: '消息外泄，形象受损', nextEvent: 'report_scandal' },
          { probability: 50, attributeChanges: { reputation: -2 }, message: '暗流涌动，风险加剧' }
        ]
      }
    ]
  },
  {
    id: 'supplier_kickback',
    title: '供应商回扣试探',
    description: '设备供应商暗示回扣',
    category: 'special',
    rarity: 'epic',
    weight: 2,
    options: [
      {
        id: 'report_vendor',
        text: '举报并更换供应商',
        results: [
          { probability: 60, attributeChanges: { reputation: 3 }, message: '清朗环境' },
          { probability: 40, attributeChanges: { reputation: 1 }, message: '效果有限' }
        ]
      },
      {
        id: 'accept_kickback',
        text: '接受试探',
        attributeCost: { funding: 4 },
        results: [
          { probability: 50, attributeChanges: { reputation: -4 }, message: '风评变差', nextEvent: 'report_scandal' },
          { probability: 50, attributeChanges: { reputation: -3 }, message: '暗箱操作被质疑' }
        ]
      }
    ]
  },
  {
    id: 'drinking_culture',
    title: '饭局喝酒文化',
    description: '学术饭局上的酒桌文化',
    category: 'administration',
    rarity: 'rare',
    weight: 2,
    options: [
      {
        id: 'refuse_drink',
        text: '拒绝劝酒',
        results: [
          { probability: 60, attributeChanges: { reputation: 2 }, message: '坚持原则获得尊重' },
          { probability: 40, attributeChanges: { reputation: -2 }, message: '被部分人不满' }
        ]
      },
      {
        id: 'join_drink',
        text: '入乡随俗',
        results: [
          { probability: 50, attributeChanges: { reputation: -2 }, message: '形象受损' },
          { probability: 50, attributeChanges: { reputation: 2 }, message: '圈内关系有所缓和' }
        ]
      }
    ]
  },
  {
    id: 'disciplinary_hearing',
    title: '校纪处分听证会',
    description: '学校召开听证会调查不当行为指控',
    category: 'administration',
    rarity: 'epic',
    weight: 2,
    options: [
      {
        id: 'refuse_cooperation',
        text: '拒绝配合',
        results: [
          { probability: 60, attributeChanges: { reputation: -3, studentLoyalty: -2 }, message: '态度强硬，局势恶化', nextEvent: 'evidence_escalation' },
          { probability: 40, attributeChanges: { reputation: -1 }, message: '暂时僵持' }
        ]
      },
      {
        id: 'fully_cooperate',
        text: '全力配合',
        results: [
          { probability: 60, attributeChanges: { reputation: 1 }, message: '争取到同情与耐心' },
          { probability: 40, attributeChanges: { reputation: -1 }, message: '被认为掩饰不力' }
        ]
      }
    ]
  },
  {
    id: 'evidence_escalation',
    title: '证据升级',
    description: '新的证据曝光，事态进一步升级',
    category: 'administration',
    rarity: 'legendary',
    weight: 1,
    options: [
      {
        id: 'deny_allegations',
        text: '坚决否认',
        results: [
          { probability: 80, attributeChanges: { reputation: -4, studentLoyalty: -3 }, message: '舆论压力加剧', nextEvent: 'court_trial' },
          { probability: 20, attributeChanges: { reputation: -2 }, message: '舆论分化' }
        ]
      },
      {
        id: 'issue_statement',
        text: '发布声明',
        results: [
          { probability: 60, attributeChanges: { reputation: -1 }, message: '效果有限' },
          { probability: 40, attributeChanges: { reputation: 1 }, message: '略有缓和' }
        ]
      }
    ]
  },
  {
    id: 'court_trial',
    title: '法庭审理',
    description: '事态进入司法程序',
    category: 'administration',
    rarity: 'legendary',
    weight: 1,
    options: [
      {
        id: 'accept_verdict',
        text: '接受判决',
        results: [
          { probability: 90, attributeChanges: { reputation: -5 }, message: '判决生效' },
          { probability: 10, attributeChanges: { reputation: -3 }, message: '仍有上诉空间' }
        ]
      },
      {
        id: 'appeal',
        text: '提出上诉',
        results: [
          { probability: 50, attributeChanges: { reputation: -2 }, message: '等待二审' },
          { probability: 50, attributeChanges: { reputation: -1 }, message: '公众关注升温' }
        ]
      }
    ]
  },
  {
    id: 'board_invite',
    title: '董事邀约',
    description: '企业希望你加入董事会共同推进科研转化',
    category: 'administration',
    rarity: 'epic',
    weight: 2,
    options: [
      {
        id: 'accept_seat',
        text: '接受董事席位',
        results: [
          { probability: 90, attributeChanges: { reputation: 2, funding: 5 }, message: '影响力提升，资源更多' },
          { probability: 10, attributeChanges: { reputation: -1 }, message: '学术圈非议增加' }
        ]
      },
      {
        id: 'decline_seat',
        text: '婉拒邀约',
        results: [
          { probability: 100, attributeChanges: {}, message: '保持学术独立' }
        ]
      }
    ]
  },
  {
    id: 'ipo_preparation',
    title: 'IPO准备会',
    description: '是否推进成果转化公司IPO申请？',
    category: 'administration',
    rarity: 'legendary',
    weight: 1,
    options: [
      {
        id: 'file_prospectus',
        text: '提交招股书',
        attributeCost: { funding: 5 },
        results: [
          { probability: 90, attributeChanges: { funding: 12, reputation: 3 }, message: '市场反响良好' },
          { probability: 10, attributeChanges: { reputation: -2 }, message: '质疑声浪不小' }
        ]
      },
      {
        id: 'delay_ipo',
        text: '延后IPO',
        results: [
          { probability: 100, attributeChanges: { academicScore: 2 }, message: '继续夯实成果' }
        ]
      }
    ]
  },
  {
    id: 'signal_analysis',
    title: '异信号解析',
    description: '检测到异常信号，是否投入资源进行分析？',
    category: 'special',
    rarity: 'epic',
    weight: 1,
    options: [
      {
        id: 'deep_analysis',
        text: '深入分析',
        attributeCost: { funding: 3 },
        results: [
          { probability: 80, attributeChanges: { reputation: 2 }, message: '线索更清晰', nextEvent: 'contact_protocol' },
          { probability: 20, attributeChanges: { reputation: -1 }, message: '暂未发现价值' }
        ]
      },
      {
        id: 'ignore_signal',
        text: '忽略信号',
        results: [
          { probability: 100, attributeChanges: {}, message: '继续推进常规研究' }
        ]
      }
    ]
  },
  {
    id: 'contact_protocol',
    title: '接触协议拟定',
    description: '组建小组拟定潜在接触协议',
    category: 'special',
    rarity: 'legendary',
    weight: 1,
    options: [
      {
        id: 'formalize_protocol',
        text: '正式拟定协议',
        results: [
          { probability: 90, attributeChanges: { reputation: 2 }, message: '团队认可方案', nextEvent: 'alien_contact' },
          { probability: 10, attributeChanges: { reputation: -1 }, message: '方案争议较大' }
        ]
      },
      {
        id: 'postpone_protocol',
        text: '暂缓拟定',
        results: [
          { probability: 100, attributeChanges: {}, message: '继续评估风险' }
        ]
      }
    ]
  },
  {
    id: 'grant_breakthrough',
    title: '重大项目突破',
    description: '国家重大项目传来突破进展',
    category: 'research',
    rarity: 'epic',
    weight: 2,
    options: [
      {
        id: 'publish_results',
        text: '发布成果',
        results: [
          { probability: 90, attributeChanges: { academicScore: 6, reputation: 3 }, message: '成果获高度评价' },
          { probability: 10, attributeChanges: { reputation: 1 }, message: '评价尚可' }
        ]
      },
      {
        id: 'hold_results',
        text: '暂缓公开',
        results: [
          { probability: 100, attributeChanges: { academicScore: 2 }, message: '继续打磨完善' }
        ]
      }
    ]
  },
  {
    id: 'global_keynote',
    title: '全球大会主题报告',
    description: '受邀在全球学术大会进行主题报告',
    category: 'research',
    rarity: 'legendary',
    weight: 1,
    options: [
      {
        id: 'deliver_keynote',
        text: '发表主题报告',
        attributeCost: { funding: 4 },
        results: [
          { probability: 70, attributeChanges: { reputation: 5 }, message: '声望显著提升' },
          { probability: 30, attributeChanges: { reputation: 2 }, message: '收获不俗' }
        ]
      },
      {
        id: 'decline_keynote',
        text: '婉拒邀约',
        results: [
          { probability: 100, attributeChanges: {}, message: '聚焦现有研究' }
        ]
      }
    ]
  },
  {
    id: 'media_feature',
    title: '媒体专访',
    description: '主流媒体希望对你的研究进行专访报道',
    category: 'administration',
    rarity: 'rare',
    weight: 3,
    options: [
      {
        id: 'accept_feature',
        text: '接受采访',
        results: [
          { probability: 85, attributeChanges: { reputation: 3 }, message: '形象提升', nextEvent: 'regional_forum' },
          { probability: 15, attributeChanges: { reputation: -1 }, message: '报道引发争议' }
        ]
      },
      {
        id: 'decline_feature',
        text: '婉拒采访',
        results: [
          { probability: 100, attributeChanges: {}, message: '继续低调' }
        ]
      }
    ]
  },
  {
    id: 'policy_whitepaper',
    title: '政策白皮书倡议',
    description: '牵头起草教育政策白皮书以推动改革',
    category: 'administration',
    rarity: 'epic',
    weight: 2,
    options: [
      {
        id: 'draft_submit',
        text: '牵头起草并提交',
        attributeCost: { funding: 3 },
        results: [
          { probability: 85, attributeChanges: { reputation: 3 }, message: '方案获认可，影响力提升', nextEvent: 'public_hearing' },
          { probability: 15, attributeChanges: { reputation: 1 }, message: '反馈一般，需继续完善' }
        ]
      },
      {
        id: 'observe_only_whitepaper',
        text: '观望等待他人提交',
        results: [
          { probability: 100, attributeChanges: {}, message: '影响有限' }
        ]
      }
    ]
  },
  {
    id: 'public_hearing',
    title: '公共听证会发言',
    description: '参与教育改革公共听证会并发表意见',
    category: 'administration',
    rarity: 'rare',
    weight: 3,
    options: [
      {
        id: 'speak_support',
        text: '发表支持改革的发言',
        results: [
          { probability: 85, attributeChanges: { reputation: 3 }, message: '获得广泛认可', nextEvent: 'education_reform_pilot' },
          { probability: 15, attributeChanges: { reputation: 1 }, message: '反响一般' }
        ]
      },
      {
        id: 'stay_neutral',
        text: '保持中立表态',
        results: [
          { probability: 100, attributeChanges: {}, message: '影响有限' }
        ]
      }
    ]
  },
  {
    id: 'education_reform_pilot',
    title: '教育改革试点',
    description: '承担局部教育改革试点任务',
    category: 'administration',
    rarity: 'epic',
    weight: 2,
    options: [
      {
        id: 'run_pilot',
        text: '承担试点项目',
        attributeCost: { funding: 4 },
        results: [
          { probability: 85, attributeChanges: { reputation: 3, academicScore: 2 }, message: '试点成效显著', nextEvent: 'city_council_advisory' },
          { probability: 15, attributeChanges: { reputation: 1 }, message: '试点进展平平' }
        ]
      },
      {
        id: 'decline_pilot',
        text: '婉拒试点任务',
        results: [
          { probability: 100, attributeChanges: {}, message: '维持现有工作' }
        ]
      }
    ]
  },
  {
    id: 'city_council_advisory',
    title: '市政教育顾问席位',
    description: '受邀担任市政教育顾问，参与政策制定',
    category: 'administration',
    rarity: 'legendary',
    weight: 1,
    options: [
      {
        id: 'accept_advisory',
        text: '接受顾问席位',
        results: [
          { probability: 85, attributeChanges: { reputation: 3, funding: 4 }, message: '话语权提升' },
          { probability: 15, attributeChanges: { reputation: 1 }, message: '影响有限' }
        ]
      },
      {
        id: 'decline_advisory',
        text: '婉拒席位',
        results: [
          { probability: 100, attributeChanges: {}, message: '专注学术' }
        ]
      }
    ]
  },
  {
    id: 'regional_forum',
    title: '区域学术论坛',
    description: '参加区域论坛提升本领域话语权',
    category: 'research',
    rarity: 'rare',
    weight: 3,
    options: [
      {
        id: 'organize_panel',
        text: '组织圆桌讨论',
        results: [
          { probability: 85, attributeChanges: { reputation: 2 }, message: '论坛反响良好' },
          { probability: 15, attributeChanges: { reputation: 1 }, message: '收获有限' }
        ]
      },
      {
        id: 'attend_only_forum',
        text: '仅参加论坛',
        results: [
          { probability: 100, attributeChanges: { academicScore: 1 }, message: '获取前沿信息' }
        ]
      }
    ]
  },
  {
    id: 'alumni_donation',
    title: '校友捐赠线索',
    description: '一位成功校友有意向资助你的课题组',
    category: 'administration',
    rarity: 'rare',
    weight: 3,
    options: [
      {
        id: 'meet_alumni',
        text: '深度会谈规划方向',
        results: [
          { probability: 70, attributeChanges: { funding: 5, reputation: 1 }, message: '达成初步资助意向', nextEvent: 'enterprise_collab_deepening' },
          { probability: 30, attributeChanges: { reputation: -1 }, message: '理念不合，暂未达成一致' }
        ]
      },
      {
        id: 'keep_distance',
        text: '保持距离',
        results: [
          { probability: 100, attributeChanges: {}, message: '维持独立研究' }
        ]
      }
    ]
  },
  {
    id: 'enterprise_collab_deepening',
    title: '企业合作深化',
    description: '企业邀请开展应用研究合作',
    category: 'research',
    rarity: 'rare',
    weight: 3,
    options: [
      {
        id: 'sign_pilot',
        text: '签署试点合作',
        attributeCost: { funding: 2 },
        results: [
          { probability: 70, attributeChanges: { funding: 6, reputation: 2 }, message: '试点顺利，后续加码', nextEvent: 'market_launch' },
          { probability: 30, attributeChanges: { reputation: -1 }, message: '试点反响一般' }
        ]
      },
      {
        id: 'decline',
        text: '婉拒合作',
        results: [
          { probability: 100, attributeChanges: {}, message: '继续专注基础研究' }
        ]
      }
    ]
  },
  {
    id: 'market_launch',
    title: '成果转化与发布会',
    description: '是否发布应用成果并寻求市场化？',
    category: 'administration',
    rarity: 'epic',
    weight: 2,
    options: [
      {
        id: 'launch',
        text: '发布并转化',
        attributeCost: { funding: 3 },
        results: [
          { probability: 70, attributeChanges: { funding: 12, reputation: 4 }, message: '转化成功，商业口碑提升' },
          { probability: 30, attributeChanges: { reputation: -3 }, message: '争议不断，学术圈评价走低' }
        ]
      },
      {
        id: 'hold',
        text: '暂缓转化',
        results: [
          { probability: 100, attributeChanges: { academicScore: 2 }, message: '继续完善论文与理论工作' }
        ]
      }
    ]
  },
  {
    id: 'ai_breakthrough',
    title: 'AI计算突破',
    description: '你的团队在高性能计算上取得重大进展',
    category: 'research',
    rarity: 'epic',
    weight: 2,
    options: [
      {
        id: 'publish_and_open',
        text: '论文与开源并举',
        results: [
          { probability: 80, attributeChanges: { academicScore: 10, reputation: 4 }, message: '论文与开源广受好评' },
          { probability: 20, attributeChanges: { academicScore: 4 }, message: '论文影响力尚可' }
        ]
      },
      {
        id: 'closed_transfer',
        text: '闭源并探索转化',
        results: [
          { probability: 50, attributeChanges: { funding: 14, reputation: -1 }, message: '获得投入但学术评价下降' },
          { probability: 50, attributeChanges: { reputation: -2 }, message: '转化受阻，评价进一步下滑' }
        ]
      }
    ]
  },
  {
    id: 'cybernetics_implant',
    title: '生化义体实验',
    description: '团队提出在受试者中进行神经接口与义体实验',
    category: 'special',
    rarity: 'epic',
    weight: 1,
    options: [
      {
        id: 'approve_implant',
        text: '批准并推进试验',
        results: [
          { probability: 70, attributeChanges: { reputation: 2, academicScore: 4 }, message: '初步成功，迈向新阶段', nextEvent: 'mind_upload_trial' },
          { probability: 30, attributeChanges: { reputation: -2 }, message: '伦理争议升温，需谨慎推进' }
        ]
      },
      {
        id: 'halt_implant',
        text: '暂缓试验',
        results: [
          { probability: 100, attributeChanges: {}, message: '继续论证风险与收益' }
        ]
      }
    ]
  },
  {
    id: 'mind_upload_trial',
    title: '意识上传试验',
    description: '尝试在受控环境中进行意识上传与回迁',
    category: 'special',
    rarity: 'legendary',
    weight: 1,
    options: [
      {
        id: 'conduct_upload',
        text: '开展上传与验证',
        results: [
          { probability: 85, attributeChanges: { academicScore: 6, reputation: 3 }, message: '上传验证成功，技术成熟度提升', nextEvent: 'posthuman_transition' },
          { probability: 15, attributeChanges: { reputation: -3 }, message: '试验失败引发质疑' }
        ]
      },
      {
        id: 'cancel_upload',
        text: '取消试验',
        results: [
          { probability: 100, attributeChanges: {}, message: '继续基础研究积累' }
        ]
      }
    ]
  },
  {
    id: 'posthuman_transition',
    title: '后人类跃迁',
    description: '通过稳定接口与上传技术，实现人机融合的关键跃迁',
    category: 'special',
    rarity: 'legendary',
    weight: 1,
    options: [
      {
        id: 'accept_transition',
        text: '接受跃迁方案',
        results: [
          { probability: 85, attributeChanges: { reputation: 4 }, message: '迈入新纪元的门槛' },
          { probability: 15, attributeChanges: { reputation: -2 }, message: '社会争议导致推进放缓' }
        ]
      },
      {
        id: 'reject_transition',
        text: '拒绝跃迁',
        results: [
          { probability: 100, attributeChanges: {}, message: '维持传统路线' }
        ]
      }
    ]
  },
  {
    id: 'alien_clue',
    title: '外星线索',
    description: '在一次国际会议中你获得了非凡线索',
    category: 'special',
    rarity: 'epic',
    weight: 1,
    options: [
      {
        id: 'secret_project',
        text: '悄然组建秘密项目',
        results: [
          { probability: 70, attributeChanges: { reputation: 1 }, message: '项目推进中，静待突破', nextEvent: 'alien_contact' },
          { probability: 30, attributeChanges: { reputation: -1 }, message: '线索模糊，暂未成果' }
        ]
      },
      {
        id: 'open_discussion',
        text: '公开交流探讨',
        results: [
          { probability: 50, attributeChanges: { reputation: 2 }, message: '引起广泛关注' },
          { probability: 50, attributeChanges: { reputation: -1 }, message: '被质疑为流言' }
        ]
      }
    ]
  },
  {
    id: 'alien_contact',
    title: '外星接触',
    description: '项目推进到关键阶段，是否继续？',
    category: 'special',
    rarity: 'legendary',
    weight: 1,
    options: [
      {
        id: 'full_commit',
        text: '孤注一掷',
        results: [
          { probability: 80, attributeChanges: { reputation: 5 }, message: '突破常识的发现！' },
          { probability: 20, attributeChanges: { reputation: -3 }, message: '项目失败，遭遇巨大质疑' }
        ]
      },
      {
        id: 'abort',
        text: '终止项目',
        results: [
          { probability: 100, attributeChanges: {}, message: '团队恢复常规研究' }
        ]
      }
    ]
  },
  {
    id: 'report_scandal',
    title: '举报风波',
    description: '匿名举报指向你的课题组管理问题',
    category: 'administration',
    rarity: 'rare',
    weight: 2,
    options: [
      {
        id: 'transparent_investigation',
        text: '公开配合调查',
        attributeCost: { reputation: 1 },
        results: [
          { probability: 60, attributeChanges: { reputation: 1, studentLoyalty: 2 }, message: '澄清事实，形象有所修复' },
          { probability: 40, attributeChanges: { reputation: -2 }, message: '调查耗时，外界评价略受影响' }
        ]
      },
      {
        id: 'pressure_students',
        text: '施压学生息事宁人',
        attributeCost: { studentLoyalty: 2 },
        results: [
          { probability: 50, attributeChanges: { academicScore: 2, studentLoyalty: -3, reputation: -2 }, message: '短期压下，但口碑受损' },
          { probability: 50, attributeChanges: { reputation: -4, studentLoyalty: -5 }, message: '消息进一步扩散，影响扩大' }
        ]
      }
    ]
  },
  {
    id: 'colleague_target',
    title: '同事排挤',
    description: '系里某些人对你横加指责与刁难',
    category: 'administration',
    rarity: 'rare',
    weight: 2,
    options: [
      {
        id: 'build_alliance',
        text: '建立联盟积极沟通',
        attributeCost: { funding: 2 },
        results: [
          { probability: 50, attributeChanges: { reputation: 2 }, message: '缓解关系，争取到支持' },
          { probability: 50, attributeChanges: { reputation: -1 }, message: '沟通未果，影响持续' }
        ]
      },
      {
        id: 'ignore',
        text: '置之不理',
        results: [
          { probability: 60, attributeChanges: {}, message: '风波自行消散' },
          { probability: 40, attributeChanges: { reputation: -2 }, message: '负面评价延续一段时间' }
        ]
      }
    ]
  },
  {
    id: 'paper_publication',
    title: '论文发表',
    description: '你的研究成果即将发表，需要选择投稿期刊',
    category: 'research',
    rarity: 'common',
    weight: 8,
    options: [
      {
        id: 'top_journal',
        text: '投稿顶级期刊',
        attributeCost: { funding: 5 },
        results: [
          {
            probability: 30,
            attributeChanges: { academicScore: 10, reputation: 3 },
            message: '论文被顶级期刊接收！并且获得大量引用！你的学术声誉大幅提升'
          },
          {
            probability: 40,
            attributeChanges: { academicScore: 4, reputation: 2},
            message: '论文需要修改，但最终被接收'
          },
          {
            probability: 30,
            attributeChanges: { reputation: -2 },
            message: '论文被拒稿，有些打击信心'
          }
        ]
      },
      {
        id: 'normal_journal',
        text: '投稿普通期刊',
        attributeCost: { funding: 2 },
        results: [
          {
            probability: 80,
            attributeChanges: { academicScore: 4, reputation: 2 },
            message: '论文顺利发表'
          },
          {
            probability: 20,
            attributeChanges: { academicScore: 1 },
            message: '论文需要小幅修改后接收'
          }
        ]
      }
    ]
  },
  {
    id: 'conference_invitation',
    title: '学术会议邀请',
    description: '收到学术会议的邀请，需要决定是否参加',
    category: 'research',
    rarity: 'rare',
    weight: 5,
    options: [
      {
        id: 'attend_present',
        text: '参加并做报告',
        attributeCost: { funding: 5 },
        results: [
          {
            probability: 70,
            attributeChanges: { reputation: 5, academicScore: 3 },
            message: '你的报告获得好评，结识了许多同行'
          },
          {
            probability: 30,
            attributeChanges: { reputation: 2 },
            message: '会议参与顺利，但没有特别突出的表现'
          }
        ]
      },
      {
        id: 'attend_only',
        text: '只参加会议',
        attributeCost: { funding: 3 },
        results: [
          {
            probability: 100,
            attributeChanges: { academicScore: 1 },
            message: '参加会议，了解了最新研究动态'
          }
        ]
      },
      {
        id: 'decline',
        text: '婉拒邀请',
        results: [
          {
            probability: 100,
            attributeChanges: {},
            message: '你决定专注于当前的研究工作'
          }
        ]
      }
    ]
  },
  {
    id: 'department_meeting',
    title: '系里会议',
    description: '系里召开重要会议，讨论教学安排',
    category: 'administration',
    rarity: 'common',
    weight: 6,
    options: [
      {
        id: 'active_participation',
        text: '积极参与讨论',
        results: [
          {
            probability: 85,
            attributeChanges: { reputation: 2 },
            message: '你的建议得到认可，提升了在系里的地位',
            nextEvent: 'excellent_teaching_award'
          },
          {
            probability: 15,
            attributeChanges: { reputation: 0 },
            message: '你参与了讨论，但影响有限'
          }
        ]
      },
      {
        id: 'silent_participation',
        text: '保持沉默',
        results: [
          {
            probability: 100,
            attributeChanges: {},
            message: '你选择保持低调，没有引起注意'
          }
        ]
      }
    ]
  },
  {
    id: 'student_complaint',
    title: '学生投诉',
    description: '有学生向系里投诉你的教学方式',
    category: 'administration',
    rarity: 'rare',
    weight: 3,
    options: [
      {
        id: 'communicate_student',
        text: '与学生沟通解决',
        results: [
          {
            probability: 70,
            attributeChanges: { studentLoyalty: 2, reputation: 1 },
            message: '通过沟通，你与学生达成了谅解'
          },
          {
            probability: 30,
            attributeChanges: { reputation: -1 },
            message: '沟通效果不佳，问题依然存在'
          }
        ]
      },
      {
        id: 'ignore_complaint',
        text: '不予理会',
        results: [
          {
            probability: 40,
            attributeChanges: { reputation: -2, studentLoyalty: -1 },
            message: '投诉升级，影响了你的声誉'
          },
          {
            probability: 60,
            attributeChanges: { reputation: -1 },
            message: '投诉没有得到妥善处理，有些负面影响'
          },
          {
            probability: 60,
            attributeChanges: { },
            message: '教务处没有管这个学生，无事发生'
          }
        ]
      }
    ]
  },
  {
    id: 'research_collaboration',
    title: '科研合作',
    description: '其他学校的教授邀请你参与合作研究',
    category: 'research',
    rarity: 'epic',
    weight: 2,
    conditions: {
      minAttributes: { reputation: 15 }
    },
    options: [
      {
        id: 'accept_collaboration',
        text: '接受合作邀请',
        attributeCost: { funding: 4 },
        results: [
          {
            probability: 80,
            attributeChanges: { academicScore: 4, reputation: 3 },
            message: '合作研究取得重要进展，发表了高质量论文'
          },
          {
            probability: 20,
            attributeChanges: { academicScore: 1, reputation: 1 },
            message: '合作进行得还算顺利，但成果一般'
          }
        ]
      },
      {
        id: 'decline_politely',
        text: '婉拒合作',
        results: [
          {
            probability: 100,
            attributeChanges: {},
            message: '你礼貌地拒绝了邀请，专注于自己的研究'
          }
        ]
      }
    ]
  },
  {
    id: 'excellent_teaching_award',
    title: '教学优秀奖提名',
    description: '你被提名为本年度教学优秀奖候选人',
    category: 'teaching',
    rarity: 'epic',
    weight: 1,
    conditions: {
      minAttributes: { studentLoyalty: 20 }
    },
    options: [
      {
        id: 'actively_campaign',
        text: '积极争取',
        attributeCost: { funding: 5 },
        results: [
          {
            probability: 85,
            attributeChanges: { reputation: 5, studentLoyalty: 3 ,academicScore: -1},
            message: '你获得了教学优秀奖！这是对你教学工作的认可',
            nextEvent: 'media_feature'
          },
          {
            probability: 15,
            attributeChanges: { academicScore: -1 },
            message: '没有获奖，你还耽误了研究'
          }
        ]
      },
      {
        id: 'let_nature_take_course',
        text: '顺其自然',
        results: [
          {
            probability: 30,
            attributeChanges: { reputation: 3, studentLoyalty: 3 },
            message: '你意外获得了教学优秀奖！'
          },
          {
            probability: 70,
            attributeChanges: { reputation: 1 },
            message: '你没有获奖，但也没有损失'
          }
        ]
      }
    ]
  }
];

export const events = ANNUAL_EVENTS;
