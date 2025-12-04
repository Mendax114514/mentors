import { useGameStore } from '../store/gameStore'
import { assessmentMilestones, assessmentThresholds, assessmentWeights } from '../data/evaluation'

function Assessment() {
  const { character, currentYear, students, activeProjects, purchasedEquipment, hiddenAttributes, studentWorkEfficiency, assessmentPlan } = useGameStore()
  const nextMilestone = (assessmentPlan ?? assessmentMilestones).find(m => m >= currentYear) ?? (assessmentPlan ?? assessmentMilestones)[(assessmentPlan ?? assessmentMilestones).length - 1]
  const score = character.attributes.academicScore * assessmentWeights.academicScore
    + character.attributes.funding * assessmentWeights.funding
    + character.attributes.reputation * assessmentWeights.reputation
    + character.attributes.studentLoyalty * assessmentWeights.studentLoyalty
  const idxPlan = (assessmentPlan ?? assessmentMilestones).findIndex(m => m === nextMilestone)
  const baseYear = assessmentMilestones[idxPlan] ?? nextMilestone
  const currentThreshold = assessmentThresholds[baseYear] ?? 0

  const projected = (() => {
    const studentsCount = students.length
    const eff = studentWorkEfficiency
    const exploit = hiddenAttributes.exploitEfficiency
    const satisfy = hiddenAttributes.studentSatisfaction
    const network = hiddenAttributes.networkingPower
    let perStudentAcademic = 0
    let perStudentFunding = 0
    let perStudentReputation = 0
    for (const stu of students as any[]) {
      let we = (stu as any).workEfficiency ?? 0.8
      let pot = ((stu as any).potential ?? 70) / 100
      const loy = ((stu as any).loyalty ?? 70) / 100
      if ((stu as any).smart) pot += 0.2; else pot -= 0.1
      if ((stu as any).diligent) we += 0.2; else we -= 0.1
      we = Math.max(0.3, Math.min(1.2, we))
      pot = Math.max(0.3, Math.min(1.2, pot))
      perStudentAcademic += Math.round(we * pot * loy * 1)
      perStudentFunding += Math.round(we * loy * 0.5)
      perStudentReputation += Math.round(pot * 0.3)
    }
    let academic = Math.round((1 + studentsCount * 0.05) * eff * exploit) + perStudentAcademic
    let funding = Math.round(1 + network * 0.5 + character.attributes.reputation * 0.02) + perStudentFunding
    let reputation = Math.round(0.3 + character.attributes.academicScore * 0.01) + perStudentReputation
    const loyaltyRateBonusEquip = purchasedEquipment.reduce((acc, it: any) => acc + ((it.effects?.loyaltyRateBonus) || 0), 0)
    const loyaltyRateBase = (hiddenAttributes.loyaltyRateBonus || 0) + ((satisfy - 1) * 1)
    let loyalty = Math.max(-2, Math.round(loyaltyRateBase + loyaltyRateBonusEquip)) * studentsCount
    if (activeProjects.length > 0) {
      const totals = activeProjects.reduce((acc: any, p: any) => {
        const c = p.consumption || {}
        return {
          academicScore: acc.academicScore + (c.academicScore || 0),
          funding: acc.funding + (c.funding || 0),
          reputation: acc.reputation + (c.reputation || 0),
          studentLoyalty: acc.studentLoyalty + (c.studentLoyalty || 0),
        }
      }, { academicScore: 0, funding: 0, reputation: 0, studentLoyalty: 0 })
      academic = academic - totals.academicScore
      funding = funding - totals.funding
      reputation = reputation - totals.reputation
      loyalty = loyalty - totals.studentLoyalty
    }
    const projectedScore = (character.attributes.academicScore + academic) * assessmentWeights.academicScore
      + (character.attributes.funding + funding) * assessmentWeights.funding
      + (character.attributes.reputation + reputation) * assessmentWeights.reputation
      + Math.min(100, character.attributes.studentLoyalty + loyalty) * assessmentWeights.studentLoyalty
    return { academic, funding, reputation, loyalty, projectedScore }
  })()
  const canPass = projected.projectedScore >= currentThreshold

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">晋升考核</h1>
        <p className="text-lg text-gray-600">第{currentYear}年 · 考核年份：第{nextMilestone}年</p>
      </div>
      <div className="game-card p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">加权分对比</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>当前分：<span className={`font-bold ${score >= currentThreshold ? 'text-green-600' : 'text-red-600'}`}>{score.toFixed(1)}</span></div>
            <div>阈值：<span className="font-bold text-gray-700">{currentThreshold}</span></div>
          </div>
          <div className="flex items-center justify-between">
            <div>预计本年后：<span className={`font-bold ${projected.projectedScore >= currentThreshold ? 'text-green-600' : 'text-red-600'}`}>{projected.projectedScore.toFixed(1)}</span></div>
            <div className="text-xs text-gray-500">增长：学术{projected.academic >= 0 ? '+' : ''}{projected.academic}，经费{projected.funding >= 0 ? '+' : ''}{projected.funding}，声望{projected.reputation >= 0 ? '+' : ''}{projected.reputation}，忠诚{projected.loyalty >= 0 ? '+' : ''}{projected.loyalty}</div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
          <div className={`h-3 rounded-full ${canPass ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${currentThreshold ? Math.min((score / currentThreshold) * 100, 100) : 0}%` }}></div>
        </div>
        <div className="mt-4 text-sm text-gray-600">公式：学术分×0.5 + 声望×0.3 + 学生爱戴×0.2</div>
        <div className="mt-4">
          <h3 className="font-semibold text-gray-900 mb-2">详细分解</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>学术分：{character.attributes.academicScore} × {assessmentWeights.academicScore} = {(character.attributes.academicScore * assessmentWeights.academicScore).toFixed(1)}</div>
            <div>经费：{character.attributes.funding} × {assessmentWeights.funding} = {(character.attributes.funding * assessmentWeights.funding).toFixed(1)}</div>
            <div>声望：{character.attributes.reputation} × {assessmentWeights.reputation} = {(character.attributes.reputation * assessmentWeights.reputation).toFixed(1)}</div>
            <div>学生爱戴：{character.attributes.studentLoyalty} × {assessmentWeights.studentLoyalty} = {(character.attributes.studentLoyalty * assessmentWeights.studentLoyalty).toFixed(1)}</div>
          </div>
        </div>
        <div className="text-right mt-4">
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('game-message', { detail: projected.projectedScore >= currentThreshold ? '考核通过：预计本年增长后达到阈值' : '考核未通过：预计本年增长后仍未达标' }))
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >进行考核</button>
        </div>
      </div>
    </div>
  )
}

export default Assessment
