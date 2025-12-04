import { useGameStore } from '../store/gameStore'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { events } from '../data/events'

function MainGame() {
  const { 
    character, 
    currentYear, 
    students, 
    activeProjects, 
    lastYearActions,
    purchasedEquipment,
    nextYear,
    selectEvent,
    startNewGame
  } = useGameStore()
  const canProceedToNextYear = lastYearActions.eventSelected

  const [modalEventId, setModalEventId] = useState<string | null>(null)
  const modalEvent = useMemo(() => events.find(e => e.id === modalEventId), [modalEventId])

  useEffect(() => {
    if (!lastYearActions.eventSelected && !modalEventId) {
      const store = useGameStore.getState()
      const due = store.scheduledEvents.find(se => se.dueYear === store.currentYear)
      if (due) {
        setModalEventId(due.id)
        useGameStore.setState(s => ({ scheduledEvents: s.scheduledEvents.filter(se => se !== due) }))
        return
      }
      const q = store.pendingEvents
      if (q.length) {
        setModalEventId(q[0])
      } else {
        const r = Math.floor(Math.random() * events.length)
        setModalEventId(events[r].id)
      }
    }
  }, [lastYearActions.eventSelected, modalEventId])
  
  const navigate = useNavigate()

  useEffect(() => {
    // 初始化游戏
    if (currentYear === 1 && students.length === 0) {
      startNewGame()
    }
  }, [])

  const handleNextYear = () => {
    if (canProceedToNextYear) {
      nextYear()
    } else {
      alert('请完成本年度的所有任务：选择事件、购买物品、申请项目')
    }
  }

  const getAttributeColor = (value: number) => {
    if (value >= 80) return 'text-green-600'
    if (value >= 60) return 'text-yellow-600'
    if (value >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getAttributeProgress = (value: number) => {
    return Math.min((value / 100) * 100, 100)
  }

  const projected = useMemo(() => {
    const store = useGameStore.getState()
    const studentsCount = students.length
    const eff = store.studentWorkEfficiency
    const exploit = store.hiddenAttributes.exploitEfficiency
    const satisfy = store.hiddenAttributes.studentSatisfaction
    const network = store.hiddenAttributes.networkingPower

    let perStudentAcademic = 0
    let perStudentFunding = 0
    let perStudentReputation = 0
    for (const stu of students as any[]) {
      let we = stu.workEfficiency ?? 0.8
      let pot = (stu.potential ?? 70) / 100
      const loy = (stu.loyalty ?? 70) / 100
      if (stu.smart) pot += 0.2; else pot -= 0.1
      if (stu.diligent) we += 0.2; else we -= 0.1
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
    const loyaltyRateBase = (store.hiddenAttributes.loyaltyRateBonus || 0) + ((satisfy - 1) * 1)
    const a = Math.max(-2, Math.round(loyaltyRateBase + loyaltyRateBonusEquip))
    const b = studentsCount
    let loyalty = a * b

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

    return { academic, funding, reputation, loyalty }
  }, [students, purchasedEquipment, character.attributes, activeProjects])

  return (
    <>
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">校园导师模拟器</h1>
        <p className="text-lg text-gray-600">体验真实的学术生涯，培养优秀学生，完成科研项目</p>
      </div>

      {/* 角色状态卡片 */}
      <div className="game-card p-6 fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{character.name}</h2>
            <p className="text-lg text-gray-600">{character.title} · 第{currentYear}年</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">学生数量</div>
            <div className="text-2xl font-bold text-blue-600">{students.length}</div>
          </div>
        </div>

        {/* 属性显示 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getAttributeColor(character.attributes.academicScore)}`}>
              {character.attributes.academicScore}
            </div>
            <div className="text-sm text-gray-600">学术分数</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${getAttributeProgress(character.attributes.academicScore)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">本年预计：{projected.academic >= 0 ? '+' : ''}{projected.academic}</div>
        </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${getAttributeColor(character.attributes.funding)}`}>
              {character.attributes.funding}
            </div>
            <div className="text-sm text-gray-600">科研经费</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${getAttributeProgress(character.attributes.funding)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">本年预计：{projected.funding >= 0 ? '+' : ''}{projected.funding}</div>
        </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${getAttributeColor(character.attributes.reputation)}`}>
              {character.attributes.reputation}
            </div>
            <div className="text-sm text-gray-600">学术声誉</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${getAttributeProgress(character.attributes.reputation)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">本年预计：{projected.reputation >= 0 ? '+' : ''}{projected.reputation}</div>
        </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${getAttributeColor(character.attributes.studentLoyalty)}`}>
              {character.attributes.studentLoyalty}
            </div>
            <div className="text-sm text-gray-600">学生忠诚度</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${getAttributeProgress(character.attributes.studentLoyalty)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">本年预计：{projected.loyalty >= 0 ? '+' : ''}{projected.loyalty}</div>
        </div>
        </div>
      </div>

      {/* 年度任务状态 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="game-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 事件</h3>
          <div className={`p-4 rounded-lg ${
            lastYearActions.eventSelected 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <div className="text-sm font-medium mb-2">
              {lastYearActions.eventSelected ? '✅ 已完成' : '⏳ 待处理'}
            </div>
            <p className="text-sm">
              {lastYearActions.eventSelected 
                ? '您已经完成今年的事件' 
                : '参与本年事件以推进进度'
              }
            </p>
          </div>
          <button 
            onClick={() => navigate('/students')}
            className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            查看事件
          </button>
        </div>

        <div className="game-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🛒 购买装备</h3>
          <div className={`p-4 rounded-lg ${
            lastYearActions.purchaseMade 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-orange-50 text-orange-800 border border-orange-200'
          }`}>
            <div className="text-sm font-medium mb-2">
              {lastYearActions.purchaseMade ? '✅ 已完成' : '⏳ 待购买'}
            </div>
            <p className="text-sm">
              {lastYearActions.purchaseMade 
                ? '您已经购买了今年的装备' 
                : '购买装备来提升学生效率'
              }
            </p>
          </div>
          <button 
            onClick={() => navigate('/equipment')}
            className="w-full mt-4 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
          >
            购买装备
          </button>
        </div>

        <div className="game-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔬 项目申请</h3>
          <div className={`p-4 rounded-lg ${
            lastYearActions.projectApplied 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-purple-50 text-purple-800 border border-purple-200'
          }`}>
            <div className="text-sm font-medium mb-2">
              {lastYearActions.projectApplied ? '✅ 已完成' : '⏳ 待申请'}
            </div>
            <p className="text-sm">
              {lastYearActions.projectApplied 
                ? '您已经申请了今年的科研项目' 
                : '申请科研项目来获得资金和声誉'
              }
            </p>
          </div>
          <button 
            onClick={() => activeProjects.length === 0 && navigate('/projects')}
            disabled={activeProjects.length > 0}
            className={`w-full mt-4 py-2 px-4 rounded-md transition-colors ${activeProjects.length > 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
          >
            申请项目
          </button>
        </div>
      </div>

      {/* 当前项目状态 */}
      {activeProjects.length > 0 && (
        <div className="game-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 进行中的项目</h3>
          {activeProjects.map(project => (
            <div key={project.id} className="project-card mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{project.name}</h4>
                  <p className="text-sm opacity-90">{project.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm">进度: {project.progress}/{project.duration}年</div>
                  <div className="w-24 bg-white bg-opacity-30 rounded-full h-2 mt-1">
                    <div 
                      className="bg-white h-2 rounded-full" 
                      style={{ width: `${(project.progress / project.duration) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 下一年按钮 */}
      <div className="text-center">
        <button
          onClick={handleNextYear}
          disabled={!canProceedToNextYear}
          className={`px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 ${
            canProceedToNextYear
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          🚀 进入下一年
        </button>
        {!canProceedToNextYear && (
          <p className="text-sm text-gray-500 mt-2">
            请先完成本年度的所有任务
          </p>
        )}
      </div>

      {/* 已拥有的非消耗装备 */}
      {purchasedEquipment.filter(e => e.type !== 'consumable').length > 0 && (
        <div className="game-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 已拥有的设备</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchasedEquipment.filter(e => e.type !== 'consumable').map(item => (
              <div key={item.id} className="p-4 border rounded">
                <div className="font-semibold text-gray-900 mb-1">{item.name}</div>
                <div className="text-sm text-gray-600 mb-1">{item.description}</div>
                <div className="text-xs text-gray-500">
                  {item.effects.studentWorkEfficiency && (
                    <div>工作效率 +{(item.effects.studentWorkEfficiency * 100).toFixed(0)}%</div>
                  )}
                  {item.effects.studentLoyalty && (
                    <div>忠诚度 +{(item.effects.studentLoyalty * 100).toFixed(0)}%</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    {/* 事件弹窗 */}
    {modalEvent && !lastYearActions.eventSelected && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-xl w-full">
          <h3 className="text-xl font-semibold mb-2">{modalEvent.title}</h3>
          <p className="text-sm text-gray-600 mb-4">{modalEvent.description}</p>
          <div className="space-y-3">
            {modalEvent.options.map(opt => (
              <button key={opt.id} className="w-full text-left p-3 border rounded hover:bg-gray-50"
                onClick={() => {
                  selectEvent(modalEvent.id)
                  useGameStore.getState().selectEventOption(modalEvent.id, opt.id)
                  setModalEventId(null)
                }}
              >
                <div className="font-medium">{opt.text}</div>
                {opt.attributeCost && (
                  <div className="text-xs text-gray-500 mt-1">
                    代价：{
                      Object.keys(opt.attributeCost).map(k => (
                        k === 'funding' ? '经费' : k === 'academicScore' ? '学术分' : k === 'studentLoyalty' ? '学生爱戴' : '属性'
                      )).join('、')
                    }
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    )}
  </>
  )
}

export default MainGame
