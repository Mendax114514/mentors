import { create } from 'zustand';
 
import { GameState, CharacterAttributes, Student, ActiveProject } from '../types/game';
import { events } from '../data/events';
import { checkEnding, chainStartEvents, hiddenChainStartEvents, endings } from '../data/endings';
import { assessmentMilestones, assessmentThresholds, assessmentWeights } from '../data/evaluation';
import { projects } from '../data/projects';
import { equipment } from '../data/equipment';
import { generateStudentsByLoyalty, generateRandomStudent } from '../data/students';
import { studentStatuses, randomStatus } from '../data/studentStatus';
import { graduationFeedback } from '../data/graduationFeedback';
import { guidanceByState } from '../data/studentGuidance';
import { evaluationCriteria, initialTitles, titleHierarchy, assessmentMilestones, assessmentThresholds, assessmentWeights } from '../data/evaluation';

interface GameStore extends GameState {
  onboarded: boolean;
  hiddenAttributes: {
    exploitEfficiency: number;
    studentSatisfaction: number;
    networkingPower: number;
    loyaltyRateBonus?: number;
    sinValue?: number;
    studentCapBonus?: number;
  };
  attackSkills: string[];
  // 游戏控制方法
  nextYear: () => void;
  selectEvent: (eventId: string) => void;
  selectEventOption: (eventId: string, optionId: string) => void;
  purchaseEquipment: (equipmentId: string) => void;
  applyForProject: (projectId: string) => void;
  startNewGame: () => void;
  loadGame: (saveData: GameState) => void;
  setOnboarded: () => void;
  
  // 学生管理
  recruitStudents: () => void;
  graduateStudents: () => void;
  guideStudent: (studentId: string, taskId: string, optionId: string) => void;
  attackStudent: (studentId: string, kind: 'verbal'|'physical'|'special', skillId?: string) => void;
  grantFundingToStudent: (studentId: string) => void;
  
  // 项目相关
  updateActiveProjects: () => void;
  completeProject: (projectId: string) => void;
  
  // 评估相关
  checkEvaluation: () => boolean;
  getEvaluationResult: () => { passed: boolean; message: string };
}

const initialState: GameState = {
  currentYear: 1,
  character: {
    name: '新导师',
    title: '助教',
    attributes: {
      academicScore: 50,
      funding: 10,
      reputation: 40,
      studentLoyalty: 30
    }
  },
  students: [],
  activeProjects: [],
  availableEvents: events,
  availableProjects: projects,
  purchasedEquipment: [],
  gameOver: false,
  gameOverReason: '',
  lastYearActions: {
    eventSelected: false,
    purchaseMade: false,
    projectApplied: false
  },
  studentWorkEfficiency: 1.0,
  evaluationYear: 5
};

