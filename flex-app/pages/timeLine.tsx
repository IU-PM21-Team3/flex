import type { NextPage } from 'next'
import TimeLine from '../components/timeLine'
import PrivatePage from "../components/PrivatePage";

const Time: NextPage = () => {
  return (
    <PrivatePage>
      <TimeLine />
    </PrivatePage>
  )
}

export default Time
