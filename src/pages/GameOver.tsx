import { useGameStore } from '../store/gameStore'
import { endings } from '../data/endings'
import { events } from '../data/events'
import { useNavigate } from 'react-router-dom'

function GameOver() {
  const { gameOverReason, gameOverTier, character, currentYear, startNewGame, eventHistory } = useGameStore()
  const navigate = useNavigate()

  const handleRestart = () => {
    startNewGame()
    navigate('/')
  }

  const tier = gameOverTier ?? (() => {
    const found = endings.find(e => e.name === gameOverReason)
    return found?.tier ?? (gameOverReason === '非升即走' ? 'normal' : 'normal')
  })()
  const getGameOverTitle = () => {
    if (gameOverReason === '非升即走') return '非升即走'
    return tier === 'legendary' ? '传奇结局' : tier === 'hidden' ? '隐藏结局' : '游戏结束'
  }

  const getGameOverMessage = () => {
    if (gameOverReason === '非升即走') {
      return '很遗憾，您未能在规定时间内达到评估要求。在学术界的激烈竞争中，您需要重新规划自己的职业道路。'
    }
    return gameOverReason
  }

  const getGameOverIcon = () => {
    if (gameOverReason === '非升即走') return '📚'
    return tier === 'legendary' ? '🏆' : tier === 'hidden' ? '🌀' : '🎮'
  }

  const eventNameMap = new Map(events.map(e => [e.id, (e as any).title]))
  const chainRule = tier === 'hidden' ? endings.find(e => e.name === gameOverReason) : undefined
  const chainIds = new Set(chainRule?.sequence || [])
  const seqOpts = chainRule?.sequenceOptions || {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* 游戏结束卡片 */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* 顶部装饰 */}
          <div className={`px-8 py-6 text-center ${tier === 'legendary' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : tier === 'hidden' ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
            <div className="text-6xl mb-4">{getGameOverIcon()}</div>
            <h1 className="text-3xl font-bold text-white mb-2">{getGameOverTitle()}</h1>
            <p className="text-red-100">第{currentYear}年 · {character.title}</p>
          </div>

          {/* 主要内容 */}
          <div className="p-8">
            {/* 结束原因 */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{gameOverReason === '非升即走' ? '😔' : '🎉'}</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {typeof gameOverReason === 'string' ? getGameOverMessage() : String(gameOverReason)}
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">{typeof gameOverReason === 'string' ? gameOverReason : String(gameOverReason)}</p>
              </div>
            </div>

            {/* 最终统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{character.attributes.academicScore}</div>
                <div className="text-sm text-blue-600">学术分数</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{character.attributes.funding}</div>
                <div className="text-sm text-green-600">科研经费</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{character.attributes.reputation}</div>
                <div className="text-sm text-purple-600">学术声誉</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{character.attributes.studentLoyalty}</div>
                <div className="text-sm text-orange-600">学生忠诚度</div>
              </div>
            </div>

          {/* 游戏总结 */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-3">游戏总结</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>游戏时长：</span>
                <span>第{currentYear}年</span>
              </div>
              <div className="flex justify-between">
                <span>最终职称：</span>
                <span>{character.title}</span>
              </div>
              <div className="flex justify-between">
                <span>学术成就：</span>
                <span>
                  {character.attributes.academicScore >= 90 ? '杰出学者' :
                   character.attributes.academicScore >= 70 ? '优秀学者' :
                   character.attributes.academicScore >= 50 ? '合格学者' : '初级学者'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-3">事件回顾</h3>
            {eventHistory.length === 0 ? (
              <div className="text-sm text-gray-500">本局暂无事件记录</div>
            ) : (
              <div className="space-y-2">
                {eventHistory.map((h, i) => {
                  const isChain = chainIds.has(h.eventId)
                  const correct = seqOpts[h.eventId] ? seqOpts[h.eventId] === h.optionId : false
                  const base = 'p-3 rounded-lg border'
                  const cls = correct ? `${base} border-yellow-500 bg-yellow-50` : isChain ? `${base} border-purple-500 bg-purple-50` : `${base} border-gray-200 bg-gray-50`
                  const nm = eventNameMap.get(h.eventId) || h.eventId
                  return (
                    <div key={`${h.eventId}-${i}`} className={cls}>
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-800">第{h.year}年 · {nm}</div>
                        <div className="flex items-center gap-2 text-xs">
                          {isChain && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">隐藏链条</span>}
                          {correct && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">正确选项</span>}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 whitespace-pre-line">{h.message}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRestart}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                🔄 重新开始
              </button>
              <button
                onClick={() => navigate('/assessment')}
                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                📊 查看详情
              </button>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            学术之路充满挑战，每一次失败都是成功的垫脚石。继续努力，您一定能达到学术巅峰！
          </p>
        </div>
      </div>
    </div>
  )
}

export default GameOver
