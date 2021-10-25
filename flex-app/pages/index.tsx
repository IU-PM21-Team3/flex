import type { NextPage } from 'next'
import { useState } from 'react'
import DefaultLayout from '../components/DefaultLayout'
import { getTrafficInfo } from '../functions/GetTrafficInfo.client'

const Home: NextPage = () => {
  const [TrafficInfo, setTrafficInfo] = useState("RUNNING");

  getTrafficInfo().then(value => {
    setTrafficInfo(value?.toString ?? "FAILED");
  });

  return (
    <DefaultLayout>
      <h1>Top Page</h1>
      <div>
        このページはトップページです.  上部のメニューより移動したいページを選択してください
      </div>

      <div>{TrafficInfo}</div>
    </DefaultLayout>
  )
}

export default Home
