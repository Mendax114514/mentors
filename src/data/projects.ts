import { Project } from '../types/game';

export const projects: Project[] = [
  {
    id: 'project_1',
    name: '国家自然科学基金面上项目',
    description: '申请国家自然科学基金面上项目，需要较高的学术水平和前期积累',
    requiredAttributes: {
      academicScore: 320,
      funding: 0,
      reputation: 70,
      studentLoyalty: 60
    },
    duration: 4,
    difficulty: 'hard',
    reward: {
      academicScore: 75,
      funding: 20,
      reputation: 40,
      studentLoyalty: 30
    },
    consumption: {
      academicScore: 2,
      funding: 2,
      reputation: 0,
      studentLoyalty: 30
    }
  },
  {
    id: 'project_2',
    name: '教育部人文社科项目',
    description: '申请教育部人文社会科学研究项目，适合人文社科类研究',
    requiredAttributes: {
      academicScore: 80,
      funding: 0,
      reputation: 60,
      studentLoyalty: 20
    },
    duration: 2,
    difficulty: 'medium',
    reward: {
      academicScore: 10,
      funding: 15,
      reputation: 20,
      studentLoyalty: 3
    },
    consumption: {
      academicScore: 2,
      funding: 1,
      reputation: 0,
      studentLoyalty: 1
    }
  },
  {
    id: 'project_3',
    name: '校级教学改革项目',
    description: '参与学校教学改革项目，提升教学质量和方法',
    requiredAttributes: {
      academicScore: 50,
      funding: 0,
      reputation: 40,
      studentLoyalty: 20
    },
    duration: 2,
    difficulty: 'easy',
    reward: {
      academicScore: 10,
      funding: 6,
      reputation: 10,
      studentLoyalty: 2
    },
    consumption: {
      academicScore: 1,
      funding: 2,
      reputation: 0,
      studentLoyalty: 2
    }
  },
  {
    id: 'project_4',
    name: '横向企业合作项目',
    description: '与企业合作开展应用研究项目，获得企业资助',
    requiredAttributes: {
      academicScore: 30,
      funding: 0,
      reputation: 20,
      studentLoyalty: 15
    },
    duration: 3,
    difficulty: 'medium',
    reward: {
      academicScore: 10,
      funding: 18,
      reputation: 8,
      studentLoyalty: 3
    },
    consumption: {
      academicScore: 0,
      funding: 2,
      reputation: 0,
      studentLoyalty: 5
    }
  },
  {
    id: 'project_5',
    name: '国际合作研究项目',
    description: '申请国际合作研究项目，需要较高的学术声誉和国际影响力',
    requiredAttributes: {
      academicScore: 220,
      funding: 20,
      reputation: 80,
      studentLoyalty: 0
    },
    duration: 3,
    difficulty: 'hard',
    reward: {
      academicScore: 25,
      funding: 30,
      reputation: 30,
      studentLoyalty: 5
    },
    consumption: {
      academicScore: 3,
      funding: 3,
      reputation: 0,
      studentLoyalty: 13
    }
  },
  {
    id: 'project_6',
    name: '重点实验室开放课题',
    description: '申请重点实验室开放课题，在重点实验室平台上开展研究',
    requiredAttributes: {
      academicScore: 100,
      funding: 0,
      reputation: 65,
      studentLoyalty: 0
    },
    duration: 2,
    difficulty: 'medium',
    reward: {
      academicScore: 20,
      funding: 20,
      reputation: 20,
      studentLoyalty: 4
    },
    consumption: {
      academicScore: 2,
      funding: 1,
      reputation: 0,
      studentLoyalty: 10
    }
  },
  {
    id: 'project_7',
    name: '青年基金项目',
    description: '申请青年科学基金项目，适合青年教师申报',
    requiredAttributes: {
      academicScore: 60,
      funding: 0,
      reputation: 50,
      studentLoyalty: 20
    },
    duration: 3,
    difficulty: 'medium',
    reward: {
      academicScore: 24,
      funding: 12,
      reputation: 10,
      studentLoyalty: 10
    },
    consumption: {
      academicScore: 0,
      funding: 3,
      reputation: 0,
      studentLoyalty: 6
    }
  },
  {
    id: 'project_8',
    name: '重大专项子课题',
    description: '参与国家重大专项的子课题研究，需要较强的团队实力',
    requiredAttributes: {
      academicScore: 350,
      funding: 0,
      reputation: 85,
      studentLoyalty: 0
    },
    duration: 5,
    difficulty: 'hard',
    reward: {
      academicScore: 90,
      funding: 25,
      reputation: 40,
      studentLoyalty: 6
    },
    consumption: {
      academicScore: 4,
      funding: 6,
      reputation: 0,
      studentLoyalty: 25
    }
  }
];
