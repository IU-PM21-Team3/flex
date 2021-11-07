import { NextPage } from "next";
import styles from "../styles/paidPlan.module.css";
import PrivatePage from "../components/PrivatePage";
import React from "react";

const UI: NextPage = () => {
  return (
    <PrivatePage>
      <div className={styles.APP}>
        <h1>有料プランの手続き</h1>
        有料プランのお申込み<br /><br />
        以下のプランをご購入する際は、お申込み手続きへお進みください。
        <br />
        <div className={styles.plan}>
          <p>
            <big>¥？？？</big> /月
            <br />
            <br />・旅程のシェア機能
            <br />・旅程の写真添付機能
            <br />・クーポン券の提供
            <br />・ポイント機能
            <br />・旅程の共同編集機能
            <br />・観光地のコミュニティ作成/加入機能
          </p>
        </div>
        <label>
          <br />
          <a href="" className={styles.btn}><big>お申込み手続きへ進む</big></a>
        </label>
      </div>
    </PrivatePage>
  );
};

export default UI;
