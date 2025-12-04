import { useGameStore } from '../store/gameStore'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { personas } from '../config/personas'

function Onboarding() {
  const { startNewGame, character } = useGameStore()
  const navigate = useNavigate()
  const [points, setPoints] = useState(10)
  const [selected, setSelected] = useState<string[]>([])
  const base = { academicScore: 50, funding: 10, reputation: 40, studentLoyalty: 30 }
  const preview = useMemo(() => {
    let a = { ...base }
    let hidden = { exploitEfficiency: 1.0, studentSatisfaction: 1.0, networkingPower: 1.0 }
    selected.forEach(id => {
      const p = personas.find(x => x.id === id)!
      if (p.effects.attributes) {
        Object.entries(p.effects.attributes).forEach(([k, v]) => { (a as any)[k] = (a as any)[k] + (v as number) })
      }
      if (p.effects.hidden) {
        Object.entries(p.effects.hidden).forEach(([k, v]) => { (hidden as any)[k] = (hidden as any)[k] * (v as number) })
      }
    })
    return { a, hidden }
  }, [selected])

  const toggle = (id: string, cost: number) => {
    const persona = personas.find(p => p.id === id)!
    const currentOfTag = selected.find(s => personas.find(p => p.id === s)?.tag === persona.tag)
    if (selected.includes(id)) {
      setSelected(selected.filter(x => x !== id))
      setPoints(points + cost)
      return
    }
    // replace same-tag selection if exists
    if (currentOfTag) {
      const prev = personas.find(p => p.id === currentOfTag)!
      const nextSelected = selected.filter(x => x !== currentOfTag).concat(id)
      setSelected(nextSelected)
      setPoints(points + prev.cost - cost)
      return
    }
    if (points < cost) return
    setSelected([...selected, id])
    setPoints(points - cost)
  }

  const confirm = () => {
    if (points < 0) {
      window.dispatchEvent(new CustomEvent('game-message', { detail: '属性点不足，请调整人设选择' }))
      return
    }
    startNewGame()
    useGameStore.setState(state => ({
      character: { 
        ...state.character, 
        attributes: { 
          ...preview.a, 
          funding: preview.a.funding + points 
        } 
      },
      hiddenAttributes: { ...preview.hidden },
      onboarded: true,
    }))
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">欢迎进入校园导师模拟器</h1>
      <p className="text-gray-600 mb-6">请选择初始人设并分配属性点，开始你的学术之旅</p>
      <div className="bg-white rounded-lg border p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">属性点</span>
          <span className="text-blue-600 font-bold">{points}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {personas.map(p => {
            const selectedOfTag = selected.find(s => personas.find(px => px.id === s)?.tag === p.tag)
            const isSelected = selected.includes(p.id)
            const sameTagOccupied = !!selectedOfTag && !isSelected
            const cls = isSelected
              ? 'border-blue-500 bg-blue-50'
              : sameTagOccupied
              ? 'border-gray-300 bg-gray-50'
              : 'border-gray-200 hover:bg-gray-50'
            return (
              <button key={p.id} className={`p-3 border rounded text-left ${cls}`}
                onClick={() => toggle(p.id, p.cost)}
              >
                <div className="flex justify-between">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm">成本：{p.cost}</div>
                </div>
                <div className="text-xs text-gray-600">{p.description}</div>
              </button>
            )
          })}
        </div>
      </div>
      <div className="bg-white rounded-lg border p-4 mb-4">
        <h3 className="font-semibold mb-2">属性预览</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div>学术分：<span className="font-bold">{preview.a.academicScore}</span></div>
          <div>经费：<span className="font-bold">{preview.a.funding}</span></div>
          <div>声望：<span className="font-bold">{preview.a.reputation}</span></div>
          <div>学生爱戴：<span className="font-bold">{preview.a.studentLoyalty}</span></div>
        </div>
        <div className="mt-2 text-xs text-gray-600">隐藏：压榨×{preview.hidden.exploitEfficiency.toFixed(2)} 满意度×{preview.hidden.studentSatisfaction.toFixed(2)} 社交×{preview.hidden.networkingPower.toFixed(2)}</div>
      </div>
      <button onClick={confirm} className="bg-blue-600 text-white px-6 py-3 rounded">开始游戏</button>
    </div>
  )
}

export default Onboarding
