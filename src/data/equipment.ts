import { Equipment } from '../types/game';

export const equipment: Equipment[] = [
  {
    id: 'equipment_1',
    name: '高级实验设备',
    description: '购买先进的实验设备，显著提升学生的工作效率',
    price: 18,
    effects: {
      studentWorkEfficiency: 0.35
    },
    type: 'equipment'
  },
  {
    id: 'equipment_1a',
    name: '超高端工作站',
    description: '顶配工作站，显著提升整体效率',
    price: 30,
    effects: { studentWorkEfficiency: 0.7 },
    type: 'equipment'
  },
  {
    id: 'equipment_2',
    name: '专业软件许可',
    description: '购买专业软件的许可证，提高学生研究效率',
    price: 9,
    effects: {
      studentWorkEfficiency: 0.15
    },
    type: 'equipment'
  },
  {
    id: 'equipment_3',
    name: '学术数据库订阅',
    description: '订阅重要的学术数据库，为学生提供丰富的研究资源',
    price: 12,
    effects: {
      studentWorkEfficiency: 0.1,
      loyaltyRateBonus: 0.5
    },
    type: 'equipment'
  },
  {
    id: 'equipment_ergo_chair',
    name: '人体工学椅',
    description: '舒适的坐姿让学生更专注，提升团队满意度与忠诚度增长',
    price: 15,
    effects: { loyaltyRateBonus: 1 },
    type: 'equipment'
  },
  {
    id: 'equipment_coffee_machine',
    name: '咖啡机',
    description: '咖啡补给提升氛围，带来稳定的忠诚度增长',
    price: 18,
    effects: { loyaltyRateBonus: 1 },
    type: 'equipment'
  },
  {
    id: 'equipment_monitor_4k',
    name: '4K显示器',
    description: '更高分辨率提升体验与效率，略微提升忠诚度增长',
    price: 23,
    effects: { studentWorkEfficiency: 0.15, loyaltyRateBonus: 1 },
    type: 'equipment'
  },
  {
    id: 'equipment_4',
    name: '团队建设活动',
    description: '组织团队建设活动，增强团队凝聚力和学生忠诚度',
    price: 12,
    effects: {
      studentLoyalty: 5
    },
    type: 'consumable'
  },
  {
    id: 'equipment_5',
    name: '学术会议资助',
    description: '资助学生参加学术会议，提升学术视野和忠诚度',
    price: 15,
    effects: {
      studentLoyalty: 6
    },
    type: 'consumable'
  },
  {
    id: 'equipment_6',
    name: '研究生奖学金',
    description: '设立研究生奖学金，吸引优秀学生并提高忠诚度',
    price: 27,
    effects: {
      studentLoyalty: 8
    },
    type: 'consumable'
  },
  {
    id: 'equipment_7',
    name: '实验室装修升级',
    description: '改善实验室环境，创造更好的研究条件',
    price: 24,
    effects: {
      studentWorkEfficiency: 0.3,
      loyaltyRateBonus: 1
    },
    type: 'equipment'
  },
  {
    id: 'equipment_7a',
    name: '机器人助理',
    description: '实验室机器人助理，提升流程效率',
    price: 33,
    effects: { studentWorkEfficiency: 0.55 },
    type: 'equipment'
  },
  {
    id: 'equipment_8',
    name: '学术访问交流',
    description: '邀请知名学者来访交流，拓宽学生学术视野',
    price: 18,
    effects: {
      studentLoyalty: 5
    },
    type: 'consumable'
  },
  {
    id: 'equipment_9',
    name: '科研助手招聘',
    description: '招聘科研助手协助研究项目，间接提升整体效率',
    price: 18,
    effects: {
      studentWorkEfficiency: 0.32
    },
    type: 'consumable'
  },
  {
    id: 'equipment_10',
    name: '专业培训workshop',
    description: '组织专业技能培训workshop，提升学生技能水平',
    price: 12,
    effects: {
      studentLoyalty: 8
    },
    type: 'consumable'
  },
  {
    id: 'equipment_11',
    name: '高性能计算资源',
    description: '购买高性能计算资源，加速科研计算进程',
    price: 21,
    effects: {
      studentWorkEfficiency: 0.36
    },
    type: 'equipment'
  },
  {
    id: 'equipment_11a',
    name: '智能排课系统',
    description: '自动化排课与资源调度，提高效率',
    price: 27,
    effects: { studentWorkEfficiency: 0.55 },
    type: 'equipment'
  },
  {
    id: 'equipment_12',
    name: '学术期刊订阅',
    description: '订阅顶级学术期刊，保持学术前沿跟踪',
    price: 9,
    effects: {
      studentWorkEfficiency: 0.2
    },
    type: 'consumable'
  },
  {
    id: 'consumable_academic_fraud',
    name: '学术造假',
    description: '花钱买学术分，风险极高',
    price: 9,
    effects: {
      academicScore: 3
    },
    type: 'consumable'
  }
];
