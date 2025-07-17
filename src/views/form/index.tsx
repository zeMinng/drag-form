import Left from "./components/Left"
import Center from "./components/Center"
import Right from "./components/Right"
import { DndContext } from '@dnd-kit/core'
import { useFormStore } from '@/store/modules/form'

import './index.scss'

const Form: React.FC = () => {
  const addCenterItem = useFormStore(state => state.addCenterItem)

  // 处理拖拽结束
  const handleDragEnd = (event: any) => {
    const { over, active } = event
    if (over && over.id === 'center-drop-area' && active.data.current) {
      addCenterItem(active.data.current)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="formWrap flex">
        <div className="leftPanel">
          <Left />
        </div>
        <div className="centerPanel flex-1">
          <Center />
        </div>
        <div className="rightPanel">
          <Right />
        </div>
      </div>
    </DndContext>
  )
}

export default Form
