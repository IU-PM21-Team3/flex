import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div>
      <h1>Top Page</h1>

      <a href="/uploadPhoto">Upload Photo</a>
    </div>
  )
}

export default Home
