import type { NextPage } from 'next'
import DefaultLayout from '../components/DefaultLayout'

const Home: NextPage = () => {
  return (
    <DefaultLayout>
      <h1>Top Page</h1>
      <div>
        このページはトップページです.  上部のメニューより移動したいページを選択してください
      </div>
    </DefaultLayout>
  )
}

export default Home
