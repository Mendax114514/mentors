import { useGameStore } from '../store/gameStore'
import { useState } from 'react'
import { equipment as equipmentData } from '../data/equipment'

function EquipmentStore() {
  const { 
    character, 
    purchasedEquipment, 
    purchaseEquipment 
  } = useGameStore()
  const availableEquipment = equipmentData
  const ownedCounts = purchasedEquipment.reduce<Record<string, number>>((m, e) => {
    m[e.id] = (m[e.id] || 0) + 1
    return m
  }, {})
  
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)

  const getEquipmentTypeText = (type: string) => {
    switch (type) {
      case 'equipment': return '设备'
      case 'consumable': return '消耗品'
      default: return '物品'
    }
  }

  const canAfford = (price: number) => {
    return character.attributes.funding >= price
  }

  const handleEquipmentSelection = (equipmentId: string) => {
    setSelectedEquipment(equipmentId)
  }

  const confirmPurchase = () => {
    if (selectedEquipment) {
      const item = availableEquipment.find(e => e.id === selectedEquipment)
      if (item && canAfford(item.price)) {
        purchaseEquipment(selectedEquipment)
        setSelectedEquipment(null)
      } else {
        window.dispatchEvent(new CustomEvent('game-message', { detail: '资金不足，无法购买此物品' }))
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">实验室装备商店</h1>
        <p className="text-lg text-gray-600">购买各种装备和物品，提升学生工作效率和忠诚度</p>
      </div>

      {/* 资金状态 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="game-card p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{character.attributes.funding}</div>
          <div className="text-sm text-gray-600">当前资金</div>
        </div>
        <div className="game-card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{availableEquipment.length}</div>
          <div className="text-sm text-gray-600">可购买物品</div>
        </div>
        <div className="game-card p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{purchasedEquipment.length}</div>
          <div className="text-sm text-gray-600">已购买物品</div>
        </div>
      </div>

      {/* 购买状态提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-2xl mr-3">🛒</div>
          <div>
            <h3 className="font-semibold text-blue-800">请选择要购买的装备（本年可购买多件）</h3>
            <p className="text-blue-700 text-sm">不同的装备会带来不同的效果，请根据您的需求选择</p>
          </div>
        </div>
      </div>

      {/* 装备列表 */}
      <div className="game-card p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">可购买装备</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...availableEquipment]
            .sort((a, b) => {
              const aAffordable = canAfford(a.price)
              const bAffordable = canAfford(b.price)
              const aCanSelect = aAffordable && !(a.type !== 'consumable' && ownedCounts[a.id])
              const bCanSelect = bAffordable && !(b.type !== 'consumable' && ownedCounts[b.id])
              if (aCanSelect !== bCanSelect) return bCanSelect ? 1 : -1
              if (aAffordable !== bAffordable) return bAffordable ? 1 : -1
              return a.price - b.price
            })
            .map(item => {
            const isSelected = selectedEquipment === item.id
            const affordable = canAfford(item.price)
            const owned = ownedCounts[item.id] || 0
            
            return (
              <div 
                key={item.id}
                className={`relative p-6 border-2 rounded-lg transition-all duration-300 ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                }`}
                onClick={() => {
                  if (!(owned > 0 && item.type !== 'consumable')) {
                    handleEquipmentSelection(item.id)
                  }
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">{item.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'equipment' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {getEquipmentTypeText(item.type)}
                      </span>
                      {owned > 0 && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          已购买{item.type === 'consumable' ? `×${owned}` : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{item.price}</div>
                    <div className="text-sm text-gray-600">资金</div>
                  </div>
                </div>

                {/* 装备效果 */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">装备效果：</h4>
                  <div className="space-y-2">
                    {item.effects.studentWorkEfficiency && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">学生工作效率</span>
                        <span className="font-medium text-green-600">
                          +{(item.effects.studentWorkEfficiency * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                    {typeof item.effects.studentLoyalty === 'number' && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">学生忠诚度</span>
                        <span className="font-medium text-blue-600">
                          +{item.effects.studentLoyalty}
                        </span>
                      </div>
                    )}
                    {(item.effects as any).loyaltyRateBonus && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">忠诚度增长</span>
                        <span className="font-medium text-purple-600">
                          +{(item.effects as any).loyaltyRateBonus}/年
                        </span>
                      </div>
                    )}
                    {(item.effects as any).academicScore && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">学术分</span>
                        <span className="font-medium text-indigo-600">
                          +{(item.effects as any).academicScore}
                        </span>
                      </div>
                    )}
                    {(item.effects as any).reputation && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">学术声誉</span>
                        <span className="font-medium text-pink-600">
                          +{(item.effects as any).reputation}
                        </span>
                      </div>
                    )}
                    {(item.effects as any).studentCount && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">新增学生</span>
                        <span className="font-medium text-purple-600">
                          +{(item.effects as any).studentCount}
                        </span>
                      </div>
                    )}
                    {(item.effects as any).studentCapBonus && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">学生上限</span>
                        <span className="font-medium text-teal-600">
                          +{(item.effects as any).studentCapBonus}
                        </span>
                      </div>
                    )}
                    {!item.effects.studentWorkEfficiency && !item.effects.studentLoyalty && !(item.effects as any).loyaltyRateBonus && !(item.effects as any).academicScore && !(item.effects as any).reputation && !(item.effects as any).studentCount && !(item.effects as any).studentCapBonus && (
                      <div className="text-sm text-gray-500 text-center py-2">
                        该装备暂无特殊效果
                      </div>
                    )}
                  </div>
                </div>

                {/* 资金状态 */}
                {!affordable && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center">
                      <div className="text-red-600 mr-2">💰</div>
                      <div>
                        <h5 className="font-semibold text-red-800">资金不足</h5>
                        <p className="text-red-700 text-sm">
                          需要 {item.price} 资金，当前只有 {character.attributes.funding}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isSelected && (
                  <div className="text-center">
                    <button
                      onClick={confirmPurchase}
                      className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                    >
                      确认购买此装备
                    </button>
                  </div>
                )}

                {/* 已购买的非消耗品添加灰色斜线 */}
                {owned > 0 && item.type !== 'consumable' && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-300 rotate-[-20deg]" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 已购买装备 */}
      {purchasedEquipment.length > 0 && (
        <div className="game-card p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">已购买装备</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchasedEquipment.map(item => (
              <div key={item.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="text-green-600 mr-2">✅</div>
                  <h3 className="font-semibold text-green-800">{item.name}</h3>
                </div>
                <p className="text-green-700 text-sm mb-2">{item.description}</p>
                <div className="text-xs text-green-600">
                  {item.effects.studentWorkEfficiency && (
                    <div>工作效率: +{(item.effects.studentWorkEfficiency * 100).toFixed(0)}%</div>
                  )}
                  {item.effects.studentLoyalty && (
                    <div>忠诚度: +{(item.effects.studentLoyalty * 100).toFixed(0)}%</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 操作提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">💡 购买提示</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 设备类装备会永久提升学生的工作效率</li>
          <li>• 消耗品类装备会立即提升学生的忠诚度</li>
          <li>• 合理搭配不同类型的装备可以获得最佳效果</li>
          <li>• 本年可购买多件装备，非消耗品只能购买一次</li>
        </ul>
      </div>
    </div>
  )
}

export default EquipmentStore
