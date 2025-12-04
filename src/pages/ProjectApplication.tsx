import { useGameStore } from '../store/gameStore'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ProjectApplication() {
  const { 
    availableProjects, 
    character, 
    activeProjects, 
    lastYearActions,
    applyForProject 
  } = useGameStore()
  const navigate = useNavigate()
  
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const checkProjectRequirements = (project: any) => {
    const attributes = character.attributes
    const required = { ...project.requiredAttributes }
    // 去掉学生忠诚度需求
    delete (required as any).studentLoyalty
    return Object.entries(required).every(([key, value]) => (attributes as any)[key] >= value)
  }

  const getMissingRequirements = (project: any) => {
    const attributes = character.attributes
    const required = { ...project.requiredAttributes }
    delete (required as any).studentLoyalty
    const names: Record<string, string> = {
      academicScore: '学术分',
      funding: '经费',
      reputation: '声望',
      studentLoyalty: '学生爱戴',
    }
    const missing: string[] = []
    Object.entries(required).forEach(([key, value]) => {
      if ((attributes as any)[key] < value) {
        missing.push(`${names[key] ?? key}：需要${value}，当前${(attributes as any)[key]}`)
      }
    })
    return missing
  }

  const handleProjectSelection = (projectId: string) => {
    if (lastYearActions.projectApplied) {
      alert('您今年已经申请了项目，不能重复申请')
      return
    }
    if (activeProjects.length > 0) {
      alert('您已经有一个正在进行的项目，请先完成当前项目')
      return
    }
    setSelectedProject(projectId)
  }

  const confirmProjectApplication = () => {
    if (selectedProject) {
      const project = availableProjects.find(p => p.id === selectedProject)
      if (project && checkProjectRequirements(project)) {
        applyForProject(selectedProject)
        setSelectedProject(null)
        navigate('/')
      } else {
        alert('您的属性不满足项目申请要求')
      }
    }
  }

  useEffect(() => {
    if (lastYearActions.projectApplied) {
      navigate('/')
    }
  }, [lastYearActions.projectApplied, navigate])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">科研项目申请</h1>
        <p className="text-lg text-gray-600">申请各类科研项目，提升学术影响力</p>
      </div>

      {/* 当前状态 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="game-card p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{availableProjects.length}</div>
          <div className="text-sm text-gray-600">可申请项目</div>
        </div>
        <div className="game-card p-6 text-center">
          <div className="text-2xl font-bold text-green-600">{activeProjects.length}</div>
          <div className="text-sm text-gray-600">进行中项目</div>
        </div>
        <div className="game-card p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {character.attributes.academicScore}
          </div>
          <div className="text-sm text-gray-600">当前学术分数</div>
        </div>
      </div>

      {/* 申请状态提示 */}
      {lastYearActions.projectApplied ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">✅</div>
            <div>
              <h3 className="font-semibold text-green-800">您已完成今年的项目申请</h3>
              <p className="text-green-700 text-sm">请前往其他页面完成剩余任务</p>
            </div>
          </div>
        </div>
      ) : activeProjects.length > 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">⏳</div>
            <div>
              <h3 className="font-semibold text-yellow-800">您有一个正在进行的项目</h3>
              <p className="text-yellow-700 text-sm">请先完成当前项目，明年再申请新项目</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📋</div>
            <div>
              <h3 className="font-semibold text-blue-800">请选择要申请的项目</h3>
              <p className="text-blue-700 text-sm">仔细查看项目要求和奖励，选择最适合您的项目</p>
            </div>
          </div>
        </div>
      )}

      {/* 项目列表 */}
      <div className="game-card p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">可申请项目</h2>
        <div className="space-y-4">
          {[...availableProjects]
            .sort((a, b) => {
              const aOk = checkProjectRequirements(a)
              const bOk = checkProjectRequirements(b)
              if (aOk !== bOk) return bOk ? 1 : -1
              return a.duration - b.duration
            })
            .map(project => {
            const canApply = checkProjectRequirements(project)
            const isSelected = selectedProject === project.id
            
            return (
              <div 
                key={project.id}
                className={`p-6 border-2 rounded-lg transition-all duration-300 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : canApply && !lastYearActions.projectApplied && activeProjects.length === 0
                    ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (canApply && !lastYearActions.projectApplied && activeProjects.length === 0) {
                    handleProjectSelection(project.id)
                  }
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">{project.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                        {project.difficulty === 'easy' ? '简单' : project.difficulty === 'medium' ? '中等' : '困难'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-500">周期</div>
                    <div className="text-lg font-semibold text-blue-600">{project.duration}年</div>
                  </div>
                </div>

                {/* 申请要求 */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">申请要求：</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${
                        character.attributes.academicScore >= project.requiredAttributes.academicScore
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {project.requiredAttributes.academicScore}
                      </div>
                      <div className="text-sm text-gray-600">学术分数</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${
                        character.attributes.funding >= project.requiredAttributes.funding
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {project.requiredAttributes.funding}
                      </div>
                      <div className="text-sm text-gray-600">科研经费</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${
                        character.attributes.reputation >= project.requiredAttributes.reputation
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {project.requiredAttributes.reputation}
                      </div>
                      <div className="text-sm text-gray-600">学术声誉</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${
                        character.attributes.studentLoyalty >= project.requiredAttributes.studentLoyalty
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {project.requiredAttributes.studentLoyalty}
                      </div>
                      <div className="text-sm text-gray-600">学生忠诚度</div>
                    </div>
                  </div>
                </div>

                {/* 项目奖励 */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">完成奖励：</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">+{project.reward.academicScore}</div>
                      <div className="text-sm text-gray-600">学术分数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">+{project.reward.funding}</div>
                      <div className="text-sm text-gray-600">科研经费</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">+{project.reward.reputation}</div>
                      <div className="text-sm text-gray-600">学术声誉</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-orange-600">+{project.reward.studentLoyalty}</div>
                      <div className="text-sm text-gray-600">学生忠诚度</div>
                    </div>
                  </div>
                </div>

                {/* 年度消耗 */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">年度消耗：</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">-{project.consumption.academicScore}</div>
                      <div className="text-sm text-gray-600">学术分数/年</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">-{project.consumption.funding}</div>
                      <div className="text-sm text-gray-600">科研经费/年</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">-{project.consumption.reputation}</div>
                      <div className="text-sm text-gray-600">学术声誉/年</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">-{project.consumption.studentLoyalty}</div>
                      <div className="text-sm text-gray-600">学生忠诚度/年</div>
                    </div>
                  </div>
                </div>

                {!canApply && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <h5 className="font-semibold text-red-800 mb-1">不满足申请要求：</h5>
                    <ul className="text-sm text-red-700 space-y-1">
                      {getMissingRequirements(project).map((req, index) => (
                        <li key={index}>• {req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {isSelected && (
                  <div className="text-center">
                    <button
                      onClick={confirmProjectApplication}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      确认申请此项目
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 操作提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">💡 申请提示</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 仔细查看项目的申请要求和奖励，选择最适合您当前状态的项目</li>
          <li>• 项目难度越高，奖励越丰厚，但要求也越高</li>
          <li>• 项目会每年消耗一定的属性，请确保有足够的属性储备</li>
          <li>• 同时只能进行一个项目，请合理规划研究计划</li>
        </ul>
      </div>
    </div>
  )
}

export default ProjectApplication
