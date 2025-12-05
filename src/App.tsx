import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useGameStore } from './store/gameStore'
import { useEffect, useState } from 'react'
import punchVideo from './source/punch.mp4'
import smileImg from './source/smile.png'

function App() {
  const { gameOver, character, currentYear, lastYearActions, onboarded } = useGameStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [msgQueue, setMsgQueue] = useState<string[]>([])
  const [milestoneToast, setMilestoneToast] = useState<{ year: number; next?: number } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [studentFeedback, setStudentFeedback] = useState<any | null>(null)
  const [specialIncident, setSpecialIncident] = useState<any | null>(null)
  const [showPunchVideo, setShowPunchVideo] = useState(false)
  const [knockout, setKnockout] = useState<any | null>(null)

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

  useEffect(() => {
    const handler = (e: any) => {
      const detail = e.detail || {}
      const isPhysical = detail.kind === 'physical'
      setStudentFeedback({ ...detail })
      if (isPhysical) setShowPunchVideo(true)
    }
    window.addEventListener('student-feedback', handler as any)
    return () => window.removeEventListener('student-feedback', handler as any)
  }, [])

  useEffect(() => {
    const handler = (e: any) => setSpecialIncident(e.detail)
    window.addEventListener('special-incident', handler as any)
    return () => window.removeEventListener('special-incident', handler as any)
  }, [])

  useEffect(() => {
    const handler = (e: any) => {
      setKnockout(e.detail)
      setShowPunchVideo(true)
    }
    window.addEventListener('knockout', handler as any)
    return () => window.removeEventListener('knockout', handler as any)
  }, [])

  const canProceedToNextYear = () => {
    // 如果处于医院状态，可以强制进入下一年
    if ((useGameStore.getState() as any).hospital) return true
    return lastYearActions.eventSelected && lastYearActions.purchaseMade && lastYearActions.projectApplied
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-3">
              <button
                aria-label="菜单"
                className="flex md:hidden items-center justify-center w-10 h-10 rounded-md border border-gray-200 text-gray-700"
                onClick={() => setMenuOpen(o => !o)}
              >
                ☰
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">校园导师模拟器</h1>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex gap-3">
                <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">主界面</Link>
                <Link to="/students" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">学生管理</Link>
                <Link to="/projects" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">项目申请</Link>
                <Link to="/equipment" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">购买装备</Link>
                <Link to="/assessment" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">晋升考核</Link>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600"><span className="font-medium">第{currentYear}年</span></div>
                <div className="text-sm text-gray-600"><span className="font-medium">{character.title}</span></div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${canProceedToNextYear() ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{canProceedToNextYear() ? '可进入下一年' : '待完成本年度任务'}</span>
                </div>
              </div>
            </div>
          </div>
          {menuOpen && (
            <div className="md:hidden border-t border-gray-200 py-2">
              <div className="flex flex-col gap-2">
                <Link to="/" className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded">主界面</Link>
                <Link to="/students" className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded">学生管理</Link>
                <Link to="/projects" className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded">项目申请</Link>
                <Link to="/equipment" className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded">购买装备</Link>
                <Link to="/assessment" className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded">晋升考核</Link>
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="text-sm text-gray-600"><span className="font-medium">第{currentYear}年</span></div>
                  <div className="text-sm text-gray-600"><span className="font-medium">{character.title}</span></div>
                  <div className="text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${canProceedToNextYear() ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{canProceedToNextYear() ? '可进入下一年' : '待完成本年度任务'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
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

      {studentFeedback && (!showPunchVideo || studentFeedback.kind !== 'physical') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 px-8 py-6 text-center text-white">
              <div className="text-6xl mb-3">⚡</div>
              <h3 className="text-2xl font-bold mb-1">学生反馈</h3>
              <p className="opacity-90">{studentFeedback.name}</p>
            </div>
            <div className="p-6 space-y-3">
              <div className="text-gray-800">类型：{studentFeedback.kind === 'verbal' ? '言语攻击' : studentFeedback.kind === 'physical' ? '殴打' : `特殊攻击（${studentFeedback.skillId}）`}</div>
              <div className="text-gray-800">反应：{studentFeedback.reaction === '奇怪的表情' ? '学生露出了奇怪的表情' : studentFeedback.reaction}</div>
              <div className="text-gray-800">忠诚度损失：{studentFeedback.loss}</div>
              {studentFeedback.reaction === '奇怪的表情' && (
                <div className="mt-2 flex justify-center">
                  <img src={smileImg} alt="奇怪的微笑" className="rounded shadow max-w-[160px] h-auto" />
                </div>
              )}
              <div className="text-right pt-2">
                <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={() => setStudentFeedback(null)}>关闭</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {specialIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-[pulse_1.2s_ease_in_out]">
            <div className="bg-gradient-to-r from-black to-red-700 px-8 py-6 text-center text-white">
              <div className="text-6xl mb-3">⚠️</div>
              <h3 className="text-2xl font-bold mb-1">{specialIncident.title}</h3>
              <p className="opacity-90">特殊事件</p>
            </div>
            <div className="p-6 space-y-3">
              <div className="text-gray-800 whitespace-pre-line">{specialIncident.message}</div>
              <div className="text-right pt-2">
                <button className="px-4 py-2 bg-gray-900 text-white rounded" onClick={() => setSpecialIncident(null)}>我知道了</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {knockout && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-8 py-6 text-center text-white">
              <div className="text-6xl mb-3">💥</div>
              <h3 className="text-2xl font-bold mb-1">学生反击</h3>
              <p className="opacity-90">你被学生反击了！</p>
            </div>
            <div className="p-6 space-y-3">
              <div className="text-gray-800 text-center">
                {knockout.name} 对你的攻击进行了反击！你倒地住院一周，期间无法推进年度事务。
              </div>
              <div className="text-gray-600 text-sm text-center">
                下一年将会自动进入养病状态，暂时无法进行任何活动。
              </div>
              <div className="text-right pt-2">
                <button className="px-4 py-2 bg-orange-600 text-white rounded" onClick={() => {
                  setKnockout(null)
                  useGameStore.getState().nextYear()
                }}>我知道了</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPunchVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="w-[90vw] max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            <video src={punchVideo} autoPlay muted playsInline className="w-full h-full object-cover" onEnded={() => {
              setShowPunchVideo(false)
            }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
