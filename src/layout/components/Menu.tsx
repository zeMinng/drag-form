import { useNavigate, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]
const items: MenuItem[] = [
  {
    key: 'md',
    label: '设计思路',
  },
]

const MenuWrap: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const pathKey = location.pathname.split('/')[1]
  const current = pathKey || ''
  const onClick: MenuProps['onClick'] = (e) => {
    navigate(`/${e.key}`)
  }

  return (
    <Menu 
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  )
}

export default MenuWrap
