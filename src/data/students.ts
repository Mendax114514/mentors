import { Student } from '../types/game';

export const studentTemplates: Omit<Student, 'id' | 'joinYear'>[] = [
  {
    name: '张小明',
    type: 'master',
    loyalty: 75,
    workEfficiency: 0.8,
    graduationYear: 3,
    potential: 70,
    smart: true,
    diligent: true
  },
  {
    name: '李小红',
    type: 'phd',
    loyalty: 85,
    workEfficiency: 0.9,
    graduationYear: 5,
    potential: 85,
    smart: true,
    diligent: true
  },
  {
    name: '王小华',
    type: 'master',
    loyalty: 65,
    workEfficiency: 0.7,
    graduationYear: 3,
    potential: 60,
    smart: false,
    diligent: true
  },
  {
    name: '刘小强',
    type: 'master',
    loyalty: 80,
    workEfficiency: 0.85,
    graduationYear: 3,
    potential: 75,
    smart: true,
    diligent: true
  },
  {
    name: '陈小丽',
    type: 'phd',
    loyalty: 90,
    workEfficiency: 0.95,
    graduationYear: 5,
    potential: 90,
    smart: true,
    diligent: true
  },
  {
    name: '赵小伟',
    type: 'master',
    loyalty: 70,
    workEfficiency: 0.75,
    graduationYear: 3,
    potential: 65,
    smart: false,
    diligent: false
  },
  {
    name: '孙小娟',
    type: 'phd',
    loyalty: 80,
    workEfficiency: 0.88,
    graduationYear: 5,
    potential: 80
  },
  {
    name: '周小军',
    type: 'master',
    loyalty: 78,
    workEfficiency: 0.82,
    graduationYear: 3,
    potential: 72
  },
  {
    name: '吴小芳',
    type: 'master',
    loyalty: 72,
    workEfficiency: 0.78,
    graduationYear: 3,
    potential: 68
  },
  {
    name: '郑小东',
    type: 'phd',
    loyalty: 88,
    workEfficiency: 0.92,
    graduationYear: 5,
    potential: 88
  },
  {
    name: '马小玲',
    type: 'master',
    loyalty: 76,
    workEfficiency: 0.83,
    graduationYear: 3,
    potential: 73
  },
  {
    name: '林小峰',
    type: 'phd',
    loyalty: 82,
    workEfficiency: 0.87,
    graduationYear: 5,
    potential: 82
  },
  {
    name: '黄小敏',
    type: 'master',
    loyalty: 68,
    workEfficiency: 0.72,
    graduationYear: 3,
    potential: 62
  },
  {
    name: '徐小博',
    type: 'phd',
    loyalty: 92,
    workEfficiency: 0.96,
    graduationYear: 5,
    potential: 92
  },
  {
    name: '何小静',
    type: 'master',
    loyalty: 74,
    workEfficiency: 0.79,
    graduationYear: 3,
    potential: 69
  }
];

export function generateRandomStudent(currentYear: number): Student {
  const template = studentTemplates[Math.floor(Math.random() * studentTemplates.length)];
  return {
    ...template,
    id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    joinYear: currentYear,
    smart: Math.random() < 0.6,
    diligent: Math.random() < 0.6
  };
}

export function generateStudentsByLoyalty(loyalty: number, currentYear: number): Student[] {
  const baseCount = Math.floor(loyalty / 25); // 每25点忠诚度获得1个基础学生
  const bonusChance = (loyalty % 25) / 25; // 额外学生的概率
  
  let studentCount = baseCount;
  if (Math.random() < bonusChance) {
    studentCount++;
  }
  
  // 根据忠诚度调整学生质量
  const students: Student[] = [];
  for (let i = 0; i < studentCount; i++) {
    const student = generateRandomStudent(currentYear);
    
    // 根据忠诚度调整学生属性
    const loyaltyBonus = Math.min(loyalty / 100, 0.3); // 最多30%的加成
    student.loyalty = Math.min(100, student.loyalty + loyaltyBonus * 20);
    student.workEfficiency = Math.min(1, student.workEfficiency + loyaltyBonus * 0.2);
    student.potential = Math.min(100, student.potential + loyaltyBonus * 15);
    
    students.push(student);
  }
  
  return students;
}
