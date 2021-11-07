import React, { useState } from "react";
import MaterialTable from "material-table";
import { DBUser } from "../firebase/DBTypes";
import { UserController } from "../firebase/UsersController";
import flexFirebase from "../firebase/clientApp";
import { Button, LinearProgress } from "@material-ui/core";

interface DBUserWithUID extends DBUser {
  uid: string;
  createdDateInStr: string;
}

const usersCtrler = new UserController(flexFirebase.store);

function getUsers(): Promise<DBUserWithUID[]> {
  return usersCtrler.getUsersArray().then((dic) => {
    const retArr: DBUserWithUID[] = [];

    for (const key in dic) {
      const tmp: DBUserWithUID = dic[key] as DBUserWithUID;

      tmp.uid = key;
      tmp.createdDateInStr = tmp.createdDate.toISOString();

      retArr.push(tmp);
    }

    return retArr;
  });
}

const ProductPage = () => {
  const [users, setUsers] = useState<DBUserWithUID[]>([]);
  const [isLoading, setIsLoading] = useState<VisibilityState>("hidden");

  // 再描画がかかると実行される
  getUsers().then((arr) => {
    // 更新が必要な時のみ更新を行う
    if (arr.toString() != users.toString()) {
      setUsers(arr);
    }

    setIsLoading("hidden");
  });

  // Table Icon ref : https://material-table.com/#/docs/install
  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />

      <Button onClick={() => setIsLoading("visible")} variant="contained" style={{ padding: "0.5em 1em", margin: "1em" }}>
        Reflesh Table
      </Button>

      <LinearProgress style={{ visibility: isLoading }} />

      <MaterialTable
        columns={[
          { title: "UID", field: "uid" },
          { title: "表示名", field: "displayName" },
          { title: "プラン種類", field: "planType" },
          { title: "ユーザ作成日", field: "createdDateInStr" },
        ]}
        data={users}
        options={{
          showTitle: false,
        }}
      />
    </div >
  );
};

export default ProductPage;
