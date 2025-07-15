import { TimePicker } from "antd"
import dayjs from 'dayjs'

const Home: React.FC = () => {
  return <TimePicker defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
}

export default Home
