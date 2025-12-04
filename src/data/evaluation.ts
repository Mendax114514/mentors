import { EvaluationCriteria } from '../types/game';

export const evaluationCriteria: Record<string, EvaluationCriteria> = {
  '助教': {
    level: '助教',
    year: 5,
    requirements: {
      academicScore: 60,
      funding: 20,
      reputation: 50,
      studentLoyalty: 40
    },
    description: '五年助教评估：需要达到基本的学术要求，获得一定的科研经费，建立初步的学术声誉，拥有稳定的学生团队'
  },
  '讲师': {
    level: '讲师',
    year: 5,
    requirements: {
      academicScore: 70,
      funding: 40,
      reputation: 60,
      studentLoyalty: 55
    },
    description: '五年讲师评估：需要较高的学术水平，获得更多的科研经费，在学术界有一定知名度，学生团队忠诚度较高'
  },
  '副教授': {
    level: '副教授',
    year: 5,
    requirements: {
      academicScore: 85,
      funding: 80,
      reputation: 80,
      studentLoyalty: 70
    },
    description: '五年副教授评估：需要优秀的学术成就，充足的科研经费，在学术界有较高声誉，拥有忠诚且高效的学生团队'
  },
  '教授': {
    level: '教授',
    year: 5,
    requirements: {
      academicScore: 95,
      funding: 120,
      reputation: 95,
      studentLoyalty: 85
    },
    description: '五年教授评估：需要杰出的学术贡献，丰富的科研经费，在学术界享有盛誉，拥有非常忠诚且优秀的学生团队'
  }
};

export const initialTitles = ['助教', '讲师', '副教授', '教授'];
export const titleHierarchy = {
  '助教': 0,
  '讲师': 1,
  '副教授': 2,
  '教授': 3
};

// 加权评估配置（用于新晋升逻辑与界面展示）
export const assessmentMilestones = [5, 10, 20, 30, 40];
export const assessmentWeights = {
  academicScore: 0.65,
  funding: 0,
  reputation: 0.25,
  studentLoyalty: 0.1,
};
export const assessmentThresholds: Record<number, number> = {
  5: 70,
  10: 110,
  20: 240,
  30: 360,
  40: 480,
};
