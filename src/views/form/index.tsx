import Left from "./components/Left"
import Center from "./components/Center"
import Right from "./components/Right"

import './index.scss'

const Form: React.FC = () => {
  return <>
    <div className="formWrap flex">
      {/* 左侧组件列表 */}
      <div className="leftPanel">
        <Left />
      </div>
      {/* 中间编辑区 */}
      <div className="centerPanel flex-1">
        <Center />
      </div>
      {/* 右侧属性面板 */}
      <div className="rightPanel">
        <Right />
      </div>
    </div>
  </>
}

export default Form
