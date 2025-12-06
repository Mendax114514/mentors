import { useGameStore } from '../store/gameStore'
import { useState } from 'react'
import { studentStatuses } from '../data/studentStatus'
import { guidanceByState } from '../data/studentGuidance'

function StudentManagement() {
  const { students, currentYear, selectEvent, lastYearActions, eventHistory, guideStudent, attackStudent, grantFundingToStudent, attackSkills } = useGameStore()
  const statusName = (tag?: string) => (studentStatuses.find(s => s.id === tag)?.name) || '无状态'
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [guideOpen, setGuideOpen] = useState<string | null>(null)
  const [attackOpen, setAttackOpen] = useState<string | null>(null)

  const getStudentTypeText = (type: string) => {
    switch (type) {
      case 'master': return '硕士生'
      case 'phd': return '博士生'
      default: return '学生'
    }
  }

  const getStudentProgress = (student: any) => {
    const yearsInProgram = currentYear - student.joinYear
    return Math.min((yearsInProgram / student.graduationYear) * 100, 100)
  }

  const handleEventSelection = (eventId: string) => {
    if (lastYearActions.eventSelected) {
      alert('您今年已经选择了事件，不能重复选择')
      return
    }
    setSelectedEvent(eventId)
  }

  const confirmEventSelection = () => {
    if (selectedEvent) {
      selectEvent(selectedEvent)
      setSelectedEvent(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">学生管理系统</h1>
        <p className="text-lg text-gray-600">管理您的学生团队，选择年度学术事件</p>
      </div>

      {/* 学生统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="game-card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{students.length}</div>
          <div className="text-sm text-gray-600">总学生数</div>
        </div>
        <div className="game-card p-6 text-center">
          <div className="text-3xl font-bold text-green-600">
            {students.filter(s => s.type === 'master').length}
          </div>
          <div className="text-sm text-gray-600">硕士生</div>
        </div>
        <div className="game-card p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">
            {students.filter(s => s.type === 'phd').length}
          </div>
          <div className="text-sm text-gray-600">博士生</div>
        </div>
        <div className="game-card p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">
            {students.filter(s => currentYear - s.joinYear >= s.graduationYear).length}
          </div>
          <div className="text-sm text-gray-600">毕业班学生</div>
        </div>
      </div>

      {/* 学生列表 */}
      <div className="game-card p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">学生详情</h2>
        <div className="mb-4 text-xs text-blue-700">提示：每位学生每年仅可指导一次</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map(student => (
            <div key={student.id} className="student-card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{student.name}</h3>
                  <p className="text-sm text-gray-600">{getStudentTypeText(student.type)}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">第{currentYear - student.joinYear + 1}年</div>
                  <div className="text-xs text-gray-400">共{student.graduationYear}年</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">忠诚度</span>
                  <span className="font-medium">{student.loyalty.toFixed(1)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${student.loyalty}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">工作效率</span>
                  <span className="font-medium">{(student.workEfficiency * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${student.workEfficiency * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">潜力值</span>
                  <span className="font-medium">{student.potential}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${student.potential}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">学业进度</span>
                  <span className="font-medium">{getStudentProgress(student).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${getStudentProgress(student)}%` }}
                  ></div>
                </div>
              </div>

              {/* 学生状态标签 */}
              <div className="mt-2 flex flex-wrap gap-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusName((student as any).stateTag) === '正常' ? 'bg-gray-100 text-gray-800' :
                  statusName((student as any).stateTag) === '抑郁症' ? 'bg-red-100 text-red-800' :
                  statusName((student as any).stateTag) === '恋爱' ? 'bg-pink-100 text-pink-800' :
                  statusName((student as any).stateTag) === '焦虑' ? 'bg-orange-100 text-orange-800' :
                  statusName((student as any).stateTag) === '倦怠' ? 'bg-gray-100 text-gray-800' :
                  'motivated' === (student as any).stateTag ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {statusName((student as any).stateTag) || '正常'}
                </div>
                {currentYear - student.joinYear >= student.graduationYear && (
                  <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    🎓 即将毕业
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm" onClick={() => setGuideOpen(guideOpen === student.id ? null : student.id)}>指导</button>
                <button className="px-3 py-2 bg-red-600 text-white rounded text-sm" onClick={() => setAttackOpen(attackOpen === student.id ? null : student.id)}>攻击</button>
                <button className="px-3 py-2 bg-green-600 text-white rounded text-sm" onClick={() => grantFundingToStudent(student.id)}>发经费</button>
              </div>

              {guideOpen === student.id && (
                <div className="mt-3 p-3 border rounded">
                  <div className="text-sm mb-2">状态：{statusName((student as any).stateTag)}，选择指导方案</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(() => {
                      const tasks = guidanceByState[(student as any).stateTag || 'motivated'] || []
                      return tasks.map((t: any) => (
                        <div key={t.id} className="p-2 border rounded">
                          <div className="text-sm font-medium mb-1">{t.title}</div>
                          <div className="flex flex-wrap gap-2">
                            {t.options.map((o: any) => (
                              <button key={o.id} className="px-2 py-1 bg-blue-500 text-white rounded text-xs" onClick={() => { guideStudent(student.id, t.id, o.id); setGuideOpen(null) }}>{o.text}</button>
                            ))}
                          </div>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
              )}

              {attackOpen === student.id && (
                <div className="mt-3 p-3 border rounded">
                  <div className="text-sm mb-2">选择攻击方式</div>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-2 py-1 bg-orange-500 text-white rounded text-xs" onClick={() => { attackStudent(student.id, 'verbal'); setAttackOpen(null) }}>言语攻击（损失减半）</button>
                    <button className="px-2 py-1 bg-red-600 text-white rounded text-xs" onClick={() => { attackStudent(student.id, 'physical'); setAttackOpen(null) }}>殴打（正常损失）</button>
                    {attackSkills && attackSkills.length > 0 && attackSkills.map((sk: string) => (
                      <button key={sk} className="px-2 py-1 bg-purple-600 text-white rounded text-xs" onClick={() => { attackStudent(student.id, 'special', sk); setAttackOpen(null) }}>{sk}</button>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">言语攻击造成的忠诚度损失为正常的一半；殴打为正常损失</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 事件选择（备用入口） */}
      <div className="game-card p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">事件</h2>
        
        {lastYearActions.eventSelected ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">您已完成今年的学术事件选择</h3>
            <p className="text-gray-600">请前往其他页面完成剩余任务</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">事件通过主界面自动弹出，此处为备用入口：</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'event_1',
                  title: '指导学生研究',
                  description: '花更多时间指导学生的研究工作，提升学生忠诚度和学术分数',
                  icon: '🎓'
                },
                {
                  id: 'event_2', 
                  title: '发表学术论文',
                  description: '专注于撰写和发表高质量的学术论文，提升学术声誉',
                  icon: '📄'
                },
                {
                  id: 'event_3',
                  title: '参加学术会议',
                  description: '参加重要的学术会议，扩大学术影响力，获得声誉',
                  icon: '🏛️'
                },
                {
                  id: 'event_4',
                  title: '申请研究经费',
                  description: '积极申请各类研究经费，为实验室争取更多资金支持',
                  icon: '💰'
                }
              ].map(event => (
                <div 
                  key={event.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedEvent === event.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleEventSelection(event.id)}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{event.icon}</span>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
              ))}
            </div>
            
            {selectedEvent && (
              <div className="mt-6 text-center">
                <button
                  onClick={confirmEventSelection}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  确认选择此事件
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 事件回溯 */}
      <div className="game-card p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">事件回溯</h2>
        {eventHistory.length === 0 ? (
          <div className="text-sm text-gray-600">暂无历史事件</div>
        ) : (
          <div className="space-y-3">
            {eventHistory.map((h, idx) => (
              <div key={idx} className="p-3 border rounded">
                <div className="text-sm text-gray-600">第{h.year}年</div>
                <div className="font-medium">结果：{h.message || '（无说明）'}</div>
                <div className="text-xs text-gray-600 mt-1">变化：
                  {Object.entries(h.changes).map(([k,v]) => (
                    <span key={k} className="mr-2">{k === 'academicScore' ? '学术分' : k === 'funding' ? '经费' : k === 'reputation' ? '声望' : '学生爱戴'}{v! >= 0 ? '+' : ''}{v}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 操作提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">💡 操作提示</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 学生的忠诚度会影响他们的工作效率和毕业时的贡献</li>
          <li>• 每年只能选择一个学术事件，请谨慎选择</li>
          <li>• 即将毕业的学生会为您提供额外的学术分数和声誉奖励</li>
          <li>• 定期关注学生的进度，适时调整指导策略</li>
        </ul>
      </div>
    </div>
  )
}

export default StudentManagement
