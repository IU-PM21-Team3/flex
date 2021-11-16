import type { NextPage } from "next";
import TempPageList from "../components/TempPageList";
import React from "react";

const Home: NextPage = () => {
  return (
    <div>
      <h1>Top Page</h1>
      <div>
        このページはトップページです.  上部のメニューより移動したいページを選択してください
      </div>
      <TempPageList />
    </div>
  );
};

export default Home;
