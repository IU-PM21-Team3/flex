import { NextPage } from "next"
import { useState } from "react"
import MyLink from "./MyLink"

type page = {
  name: string,
  path: string
}

const pages: page[] = [
  { name: "トップページ", path: "/" },
  { name: "ログインページ", path: "/login" },
  { name: "旅程一覧ページ", path: "/user" },
  { name: "旅程作成ページ", path: "/create" },
  { name: "写真アップロード", path: "/uploadPhoto" },
  { name: "有料プラン登録", path: "/paidPlan" },
  { name: "施設予約処理", path: "/booking" },
  { name: "コミュニティ一覧", path: "/community_home" },
]

const TempPageList: React.FC = () => {

  return (
    <>
    <h2>ページリスト</h2>
    <ul>
      {
        // [tip] TSだとreturn入れないとmap表示されない？
        pages.map(page => {
          return (
            <li key={page.name}>
              <MyLink href={page.path}>
                {page.name}
              </MyLink>
            </li>
          )
        })
      }
    </ul>
    </>
  )
}


export default TempPageList