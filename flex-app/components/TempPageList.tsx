import React from "react";
import MyLink from "./MyLink";
import Button from '@material-ui/core/Button';
import styles from "../styles/TempPageList.module.css";
type page = {
  name: string,
  path: string;
};

const pages: page[] = [
  { name: "トップページ", path: "/" },
  { name: "ログインページ", path: "/login" },
  { name: "旅行プラン一覧", path: "/user" },
  { name: "旅行プラン作成", path: "/create" },

  //管理者用↓
  { name: "ユーザ一覧", path: "/admin/userList" },
  { name: "交通情報一覧", path: "/admin/trafficInfoList" },

  // 紙芝居↓
  { name: "施設予約処理", path: "/paper/booking" },
  { name: "コミュニティ一覧", path: "/paper/community_home" },
  { name: "有料プラン登録", path: "/paper/paidPlan" },
  { name: "写真アップロード", path: "/paper/uploadPhoto" },
];

const TempPageList: React.FC = () => {
  return (
    <>
      <body>
        <div className={styles.all}>
          <div className={styles.title}>
            ～プランニングで旅行をもっと自由に～
            <p />
          </div>
          <div className={styles.sub_title}>
            flexは旅行プランの作成を提供します。<br />
            旅行先での急な予定変更にも柔軟に対応できます。
            <p />
            <hr />
            <p />
          </div>
          <div className={styles.oya}>
            <div id={styles.contents}>
              作成した旅行プランをご覧になりたい方はこちら
              <br />
              <MyLink href={pages[2].path}>
                <Button size="large" color="primary" variant="contained"><big>{pages[2].name}</big></Button>
              </MyLink>
              <p />
              旅行プラン作成はこちら<br />
              <MyLink href={pages[3].path}>
                <Button size="large" color="primary" variant="contained"><big>{pages[3].name}</big></Button>
              </MyLink>
            </div>
            <p />
            <div id={styles.UI}>
              有料サービスに登録することで、以下の機能を使うことができます
              <br />
              <MyLink href={pages[8].path}>
                <Button size="large" color="primary" variant="contained">
                  <big>{pages[8].name}</big>
                </Button>
              </MyLink>
              <p />
              旅行先でご利用になる施設を予約することができます
              <br />
              <MyLink href={pages[6].path}>
                <Button size="large" color="primary" variant="contained">
                  <big>{pages[6].name}</big>
                </Button>
              </MyLink>
              <p />
              旅行プランに写真を添付することができます
              <br />
              <MyLink href={pages[9].path}>
                <Button size="large" color="primary" variant="contained">
                  <big>{pages[9].name}</big>
                </Button>
              </MyLink>
              <p />
              コミュニティの作成/加入ができます
              <br />
              <MyLink href={pages[7].path}>
                <Button size="large" color="primary" variant="contained">
                  <big>{pages[7].name}</big>
                </Button>
              </MyLink>
            </div>
          </div>
          <hr />
          <div className={styles.lower}>
            <div id={styles.null} />
            <div id={styles.query}>
              お問い合わせ<br />
              mail ****@****.**<br />
              tell ***-****-****<br />
            </div>
            <p />
            <div id={styles.manage}>
              管理者用<br />
              <MyLink href={pages[4].path}>
                <Button size="large" color="primary" variant="contained">
                  <big>{pages[4].name}</big>
                </Button>
              </MyLink>
              <p />
              <MyLink href={pages[5].path}>
                <Button size="large" color="primary" variant="contained">
                  <big>{pages[5].name}</big>
                </Button>
              </MyLink>
              <br />
              <br />
            </div>
          </div>
        </div>
      </body>
    </>
  );
};
export default TempPageList;
