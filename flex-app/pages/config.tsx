import { NextPage } from "next";
import React from "react";
import PrivatePage from "../components/PrivatePage";
import { Grid } from "@material-ui/core";
// import TimeLine from "../components/timeLine";


const Config: NextPage = () => {
  return (
    <PrivatePage>
      <h1>旅程編集ページ</h1>
      <Grid container>
        <Grid item xs={4}>
          {/* ここにタイムライン */}
        </Grid>
        <Grid item xs={8}>
          {/* ここに地図 */}
        </Grid>
      </Grid>
    </PrivatePage>
  );
};

export default Config;
