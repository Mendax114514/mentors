import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useGameStore } from './store/gameStore'
import { useEffect, useState } from 'react'

function App() {
  const { gameOver, character, currentYear, lastYearActions, onboarded } = useGameStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [msgQueue, setMsgQueue] = useState<string[]>([])
  const [milestoneToast, setMilestoneToast] = useState<{ year: number; next?: number } | null>(null)

  useEffect(() => {
    if (gameOver && location.pathname !== '/game-over' && location.pathname !== '/assessment') {
      navigate('/game-over')
    }
  }, [gameOver, navigate, location.pathname])

  useEffect(() => {
    // 首次进入引导到Onboarding
    if (!onboarded && location.pathname !== '/onboarding') {
      navigate('/onboarding')
    }
  }, [onboarded, location.pathname, navigate])

  useEffect(() => {
    const handler = (e: any) => setMsgQueue(q => [...q, e.detail])
    window.addEventListener('game-message', handler as any)
    return () => window.removeEventListener('game-message', handler as any)
  }, [])

  useEffect(() => {
    const handler = (e: any) => setMilestoneToast(e.detail)
    window.addEventListener('milestone-toast', handler as any)
    return () => window.removeEventListener('milestone-toast', handler as any)
  }, [])

  const canProceedToNextYear = () => {
    return lastYearActions.eventSelected && lastYearActions.purchaseMade && lastYearActions.projectApplied
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap">
              <h1 className="text-2xl font-bold text-gray-900">校园导师模拟器</h1>
              <div className="flex gap-3 flex-nowrap">
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  主界面
                </Link>
                <Link 
                  to="/students" 
                  className="text-gray-600 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  学生管理
                </Link>
                <Link 
                  to="/projects" 
                  className="text-gray-600 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  项目申请
                </Link>
                <Link 
                  to="/equipment" 
                  className="text-gray-600 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  购买装备
                </Link>
                <Link 
                  to="/assessment" 
                  className="text-gray-600 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  晋升考核
                </Link>
              </div>
            </div>
            
            {/* 状态显示 */}
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600">
                <span className="font-medium">第{currentYear}年</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{character.title}</span>
              </div>
              <div className="text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  canProceedToNextYear() ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {canProceedToNextYear() ? '可进入下一年' : '待完成本年度任务'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto py-4 px-2 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      {msgQueue.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">结果提示</h3>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">{msgQueue[0]}</pre>
            <div className="text-right mt-4">
              <button onClick={() => setMsgQueue(q => q.slice(1))} className="px-4 py-2 bg-blue-600 text-white rounded">知道了</button>
            </div>
          </div>
        </div>
      )}
      {milestoneToast && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-0 max-w-xl w-full overflow-hidden">
            <div className={`${(milestoneToast as any).type === 'pre' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'} px-8 py-6 text-center text-white`}>
              <div className="text-6xl mb-3">{(milestoneToast as any).type === 'pre' ? '⏳' : '🏆'}</div>
              <h3 className="text-3xl font-bold mb-1">{(milestoneToast as any).type === 'pre' ? '考核将至' : '考核通过'}</h3>
              <p className="opacity-90">第{milestoneToast.year}年</p>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center bg-indigo-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-indigo-700">{(milestoneToast as any).score ?? '-'}</div>
                  <div className="text-sm text-indigo-700">当前加权分</div>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-700">{(milestoneToast as any).threshold ?? '-'}</div>
                  <div className="text-sm text-gray-700">考核阈值</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{(milestoneToast as any).type === 'pre' ? `距离考核还有一年，请尽快准备。下一次考核在第${(milestoneToast as any).next}年` : (milestoneToast as any).next ? `下一次考核在第${(milestoneToast as any).next}年` : '任期即将结束，请继续保持优秀表现。'}</p>
              <div className="text-right">
                <button onClick={() => setMilestoneToast(null)} className={`${(milestoneToast as any).type === 'pre' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'} px-5 py-2 text-white font-semibold rounded`}>继续</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
