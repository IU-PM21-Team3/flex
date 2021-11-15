import React from "react";
import MyLink from "./MyLink";

type page = {
  name: string,
  path: string;
};

const pages: page[] = [
  { name: "トップページ", path: "/" },
  { name: "ログインページ", path: "/login" },
  { name: "旅程一覧ページ", path: "/user" },
  { name: "旅程作成ページ", path: "/create" },
  { name: "(タイムライン)", path: "/timeLine" },
  { name: "(管理者用) ユーザ一覧", path: "/admin/userList" },

  // 紙芝居↓
  { name: "施設予約処理", path: "/paper/booking" },
  { name: "コミュニティ一覧", path: "/paper/community_home" },
  { name: "有料プラン登録", path: "/paper/paidPlan" },
  { name: "写真アップロード", path: "/paper/uploadPhoto" },
];

const TempPageList: React.FC = () => {
  return (
    <>
      <h2>ページリスト</h2>
      <ul>
        {
          pages.map( ( page ) => {
            return (
              <li key={page.name}>
                <MyLink href={page.path}>
                  {page.name} - {page.path}
                </MyLink>
              </li>
            );
          } )
        }
      </ul>
    </>
  );
};


export default TempPageList;
