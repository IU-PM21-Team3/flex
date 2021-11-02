import type { NextPage } from 'next'
import TimeLine from '../components/timeLine'
import PrivatePage from "../components/PrivatePage";
import React from "react";

const Time: NextPage = () => {
  return (
    <PrivatePage>
      <TimeLine />
    </PrivatePage>
  )
}

export default Time
