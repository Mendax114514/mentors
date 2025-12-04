import { useGameStore } from '../store/gameStore'
// 使用加权评估替代逐项达标

function EvaluationSystem() {
  const { 
    character, 
    currentYear, 
    evaluationYear
  } = useGameStore()

  const yearsUntilEvaluation = evaluationYear - currentYear
  const weights = { academicScore: 0.5, funding: 0, reputation: 0.3, studentLoyalty: 0.2 }
  const thresholds: Record<number, number> = { 5: 60, 10: 120, 20: 240, 30: 360, 40: 480 }
  const score = character.attributes.academicScore * weights.academicScore
    + character.attributes.funding * weights.funding
    + character.attributes.reputation * weights.reputation
    + character.attributes.studentLoyalty * weights.studentLoyalty
  const currentThreshold = thresholds[evaluationYear] ?? 0
  const canPassEvaluation = score >= currentThreshold

  const getAttributeProgress = (current: number, required: number) => {
    return Math.min((current / required) * 100, 100)
  }

  const getProgressColor = (current: number, required: number) => {
    const progress = getAttributeProgress(current, required)
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 80) return 'bg-yellow-500'
    if (progress >= 60) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">晋升考核</h1>
        <p className="text-lg text-gray-600">了解您的评估进度，为晋升做好准备</p>
      </div>

      {/* 评估状态总览 */}
      <div className="game-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">当前职称：{character.title}</h2>
            <p className="text-gray-600">第{currentYear}年 · 下次评估：第{evaluationYear}年</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${
              yearsUntilEvaluation <= 1 ? 'text-red-600' : 
              yearsUntilEvaluation <= 2 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {yearsUntilEvaluation}
            </div>
            <div className="text-sm text-gray-600">年后评估</div>
          </div>
        </div>

        {/* 评估结果提示 */}
        {yearsUntilEvaluation <= 0 ? (
          <div className={`p-4 rounded-lg mb-6 ${
            canPassEvaluation 
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center">
              <div className="text-2xl mr-3">
                {canPassEvaluation ? '🎉' : '⚠️'}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{canPassEvaluation ? '评估通过' : '评估未通过'}</h3>
                <p className="text-sm">
                  {canPassEvaluation 
                    ? '已达到加权分阈值，可继续晋升'
                    : '未达到加权分阈值，需要继续提升属性'
                  }
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className={`p-4 rounded-lg mb-6 ${
            canPassEvaluation 
              ? 'bg-green-100 text-green-800 border border-green-200'
              : yearsUntilEvaluation <= 1
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
          }`}>
            <div className="flex items-center">
              <div className="text-2xl mr-3">
                {canPassEvaluation ? '✅' : yearsUntilEvaluation <= 1 ? '⚠️' : '⏳'}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {canPassEvaluation 
                    ? '您已达到评估要求'
                    : yearsUntilEvaluation <= 1 
                    ? '评估临近，需要加把劲！'
                    : '距离评估还有时间，继续努力'
                  }
                </h3>
                <p className="text-sm">
                  {canPassEvaluation 
                    ? '您已经满足当前职称的评估要求，可以安心等待评估。'
                    : '您还需要提升各项属性以达到评估标准。'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 加权分对比 */}
      <div className="game-card p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">加权评估分</h2>
        <div className="flex items-center justify-between">
          <div className="text-xl">
            当前分：<span className={`${canPassEvaluation ? 'text-green-600' : 'text-red-600'} font-bold`}>{score.toFixed(1)}</span>
          </div>
          <div className="text-xl">
            阈值：<span className="font-bold text-gray-700">{currentThreshold}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
          <div className={`h-3 rounded-full ${canPassEvaluation ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${currentThreshold ? Math.min((score / currentThreshold) * 100, 100) : 0}%` }}></div>
        </div>
        <div className="mt-4 text-sm text-gray-600">公式：学术分×0.5 + 声望×0.3 + 学生爱戴×0.2</div>
      </div>

      {/* 晋升说明 */}
      <div className="game-card p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">晋升说明</h2>
        <p className="text-sm text-gray-600">当前系统采用加权分评估，达到对应年份的阈值后触发晋升。未通过第5年评估将触发非升即走。</p>
      </div>

      {/* 建议与提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-3">💡 评估建议</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-medium mb-2">短期目标（1-2年）：</h4>
            <ul className="space-y-1">
              {yearsUntilEvaluation <= 2 && !canPassEvaluation && (
                <>
                  <li>• 优先提升未达标的属性</li>
                  <li>• 申请能够快速提升属性的项目</li>
                  <li>• 购买能够提升学生效率的装备</li>
                </>
              )}
              {canPassEvaluation && (
                <>
                  <li>• 保持当前属性水平</li>
                  <li>• 为下一阶段晋升做准备</li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">长期规划：</h4>
            <ul className="space-y-1">
              <li>• 平衡发展各项属性</li>
              <li>• 建立稳定的学生团队</li>
              <li>• 持续申请高质量项目</li>
              <li>• 合理分配资源和时间</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EvaluationSystem
