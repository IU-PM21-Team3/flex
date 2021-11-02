import type { NextPage } from 'next'
import DefaultLayout from '../components/DefaultLayout'
import TempPageList from '../components/TempPageList'

const Home: NextPage = () => {
  return (
    <DefaultLayout>
      <h1>Top Page</h1>
      <div>
        このページはトップページです.  上部のメニューより移動したいページを選択してください
      </div>
      <TempPageList />
    </DefaultLayout>
  )
}

export default Home
