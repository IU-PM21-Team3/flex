import type { NextPage } from 'next'
import DefaultLayout from '../components/DefaultLayout'
import TimeLine from '../components/timeLine'

const Time: NextPage = () => {
  return (
    <DefaultLayout>
        <TimeLine/>
    </DefaultLayout>
  )
}

export default Time
