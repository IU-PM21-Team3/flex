import { NextPage } from "next";
import styles from "../../styles/paidPlan.module.css";
import PrivatePage from "../../components/PrivatePage";
import React from "react";
import Button from "@material-ui/core/Button";

const UI: NextPage = () => {
  return (
    <PrivatePage>
      <div className={styles.APP}>
        <h1>有料プランの手続き</h1>
        <h3>有料プランのお申込み</h3>
        <p />
        以下のプランをご購入する際は、お申込み手続きへお進みください。
        <br />
        <div className={styles.plan}>
          <h4>
            <p>
              <big>¥？？？</big> /月
              <ul>
                <li>旅程のシェア機能</li>
                <li>旅程の写真添付機能</li>
                <li>クーポン券の提供</li>
                <li>ポイント機能</li>
                <li>旅程の共同編集機能</li>
                <li>観光地のコミュニティ作成/加入機能</li>
              </ul>
            </p>
          </h4>
        </div>
        <label>
          <br />
          <Button color="primary" variant="contained"><big>お申込み手続きへ進む</big></Button>
        </label>
        <br />
        <br />
      </div>
    </PrivatePage >
  );
};

export default UI;