export const useGameStore = create<GameStore>()(
    (set, get) => ({
      ...initialState,
      onboarded: false,
      hiddenAttributes: {
        exploitEfficiency: 1.0,
        studentSatisfaction: 1.0,
        networkingPower: 1.0,
        loyaltyRateBonus: 0,
        sinValue: 0,
        studentCapBonus: 0,
      },
      attackSkills: [],
      beatCount: 0,
      assassinationEligibleFromYear: undefined as number | undefined,
      hospital: false,
      smileThreatYear: undefined as number | undefined,
      assessmentPlan: [...assessmentMilestones],
      yearReverts: [] as Array<{ dueYear: number; attr: Partial<CharacterAttributes>; loyaltyRateBonus?: number }>,
      pendingEvents: [] as string[],
      eventHistory: [] as Array<{ year: number; eventId: string; optionId: string; message: string; changes: Partial<CharacterAttributes> }>,
      scheduledEvents: [] as Array<{ id: string; dueYear: number }>,
      chainState: { active: false } as { active: boolean },
      hiddenChainAttempted: false,
      incidentQueue: [] as Array<{ id: string; dueYear: number; payload?: any }>,
      gameOverTier: undefined as undefined | 'hidden' | 'legendary' | 'normal',

      startNewGame: () => {
        set({
          ...initialState,
          students: generateStudentsByLoyalty(30, 1),
          availableEvents: [...events],
          availableProjects: [...projects],
          purchasedEquipment: [],
          onboarded: false,
          gameOver: false,
          gameOverReason: '',
          eventHistory: [],
          pendingEvents: [],
          scheduledEvents: (() => {
            let pool = [...chainStartEvents]
            let startId = pool[Math.floor(Math.random() * pool.length)]
            if (hiddenChainStartEvents.includes(startId)) {
              const ok = Math.random() < 0.5
              if (!ok) {
                pool = pool.filter(id => !hiddenChainStartEvents.includes(id))
                startId = pool[Math.floor(Math.random() * pool.length)]
              }
            }
            const dueYear = 10 + Math.floor(Math.random() * 6)
            return [{ id: startId, dueYear }]
          })(),
          chainState: { active: false },
          hiddenChainAttempted: false,
          attackSkills: [],
          beatCount: 0,
          assassinationEligibleFromYear: undefined,
          hospital: false,
          smileThreatYear: undefined,
          yearReverts: [],
          lastYearActions: { eventSelected: false, purchaseMade: false, projectApplied: false }
        });
      },

      setOnboarded: () => {
        set({ onboarded: true });
      },

      loadGame: (saveData: GameState) => {
        set(saveData);
      },

      nextYear: () => {
        const state = get();
        if (state.currentYear >= 40) {
          const endingObj = checkEnding({
            attributes: state.character.attributes,
            eventHistory: get().eventHistory.map(h => ({ eventId: h.eventId, optionId: h.optionId })),
            purchasedEquipmentIds: get().purchasedEquipment.map(e => e.id),
            currentYear: 40,
            maxYears: 40
          })
          set({ gameOver: true, gameOverReason: endingObj?.name ?? '任期结束', gameOverTier: endingObj?.tier ?? 'normal' })
          return
        }
        const newYearVal = state.currentYear + 1;

        // 隐藏结局：被学生刺杀（每年开始判定）
        const condLoyaltyNeg = get().character.attributes.studentLoyalty < 0
        const condBeatEnough = (get() as any).beatCount >= 6
        if (!get().assassinationEligibleFromYear && condLoyaltyNeg && condBeatEnough) {
          set({ assassinationEligibleFromYear: state.currentYear + 1 })
        }
        if (get().assassinationEligibleFromYear && newYearVal >= (get().assassinationEligibleFromYear as number) && condLoyaltyNeg && condBeatEnough) {
          if (Math.random() < 0.3) {
            set({ gameOver: true, gameOverReason: '隐藏结局：被学生刺杀', gameOverTier: 'hidden' })
            return
          }
        }
        // 奇怪表情威胁：次年 50% 直接触发刺杀
        if (get().smileThreatYear && newYearVal >= (get().smileThreatYear as number)) {
          if (Math.random() < 0.5) {
            set({ gameOver: true, gameOverReason: '隐藏结局：被学生刺杀', gameOverTier: 'hidden', smileThreatYear: undefined })
            return
          } else {
            set({ smileThreatYear: undefined })
          }
        }

        // 特殊事件在年初优先触发
        const idx = get().incidentQueue.findIndex(i => i.dueYear === newYearVal)
        if (idx >= 0) {
          const inc = get().incidentQueue[idx]
          const def = (require('../data/incidents') as any).incidents[inc.id]
          if (def) {
            const cur = { ...get().character.attributes }
            Object.entries(def.effects).forEach(([k,v]) => { (cur as any)[k] = Math.max(0, ((cur as any)[k] || 0) + (v as number)) })
            const ha = { ...get().hiddenAttributes } as any
            if (def.sinDelta) ha.sinValue = Math.min(100, (ha.sinValue || 0) + def.sinDelta)
            set({ character: { ...get().character, attributes: cur }, hiddenAttributes: ha, incidentQueue: get().incidentQueue.filter((_,i) => i !== idx) })
            window.dispatchEvent(new CustomEvent('special-incident', { detail: { title: def.title, message: def.message } }))
          }
        }

        // 学生年度状态分配与被动影响
        const statusById: Record<string, any> = {}
        studentStatuses.forEach(s => statusById[s.id] = s)
        const updatedStudents = get().students.map(stu => {
          const s = { ...stu } as any
          // 每年重置指导标记
          s.guidedThisYear = false
          const tag = s.stateTag
          if (tag && statusById[tag]) {
            const eff = statusById[tag].effects
            if (eff?.passiveDrift?.loyalty) s.loyalty = Math.max(0, Math.min(100, s.loyalty + eff.passiveDrift.loyalty))
          }
          if (!s.stateTag) {
            const maybe = randomStatus()
            s.stateTag = maybe
          }
          s.loyalty = Math.min(100, s.loyalty + 10)
          return s
        })
        set({ students: updatedStudents })

        // 年初立即退学：任何忠诚度<=0的学生直接退学并提示
        if (get().students.some(s => (s as any).loyalty <= 0)) {
          const survivors = get().students.filter(s => (s as any).loyalty > 0)
          set({ students: survivors })
          window.dispatchEvent(new CustomEvent('special-incident', { detail: { title: '学生退学', message: '有学生因忠诚度过低选择退学，团队士气受挫' } }))
        }

        // 先应用上一年消耗品的回退效果（只维持一年）
        const reverts = get().yearReverts.filter(r => r.dueYear === newYearVal)
        if (reverts.length) {
          let attr = { ...state.character.attributes } as CharacterAttributes
          let hr = { ...get().hiddenAttributes }
          reverts.forEach(r => {
            Object.entries(r.attr).forEach(([k, v]) => {
              (attr as any)[k] = ((attr as any)[k] || 0) - (v as number)
            })
            if (r.loyaltyRateBonus) hr.loyaltyRateBonus = (hr.loyaltyRateBonus || 0) - r.loyaltyRateBonus
          })
          set({ character: { ...state.character, attributes: attr }, hiddenAttributes: hr })
          set({ yearReverts: get().yearReverts.filter(r => r.dueYear !== newYearVal) })
        }
        
        // 年度推进需要完成“事件”，采购与项目为可选（医院养病状态跳过）
        if (!state.lastYearActions.eventSelected && !get().hospital) {
          window.dispatchEvent(new CustomEvent('game-message', { detail: '请先完成本年度的事件' }));
          return;
        }
        if (get().hospital) set({ hospital: false })

        // 自然增长
        const studentsCount = state.students.length;
        const eff = state.studentWorkEfficiency;
        const exploit = get().hiddenAttributes.exploitEfficiency;
        const satisfy = get().hiddenAttributes.studentSatisfaction;
        const network = get().hiddenAttributes.networkingPower;

        // 学生年度产出：按学生工作效率与潜力/忠诚度产生学术分与少量经费/声望
        let perStudentAcademic = 0
        let perStudentFunding = 0
        let perStudentReputation = 0
        const statusMap2: Record<string, any> = {}
        studentStatuses.forEach(ss => statusMap2[ss.id] = ss)
        for (const stu of state.students) {
          let we = (stu as any).workEfficiency ?? 0.8
          let pot = ((stu as any).potential ?? 70) / 100
          const loy = ((stu as any).loyalty ?? 70) / 100
          if ((stu as any).smart) pot += 0.2
          else pot -= 0.1
          if ((stu as any).diligent) we += 0.2
          else we -= 0.1
          we = Math.max(0.3, Math.min(1.2, we))
          pot = Math.max(0.3, Math.min(1.2, pot))
          let a = Math.round(we * pot * loy * 1)
          let f = Math.round(we * loy * 0.5)
          let r = Math.round(pot * 0.3)
          const st = (stu as any).stateTag
          const mul = st ? statusMap2[st]?.effects?.outputMultiplier : undefined
          if (mul) {
            a = Math.max(0, Math.round(a * (mul.academic ?? 1)))
            f = Math.max(0, Math.round(f * (mul.funding ?? 1)))
            r = Math.max(0, Math.round(r * (mul.reputation ?? 1)))
          }
          perStudentAcademic += a
          perStudentFunding += f
          perStudentReputation += r
        }

        const academicGrowth = Math.round((1 + studentsCount * 0.05) * eff * exploit) + perStudentAcademic;
        const fundingGrowth = Math.round(1 + network * 0.5 + state.character.attributes.reputation * 0.02) + perStudentFunding;
        const reputationGrowth = Math.round(0.3 + state.character.attributes.academicScore * 0.01) + perStudentReputation;
        // 忠诚度自然增长：a × b，a为成长率（人设+设备+基础），b为学生数
        const loyaltyRateBonusEquip = state.purchasedEquipment.reduce((acc, it) => acc + (((it as any).effects?.loyaltyRateBonus) || 0), 0)
        const loyaltyRateBase = (get().hiddenAttributes.loyaltyRateBonus || 0) + ((satisfy - 1) * 1)
        const a = Math.max(-2, Math.round(loyaltyRateBase + loyaltyRateBonusEquip))
        const b = studentsCount
        const loyaltyDelta = a * b
        const loyaltyGrowth = Math.max(-10, Math.min(100 - state.character.attributes.studentLoyalty, loyaltyDelta));

        let grownAttributes = {
          academicScore: state.character.attributes.academicScore + academicGrowth,
          funding: state.character.attributes.funding + fundingGrowth,
          reputation: state.character.attributes.reputation + reputationGrowth,
          studentLoyalty: Math.min(100, state.character.attributes.studentLoyalty + loyaltyGrowth)
        };

        // 项目年度消耗：进行中的项目对属性的年度消耗（包含学生忠诚度下降）
        if (state.activeProjects.length > 0) {
          const totalConsumption = state.activeProjects.reduce((acc, p: any) => {
            const c = p.consumption || {}
            return {
              academicScore: acc.academicScore + (c.academicScore || 0),
              funding: acc.funding + (c.funding || 0),
              reputation: acc.reputation + (c.reputation || 0),
              studentLoyalty: acc.studentLoyalty + (c.studentLoyalty || 0),
            }
          }, { academicScore: 0, funding: 0, reputation: 0, studentLoyalty: 0 })
          grownAttributes = {
            academicScore: Math.max(0, grownAttributes.academicScore - totalConsumption.academicScore),
            funding: Math.max(0, grownAttributes.funding - totalConsumption.funding),
            reputation: Math.max(0, grownAttributes.reputation - totalConsumption.reputation),
            studentLoyalty: grownAttributes.studentLoyalty - totalConsumption.studentLoyalty,
          }
        }
        // 学生忠诚度为负：每年退学 ceil(人数/5)，并提示
        if (grownAttributes.studentLoyalty < 0 && state.students.length > 0) {
          const toDrop = Math.ceil(state.students.length / 5)
          const remaining = state.students.slice(0, Math.max(0, state.students.length - toDrop))
          set({ students: remaining })
          window.dispatchEvent(new CustomEvent('game-message', { detail: `学生忠诚度过低，${toDrop}名学生退学，请及时改善管理` }))
        }

        // 更新项目进度
        const updatedProjects = state.activeProjects.map(project => ({
          ...project,
          progress: project.progress + 1
        }));

        // 完成项目
        const completedProjects = updatedProjects.filter(p => p.progress >= p.duration);
        completedProjects.forEach(project => {
          get().completeProject(project.id);
        });

        // 更新活跃项目（移除已完成的）
        const remainingProjects = updatedProjects.filter(p => p.progress < p.duration);

        // 学生毕业：仅移除，不再产生额外结算与提示
        const currentYearVal = state.currentYear
        const remainingStudents = state.students.filter(student => {
          const yearsInProgram = currentYearVal - (student as any).joinYear
          return yearsInProgram < (student as any).graduationYear
        })
        // 毕业反馈：根据隐藏好感度给予夸奖或辱骂并调整声望
        const grads = state.students.filter(student => {
          const yearsInProgram = currentYearVal - (student as any).joinYear
          return yearsInProgram >= (student as any).graduationYear
        }) as any[]
        let repDelta = 0
        grads.forEach(g => {
          const f = (g.favor ?? 0) as number
          if (f >= 60) {
            repDelta += 2
            const msg = graduationFeedback.positive[Math.floor(Math.random() * graduationFeedback.positive.length)].replace('{name}', g.name)
            window.dispatchEvent(new CustomEvent('game-message', { detail: msg }))
          } else if (f <= -60) {
            repDelta -= 2
            const msg = graduationFeedback.negative[Math.floor(Math.random() * graduationFeedback.negative.length)].replace('{name}', g.name)
            window.dispatchEvent(new CustomEvent('game-message', { detail: msg }))
          }
        })
        if (repDelta !== 0) {
          set({ character: { ...get().character, attributes: { ...get().character.attributes, reputation: Math.max(0, get().character.attributes.reputation + repDelta) } } })
        }
        set({ students: remainingStudents })

        // 招募新学生（基于当前学生忠诚度）
        get().recruitStudents();

        // 学生数量上限：按职称限制并允许设备提升上限
        const rankCapMap: Record<string, number> = { '助教': 3, '讲师': 5, '副教授': 8, '教授': 12 }
        const baseCap = rankCapMap[state.character.title] ?? 3
        const capBonusEquip = state.purchasedEquipment.reduce((acc, it) => acc + (((it as any).effects?.studentCapBonus) || 0), 0)
        const capBonus = capBonusEquip + ((get().hiddenAttributes as any).studentCapBonus || 0)
        const maxCap = baseCap + capBonus
        if (get().students.length > maxCap) {
          set({ students: get().students.slice(0, maxCap) })
        }

        // 晋升考核前一年提醒（显示下一次考核年份与当前分/阈值）
        const upcoming = get().assessmentPlan.find(m => m === state.currentYear + 1)
        if (upcoming) {
          const preScore = state.character.attributes.academicScore * assessmentWeights.academicScore
            + state.character.attributes.funding * assessmentWeights.funding
            + state.character.attributes.reputation * assessmentWeights.reputation
            + state.character.attributes.studentLoyalty * assessmentWeights.studentLoyalty
          const idxPlan = get().assessmentPlan.findIndex(m => m === upcoming)
          const baseYear = assessmentMilestones[idxPlan] ?? upcoming
          const preThreshold = assessmentThresholds[baseYear] ?? 0
          if (preScore < preThreshold) {
            window.dispatchEvent(new CustomEvent('milestone-toast', { detail: { type: 'pre', year: upcoming, next: upcoming, score: preScore, threshold: preThreshold } }))
          }
        }

        // 检查五年评估
        const newYear = newYearVal;
        let gameOver = false;
        let gameOverReason = '';

        const plan = get().assessmentPlan
        if (plan.includes(newYear)) {
          const score = grownAttributes.academicScore * assessmentWeights.academicScore
            + grownAttributes.funding * assessmentWeights.funding
            + grownAttributes.reputation * assessmentWeights.reputation
            + grownAttributes.studentLoyalty * assessmentWeights.studentLoyalty;
          const idxPlan = plan.findIndex(m => m === newYear)
          const baseYear = assessmentMilestones[idxPlan] ?? newYear
          const threshold = assessmentThresholds[baseYear] ?? 0;
          const passed = score >= threshold;
          if ((newYear === 5 || newYear === 10) && !passed && state.character.title !== '教授') {
            gameOver = true;
            gameOverReason = '非升即走';
          } else if (!passed) {
            const updatedPlan = plan.map((m, i) => i > idxPlan ? m + 5 : m)
            set({ assessmentPlan: updatedPlan })
          } else if (passed && state.character.title !== '教授') {
            const currentTitleIndex = titleHierarchy[state.character.title as keyof typeof titleHierarchy];
            const nextTitle = initialTitles[currentTitleIndex + 1];
            if (nextTitle) {
              set(s => ({ character: { ...s.character, title: nextTitle } }));
              const nextMilestoneInfo = get().assessmentPlan.find(m => m > newYear)
              window.dispatchEvent(new CustomEvent('milestone-toast', { detail: { type: 'pass', year: newYear, next: nextMilestoneInfo, score, threshold } }))
            }
          }
          const nextMilestone = get().assessmentPlan.find(m => m > newYear) ?? newYear;
          set({ evaluationYear: nextMilestone });
        }

        // 在进入下一年前，检查隐藏结局（含最小年份与末期限制）
        const endingObj = checkEnding({
          attributes: grownAttributes,
          eventHistory: get().eventHistory.map(h => ({ eventId: h.eventId, optionId: h.optionId })),
          purchasedEquipmentIds: get().purchasedEquipment.map(e => e.id),
          currentYear: state.currentYear,
          maxYears: 40
        })
        if (endingObj) {
          set({ gameOver: true, gameOverReason: endingObj.name, gameOverTier: endingObj.tier })
          return
        }

        // 合并自然增长与本年内其他奖励（如项目完成）
        const latest = get().character.attributes
        const base = state.character.attributes
        const mergedAttrs = {
          academicScore: latest.academicScore + (grownAttributes.academicScore - base.academicScore),
          funding: latest.funding + (grownAttributes.funding - base.funding),
          reputation: latest.reputation + (grownAttributes.reputation - base.reputation),
          studentLoyalty: Math.min(100, latest.studentLoyalty + (grownAttributes.studentLoyalty - base.studentLoyalty)),
        }

        set({
          currentYear: newYear,
          activeProjects: remainingProjects,
          lastYearActions: {
            eventSelected: false,
            purchaseMade: false,
            projectApplied: false
          },
          gameOver,
          gameOverReason,
          character: { ...get().character, attributes: mergedAttrs }
        });
      },

      selectEvent: (eventId: string) => {
        const state = get();
        const event = state.availableEvents.find(e => e.id === eventId);
        if (!event || state.lastYearActions.eventSelected) return;
        // 不再直接确定结果，交由selectEventOption处理
      },

      selectEventOption: (eventId: string, optionId: string) => {
        const state = get();
        const event = state.availableEvents.find(e => e.id === eventId);
        if (!event || state.lastYearActions.eventSelected) return;
        const option = event.options.find(o => o.id === optionId);
        if (!option) return;

        // 扣除属性成本
        let newAttributes: CharacterAttributes = { ...state.character.attributes } as CharacterAttributes;
        if (option.attributeCost) {
          Object.entries(option.attributeCost).forEach(([key, value]) => {
            (newAttributes as any)[key] = ((newAttributes as any)[key] || 0) - (value as number);
          });
        }

        // 按概率选择结果（受隐藏属性与角色属性影响）
        const bias = Math.max(-10, Math.min(10, ((get().hiddenAttributes as any).sinValue || 0) - (state.character.attributes.reputation * 0.05)))
        let r = Math.max(0, Math.min(100, (Math.random() * 100) + bias));
        let acc = 0;
        let selected = option.results[0];
        for (const res of option.results) {
          acc += res.probability;
          if (r <= acc) { selected = res; break; }
        }
        // 阶下囚强行推进：罪恶值过高时强制选择推进结果
        const imprisonedSeq = ['report_scandal','disciplinary_hearing','evidence_escalation','court_trial']
        if ((get().hiddenAttributes as any).sinValue >= 80 && imprisonedSeq.includes(eventId)) {
          const forward = option.results.find(r => (r as any).nextEvent) || option.results.find(r => (r as any).id === 'accept_verdict') || selected
          selected = forward
        }

        // 应用结果属性变化（含百分比）并积累罪恶值
        let sinDelta = 0
        Object.entries(selected.attributeChanges).forEach(([key, value]) => {
          const v = value as number
          (newAttributes as any)[key] = ((newAttributes as any)[key] || 0) + v
          if (key === 'reputation' && typeof v === 'number' && v < 0) sinDelta += Math.abs(v)
          if (key === 'studentLoyalty' && typeof v === 'number' && v < 0) sinDelta += Math.abs(v) * 0.5
        });
        const pct = (selected as any).percentChanges as Record<string, number> | undefined
        if (pct) {
          Object.entries(pct).forEach(([k, p]) => {
            const base = (newAttributes as any)[k] || 0
            const delta = Math.round(base * p)
            (newAttributes as any)[k] = base + delta
          })
        }
        const giveSkillVal = (selected as any).giveSkill as string | undefined
        if (giveSkillVal) {
          const skillId = giveSkillVal === '随机' ? ['dragon_palm','shadow_kick','sword_form'][Math.floor(Math.random()*3)] : giveSkillVal
          const setSkills = new Set(get().attackSkills)
          setSkills.add(skillId)
          set({ attackSkills: Array.from(setSkills) })
        }
        if (sinDelta) {
          const ha = { ...get().hiddenAttributes } as any
          ha.sinValue = Math.min(100, (ha.sinValue || 0) + sinDelta)
          set({ hiddenAttributes: ha })
        }

        set({
          character: {
            ...state.character,
            attributes: newAttributes
          },
          lastYearActions: {
            ...state.lastYearActions,
            eventSelected: true
          }
        });
        const names: Record<string, string> = {
          academicScore: '学术分',
          funding: '经费',
          reputation: '声望',
          studentLoyalty: '学生爱戴',
        };
        const deltaText = Object.entries(selected.attributeChanges).map(([k,v]) => `${names[k] ?? k}${(v as number) >= 0 ? '+' : ''}${v}`).join('，')
        const msgText = `${selected.message ?? '事件已处理'}${deltaText ? '\n变化：' + deltaText : ''}`
        // 记录事件历史
        set({ eventHistory: [...get().eventHistory, { year: state.currentYear, eventId, optionId, message: msgText, changes: selected.attributeChanges }] });
        const giveSkill = (selected as any).giveSkill as string | undefined
        if (giveSkill) {
          const skills = new Set(get().attackSkills)
          skills.add(giveSkill)
          set({ attackSkills: Array.from(skills) })
          window.dispatchEvent(new CustomEvent('game-message', { detail: `获得武学：${giveSkill}` }))
        }
        const nextId = (selected as any).nextEvent as string | undefined
        let handledChain = false
        const relRules = endings.filter(r => (r.sequence || []).includes(eventId))
        for (const rule of relRules) {
          const req = rule.sequenceOptions?.[eventId]
          if (req && req !== optionId) {
            const offset = 3 + Math.floor(Math.random() * 3)
            const dueYear = state.currentYear + offset
            set({ scheduledEvents: [...get().scheduledEvents, { id: eventId, dueYear }] })
            handledChain = true
            break
          }
        }
        if (!handledChain) {
          if (nextId) {
            const offset = 3 + Math.floor(Math.random() * 3)
            const dueYear = state.currentYear + offset
            set({ scheduledEvents: [...get().scheduledEvents, { id: nextId, dueYear }] })
          } else {
            const scheduled = get().scheduledEvents
            if (scheduled.length < 3) {
              const offset = 3 + Math.floor(Math.random() * 3)
              let pool = [...chainStartEvents]
              const dueYear = state.currentYear + offset
              let startId = pool[Math.floor(Math.random() * pool.length)]
              if (hiddenChainStartEvents.includes(startId)) {
                if (!get().hiddenChainAttempted) {
                  const ok = Math.random() < 0.5
                  set({ hiddenChainAttempted: true })
                  if (!ok) {
                    pool = pool.filter(id => !hiddenChainStartEvents.includes(id))
                    startId = pool[Math.floor(Math.random() * pool.length)]
                  }
                } else {
                  pool = pool.filter(id => !hiddenChainStartEvents.includes(id))
                  startId = pool[Math.floor(Math.random() * pool.length)]
                }
              }
              set({ scheduledEvents: [...scheduled, { id: startId, dueYear }] })
            }
          }
        }
        // 若本次事件来自队列首，则消费队列
        const q = get().pendingEvents
        if (q.length && q[0] === eventId) {
          set({ pendingEvents: q.slice(1) })
        }
        window.dispatchEvent(new CustomEvent('game-message', { detail: msgText }));
      },

      purchaseEquipment: (equipmentId: string) => {
        const state = get();
        const item = equipment.find(e => e.id === equipmentId);
        
        if (!item) return;
        if (item.type !== 'consumable' && state.purchasedEquipment.some(pe => pe.id === item.id)) {
          window.dispatchEvent(new CustomEvent('game-message', { detail: '该非消耗品已拥有，无法重复购买' }));
          return;
        }
        if (state.character.attributes.funding < item.price) {
          window.dispatchEvent(new CustomEvent('game-message', { detail: '资金不足，无法购买此物品' }));
          return;
        }

        // 扣除资金
        const newAttributes = {
          ...state.character.attributes,
          funding: state.character.attributes.funding - item.price
        };

        // 应用装备效果（消耗品仅当年即时效果，不改变长期效率；设备类提升长期效率）
        let newWorkEfficiency = state.studentWorkEfficiency;
        if (item.type !== 'consumable' && item.effects.studentWorkEfficiency) {
          newWorkEfficiency += item.effects.studentWorkEfficiency;
        }

        // 如果影响学生忠诚度，需要更新所有学生的忠诚度（固定数值增幅），同时更新全局学生爱戴
        let newStudents = [...state.students];
        if (item.effects.studentLoyalty) {
          newStudents = state.students.map(student => ({
            ...student,
            loyalty: Math.min(100, student.loyalty + item.effects.studentLoyalty!)
          }));
          newAttributes.studentLoyalty = Math.min(100, (newAttributes.studentLoyalty || 0) + item.effects.studentLoyalty!)
        }

        // 若装备对学术分/声望有即时增幅，应用到属性
        const immediateKeys: Array<keyof typeof newAttributes> = ['academicScore', 'reputation', 'studentLoyalty']
        immediateKeys.forEach(k => {
          const val = (item.effects as any)[k]
          if (typeof val === 'number') {
            (newAttributes as any)[k] = (newAttributes as any)[k] + val
          }
        })

        // 消耗品效果只持续一年：记录回退
        if (item.type === 'consumable') {
          const revertAttr: Partial<CharacterAttributes> = {}
          immediateKeys.forEach(k => {
            const val = (item.effects as any)[k]
            if (typeof val === 'number' && val !== 0) (revertAttr as any)[k] = val
          })
          const lr = (item.effects as any).loyaltyRateBonus ? (item.effects as any).loyaltyRateBonus : undefined
          if (Object.keys(revertAttr).length || lr) {
            set({ yearReverts: [...get().yearReverts, { dueYear: state.currentYear + 1, attr: revertAttr, loyaltyRateBonus: lr }] })
          }
        }

        // 消耗品可直接增加学生数量
        if (item.type === 'consumable' && (item.effects as any).studentCount) {
          const add = (item.effects as any).studentCount as number;
          const added = Array.from({ length: add }).map(() => generateRandomStudent(state.currentYear));
          newStudents = newStudents.concat(added);
        }

        // 学术造假触发举报任务链
        if (item.id === 'consumable_academic_fraud') {
          const dueYear = state.currentYear + 1
          set({ scheduledEvents: [...get().scheduledEvents, { id: 'report_scandal', dueYear }] })
        }

        set({
          character: {
            ...state.character,
            attributes: newAttributes
          },
          purchasedEquipment: [...state.purchasedEquipment, item],
          studentWorkEfficiency: newWorkEfficiency,
          students: newStudents,
          // 每年允许购买多个装备
        });

        window.dispatchEvent(new CustomEvent('game-message', { detail: `成功购买：${item.name}` }));
      },

      applyForProject: (projectId: string) => {
        const state = get();
        const project = state.availableProjects.find(p => p.id === projectId);
        
        if (!project || state.lastYearActions.projectApplied) return;
        if (state.activeProjects.length > 0) {
          window.dispatchEvent(new CustomEvent('game-message', { detail: '您已经有一个正在进行的项目，请先完成当前项目' }));
          return;
        }

        // 检查属性要求
        const attributes = state.character.attributes;
        const required = project.requiredAttributes;
        
        const canApply = Object.entries(required).every(([key, value]) => {
          return (attributes as any)[key] >= value;
        });

        if (!canApply) {
          const names: Record<string, string> = {
            academicScore: '学术分',
            funding: '经费',
            reputation: '声望',
            studentLoyalty: '学生爱戴',
          };
          const lines = Object.entries(required).map(([key, need]) => {
            const cur = (attributes as any)[key] ?? 0
            return `• ${names[key] ?? key}：需要${need}，当前${cur}`
          }).join('\n')
          window.dispatchEvent(new CustomEvent('game-message', { detail: `不满足申请要求：\n${lines}` }));
          return;
        }

        // 创建活跃项目
        const activeProject: ActiveProject = {
          ...project,
          progress: 0
        };

        set({
          activeProjects: [activeProject],
          lastYearActions: {
            ...state.lastYearActions,
            projectApplied: true
          }
        });

        window.dispatchEvent(new CustomEvent('game-message', { detail: `成功申请项目：${project.name}` }));
      },

      recruitStudents: () => {
        const state = get();
        const currentYear = state.currentYear;
        
        // 基于学生忠诚度招募新学生
        const newStudents = generateStudentsByLoyalty(
          state.character.attributes.studentLoyalty,
          currentYear
        );

        if (newStudents.length > 0) {
          set({ students: [...state.students, ...newStudents] });
        }
      },

      graduateStudents: () => {
        const state = get();
        const currentYear = state.currentYear;
        
        // 找出今年要毕业的学生
        const graduatingStudents = state.students.filter(student => {
          const yearsInProgram = currentYear - student.joinYear;
          return yearsInProgram >= student.graduationYear;
        });

        if (graduatingStudents.length > 0) {
          const remainingStudents = state.students.filter(student => {
            const yearsInProgram = currentYear - student.joinYear;
            return yearsInProgram < student.graduationYear;
          });

          set({
            students: remainingStudents
          });

          // 毕业生会提供一定的奖励
          let totalAcademicBonus = 0;
          let totalReputationBonus = 0;
          
          graduatingStudents.forEach(student => {
            totalAcademicBonus += student.potential * 0.1;
            totalReputationBonus += student.potential * 0.05;
          });

          const newAttributes = {
            ...state.character.attributes,
            academicScore: state.character.attributes.academicScore + totalAcademicBonus,
            reputation: state.character.attributes.reputation + totalReputationBonus
          };

          set({
            character: {
              ...state.character,
              attributes: newAttributes
            }
          });

          window.dispatchEvent(new CustomEvent('game-message', { detail: `${graduatingStudents.length}名学生毕业，获得学术分+${totalAcademicBonus.toFixed(1)}，声望+${totalReputationBonus.toFixed(1)}` }));
        }
      },

      completeProject: (projectId: string) => {
        const state = get();
        const project = state.activeProjects.find(p => p.id === projectId);
        
        if (!project) return;

        // 应用项目奖励
        const newAttributes = { ...state.character.attributes };
        // 基础项目收益系数（整体提升），并按人设类别加成不同项目类型
        const baseMultiplier = 1.5
        const personaMul = get().hiddenAttributes
        const name = (project as any).name as string
        let catMul = 0
        if (name.includes('企业')) catMul += (personaMul as any).projectMultiplierEnterprise || 0
        if (name.includes('国家') || name.includes('重大专项')) catMul += (personaMul as any).projectMultiplierNational || 0
        const m = Math.max(1, baseMultiplier + catMul)
        Object.entries((project as any).reward).forEach(([key, value]) => {
          if (key in newAttributes) {
            (newAttributes as any)[key] += Math.round((value as number) * m);
          }
        });

        // 学生工作加成
        let newWorkEfficiency = state.studentWorkEfficiency;
        if (project.reward.academicScore) {
          newWorkEfficiency += project.reward.academicScore * 0.01;
        }

        set({
          character: {
            ...state.character,
            attributes: newAttributes
          },
          studentWorkEfficiency: newWorkEfficiency
        });

        window.dispatchEvent(new CustomEvent('game-message', { detail: `项目完成：${project.name}，获得奖励！` }));
      },

      checkEvaluation: () => {
        const state = get();
        const plan = state.assessmentPlan ?? assessmentMilestones;
        const nextMilestone = plan.find(m => m >= state.currentYear) ?? plan[plan.length - 1];
        const score = state.character.attributes.academicScore * assessmentWeights.academicScore
          + state.character.attributes.funding * assessmentWeights.funding
          + state.character.attributes.reputation * assessmentWeights.reputation
          + state.character.attributes.studentLoyalty * assessmentWeights.studentLoyalty;
        const idxPlan = plan.findIndex(m => m === nextMilestone)
        const baseYear = assessmentMilestones[idxPlan] ?? nextMilestone
        const threshold = assessmentThresholds[baseYear] ?? 0;
        return score >= threshold;
      },

      getEvaluationResult: () => {
        const state = get();
        const plan = state.assessmentPlan ?? assessmentMilestones;
        const nextMilestone = plan.find(m => m >= state.currentYear) ?? plan[plan.length - 1];
        const score = state.character.attributes.academicScore * assessmentWeights.academicScore
          + state.character.attributes.funding * assessmentWeights.funding
          + state.character.attributes.reputation * assessmentWeights.reputation
          + state.character.attributes.studentLoyalty * assessmentWeights.studentLoyalty;
        const idxPlan = plan.findIndex(m => m === nextMilestone)
        const baseYear = assessmentMilestones[idxPlan] ?? nextMilestone
        const threshold = assessmentThresholds[baseYear] ?? 0;
        const passed = score >= threshold;
        return {
          passed,
          message: passed ? '恭喜！您通过了评估，可以继续晋升。' : '很遗憾，您未达到评估阈值。'
        };
      },

      guideStudent: (studentId: string, taskId: string, optionId: string) => {
        const store = get()
        const stu = store.students.find(s => s.id === studentId) as any
        if (!stu || (stu as any).guidedThisYear) return
        const tasks = guidanceByState[stu.stateTag || 'motivated'] || []
        const task = tasks.find(t => t.id === taskId)
        if (!task) return
        const opt = task.options.find(o => o.id === optionId)
        if (!opt) return
        let roll = Math.random() * 100
        let acc = 0
        let picked = opt.results[0]
        for (const r of opt.results) { acc += r.probability; if (roll <= acc) { picked = r; break } }
        const updated = store.students.map(s => {
          if (s.id !== studentId) return s
          const n: any = { ...s }
          if (typeof picked.loyalty === 'number') n.loyalty = Math.max(0, Math.min(100, n.loyalty + picked.loyalty))
          if (typeof picked.favor === 'number') n.favor = Math.max(-100, Math.min(100, (n.favor || 0) + picked.favor))
          if (picked.stateTag) n.stateTag = picked.stateTag
          n.guidedThisYear = true
          return n
        })
        set({ students: updated })
        const trig = (picked as any).triggerIncident as string | undefined
        if (trig) set({ incidentQueue: [...get().incidentQueue, { id: trig, dueYear: store.currentYear + 1 }] })
        window.dispatchEvent(new CustomEvent('game-message', { detail: `已指导 ${stu.name}` }))
      },

      attackStudent: (studentId: string, kind: 'verbal'|'physical'|'special', skillId?: string) => {
        const store = get()
        const stu = store.students.find(s => s.id === studentId) as any
        if (!stu) return
        if (kind !== 'verbal') set({ beatCount: (get() as any).beatCount + 1 })
        const baseLoss = stu.loyalty >= 50 ? Math.floor(stu.loyalty / 2) : 25
        const loss = kind === 'verbal' ? Math.floor(baseLoss / 2) : baseLoss
        const newLoyalty = Math.max(0, stu.loyalty - loss)
        if (newLoyalty <= 0 && kind !== 'verbal') {
          // 立即退学与严厉惩罚
          const remaining = store.students.filter(s => s.id !== studentId)
          const attr = { ...store.character.attributes }
          attr.reputation = Math.max(0, attr.reputation - 30)
          attr.studentLoyalty = -1 as any
          set({ students: remaining, character: { ...store.character, attributes: attr } })
          window.dispatchEvent(new CustomEvent('special-incident', { detail: { title: '学生退学', message: `${stu.name} 因遭受殴打并忠诚度归零，已退学。你的口碑显著下降。` } }))
        } else {
          const updated = store.students.map(s => s.id === studentId ? { ...s, loyalty: newLoyalty } : s)
          set({ students: updated })
        }
        // 可能触发举报特殊事件
        if (kind !== 'verbal' && Math.random() < 0.4) {
          set({ incidentQueue: [...get().incidentQueue, { id: 'incident_assault_report', dueYear: store.currentYear + 1 }] })
        }
        const loy = stu.loyalty
        const roll = Math.random()
        let reaction = '默不作声'
        if (kind === 'verbal') {
          reaction = roll < 0.6 ? '生气' : '默不作声'
        } else {
          if (roll < 0.2) reaction = '反击'
          else if (roll < 0.3) reaction = '奇怪的表情'
          else if (roll < 0.6) reaction = '生气'
          else reaction = '默不作声'
        }
        if (reaction === '反击') {
          set({ hospital: true })
          window.dispatchEvent(new CustomEvent('knockout', { detail: { name: stu.name } }))
        } else {
          if (reaction === '奇怪的表情' && kind !== 'verbal') set({ smileThreatYear: store.currentYear + 1 })
          window.dispatchEvent(new CustomEvent('student-feedback', { detail: { name: stu.name, kind, skillId, reaction, loss } }))
        }
      },

      grantFundingToStudent: (studentId: string) => {
        const store = get()
        if (store.character.attributes.funding < 2) {
          window.dispatchEvent(new CustomEvent('game-message', { detail: '经费不足' }))
          return
        }
        const updatedStudents = store.students.map(s => s.id === studentId ? { ...s, loyalty: Math.min(100, s.loyalty + 10) } : s)
        set({ students: updatedStudents, character: { ...store.character, attributes: { ...store.character.attributes, funding: store.character.attributes.funding - 2 } } })
        window.dispatchEvent(new CustomEvent('game-message', { detail: '已发经费：忠诚度+10，经费-2' }))
      }
    })
);
