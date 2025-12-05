// 角色属性接口
export interface CharacterAttributes {
  academicScore: number;     // 学术分 - 衡量学术成果，影响项目申请和职称晋升
  funding: number;           // 经费 - 研究资金支持，影响设备采购和项目执行
  reputation: number;        // 声望 - 学术声誉，影响合作机会和学生质量
  studentLoyalty: number;    // 学生爱戴 - 学生认可程度，影响新招学生数量和质量
}

// 角色状态接口
export interface CharacterState {
  name?: string;                     // 角色名称
  title?: string;                    // 职称标题
  attributes: CharacterAttributes;
  equippedItems?: Equipment[];
  inventory?: Item[];
  currentYear?: number;
  academicRank?: 'lecturer' | 'associate_professor' | 'professor';  // 学术职称
  attributePoints?: number;           // 可分配的属性点
  totalAttributePoints?: number;    // 总获得属性点
}

// 学生接口
export interface Student {
  id: string;
  name: string;
  admissionYear: number;        // 入学年份
  graduationYear: number;       // 毕业年份
  ability: number;              // 基础能力 (1-10)
  loyalty: number;              // 对导师的忠诚度 (1-10)
  researchSkill: number;        // 科研能力 (1-10)
  teachingSkill: number;        // 教学能力 (1-10)
  status: 'active' | 'graduated' | 'dropped';
  favor?: number;               // 隐藏好感度（-100~100）
  stateTag?: string;            // 学生年度状态（如焦虑、恋爱等），无状态则为空
  guidedThisYear?: boolean;     // 当年是否已指导
}

// 学生系统状态
export interface StudentSystemState {
  currentStudents: Student[];
  graduatedStudents: Student[];
  maxStudents: number;          // 最大学生数量
  recruitmentRate: number;      // 招生率，基于学生爱戴度计算
}

// 年度事件接口
export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: 'teaching' | 'research' | 'administration' | 'special';
  options: EventOption[];
  conditions?: {
    minAttributes?: Partial<CharacterAttributes>;
    maxAttributes?: Partial<CharacterAttributes>;
    requiredItems?: string[];
    currentYear?: number;
    minYear?: number;
    maxYear?: number;
    academicRank?: string[];
  };
  rarity: 'common' | 'rare' | 'epic';
  weight: number;  // 事件生成权重
}

// 事件选项接口
export interface EventOption {
  id: string;
  text: string;
  attributeCost?: Partial<CharacterAttributes>;
  results: EventResult[];
}

// 事件结果接口
export interface EventResult {
  probability: number;
  attributeChanges: Partial<CharacterAttributes>;
  studentEffects?: {
    newStudents?: number;
    studentLoyaltyChange?: number;
    graduateBonus?: number;
  };
  items?: Equipment[];
  message: string;
  nextEvent?: string;  // 连锁事件ID
}

// 项目接口
export interface Project {
  id: string;
  name: string;
  description: string;
  category: 'national_fund' | 'provincial_fund' | 'enterprise_cooperation' | 'research_base';
  requirements: {
    minAttributes: Partial<CharacterAttributes>;
    maxProjects?: number;  // 同时可进行的项目数限制
    minAcademicRank?: string;  // 最低职称要求
  };
  duration: number;  // 项目持续时间（年）
  annualCost: Partial<CharacterAttributes>;  // 每年消耗的属性（主要是经费）
  rewards: {
    attributes: Partial<CharacterAttributes>;  // 主要是学术分和声望
    items: Equipment[];
    studentEffects?: {
      reputationBonus?: number;
      recruitmentBonus?: number;
    };
    specialEffects?: string[];
  };
  failurePenalties: {
    attributes: Partial<CharacterAttributes>;
    reputationLoss?: number;
    cooldownYears: number;  // 失败后冷却时间
  };
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
}

// 进行中的项目接口
export interface ActiveProject {
  projectId: string;
  startYear: number;
  currentYear: number;  // 当前进行到的年份
  isCompleted: boolean;
  isFailed: boolean;
  totalFundingSpent: number;  // 已花费的总经费
}

// 装备接口
export interface Equipment {
  id: string;
  name: string;
  type: 'office_equipment' | 'research_equipment' | 'teaching_equipment' | 'consumable' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effects: {
    efficiency?: {
      studentResearch?: number;      // 学生科研效率提升
      studentTeaching?: number;     // 学生教学效率提升
      dataProcessing?: number;        // 数据处理效率
      paperWriting?: number;          // 论文写作效率
    };
    special?: string[];               // 特殊效果描述
    attribute?: Partial<CharacterAttributes>;  // 少量属性加成（稀有物品）
  };
  duration?: number;  // 持续效果年数，undefined为永久
  cost: number;  // 价格
  description: string;
}

// 物品接口（继承装备）
export interface Item extends Equipment {
  quantity: number;  // 消耗品专用
}

// 采购限制接口
export interface PurchaseLimit {
  maxPurchasesPerYear: number;
  currentYearPurchases: number;
  availableItems: Equipment[];
}

// 考核标准接口
export interface EvaluationCriteria {
  year: number;                    // 考核年份
  academicRank: string;             // 考核时的职称
  requirements: {
    academicScore: number;          // 学术分要求
    reputation: number;             // 声望要求
    studentLoyalty: number;         // 学生爱戴要求
    funding?: number;                 // 经费要求（可选）
    studentsGraduated?: number;       // 毕业学生数量要求（可选）
  };
  rewards: {
    attributes: Partial<CharacterAttributes>;
    promotion?: boolean;              // 是否晋升
    specialItems?: Equipment[];
  };
  failureConsequences: {
    gameOver: boolean;               // 是否游戏结束
    attributePenalties?: Partial<CharacterAttributes>;
    message: string;                   // 失败提示信息
  };
}

// 考核结果接口
export interface EvaluationResult {
  year: number;
  passed: boolean;
  scores: {
    academicScore: number;
    reputation: number;
    studentLoyalty: number;
    total: number;
  };
  requirements: EvaluationCriteria;
  message: string;
}

// 采购记录接口
export interface PurchaseRecord {
  year: number;
  itemId: string;
  cost: number;
}

// 年度记录接口
export interface YearRecord {
  year: number;
  choices: {
    eventId?: string;
    purchaseId?: string;
    projectId?: string;
  };
  attributeChanges: CharacterAttributes;
  studentChanges: {
    recruited: number;
    graduated: number;
    averageAbility: number;
  };
  projectProgress?: number;
}

// 游戏状态接口
export interface GameState {
  character: CharacterState;
  currentYear: number;
  students: any[];                    // 学生列表
  activeProjects: any[];              // 活跃项目列表
  availableEvents: GameEvent[];
  availableProjects: any[];           // 可用项目列表
  purchasedEquipment: any[];          // 已购买装备
  gameOver: boolean;
  gameOverReason: string;
  lastYearActions: {
    eventSelected: boolean;
    purchaseMade: boolean;
    projectApplied: boolean;
  };
  studentWorkEfficiency: number;
  evaluationYear: number;
  annualChoices?: {
    eventSelected: boolean;
    purchaseMade: boolean;
    projectApplied: boolean;
  };
  activeProject?: ActiveProject | null;
  completedProjects?: string[];
  purchaseHistory?: PurchaseRecord[];
  yearHistory?: YearRecord[];
  studentSystem?: StudentSystemState;
  evaluationHistory?: EvaluationResult[];
  gameStartTime?: number;
  totalPlayTime?: number;
  version?: string;
  isGameOver?: boolean;
}
