import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { Button, LinearProgress } from "@material-ui/core";
import { DBTravelPlanDataCtrler } from "../firebase/DBTravelPlanDataCtrler";

interface UserDataForTable{
  uid: string;
  readable: boolean;
  writable: boolean;
}


const UserIDTable = (props: { ctrler: DBTravelPlanDataCtrler; closeDialogAction?: React.Dispatch<React.SetStateAction<boolean>>; }) => {
  const [users, setUsers] = useState<UserDataForTable[]>([]);
  const [isLoading, setIsLoading] = useState<VisibilityState>("hidden");

  useEffect(() => {
    props.ctrler.getTravelPlan().then((v) => {
      const data = v.data();

      if (!v.exists() || data == undefined) {
        return;
      }

      // 重複を排除したユーザ一覧配列
      const usersRefArr = Array.from(new Set(data.readableUsers.concat(data.writableUsers)));

      setUsers(
        usersRefArr.map((v): UserDataForTable => {
          return {
            readable: data.readableUsers.includes(v),
            writable: data.writableUsers.includes(v),
            uid: v.id
          };
        })
      );
    });
  }, []);

  // Table Icon ref : https://material-table.com/#/docs/install
  return (
    <div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />

      <Button onClick={() => console.log(users)} variant="contained" style={{ padding: "0.5em 1em", margin: "1em" }}>
        Reflesh Table
      </Button>

      <LinearProgress style={{ visibility: isLoading }} />

      <MaterialTable
        title="ユーザ一覧"
        columns={[
          { title: "ユーザID", field: "uid", validate: (rowData) => rowData.uid?.length > 0 },
          { title: "読み込み", field: "readable", lookup: { true: "true", false: "false" }, validate: (rowData) => rowData.readable != undefined },
          { title: "書き込み", field: "writable", lookup: { true: "true", false: "false" }, validate: (rowData) => rowData.writable != undefined },
        ]}
        data={users}
        options={{
          showTitle: true,
          selection: true,
        }}
        actions={[
          {
            tooltip: "Remove All Selected Users",
            icon: "delete",
            onClick: (evt, data) => {
              const dArr = (Array.isArray(data) ? data : [data]).filter((v) => v.uid != "");

              setIsLoading("visible");

              // 削除実行
              props.ctrler.removeReadableWritableUsers(
                dArr.filter((v) => v.readable).map((v) => v.uid),
                dArr.filter((v) => v.writable).map((v) => v.uid)
              ).then(() => {
                // 削除したユーザはTableからも削除する
                setUsers(users.filter((v) => !dArr.includes(v)));
              }).finally(() => setIsLoading("hidden"));
            }
          }
        ]}
        editable={{
          onRowAdd: (newData) => {
            // サーバ上のデータを更新する
            return props.ctrler.addReadableWritableUsers(newData.readable ? newData.uid : undefined, newData.writable ? newData.uid : undefined)
              .then(() => setUsers([newData, ...users]));
          },
          onRowUpdate: (newData, oldData) => new Promise((resolve)=>{
            setUsers(users.map((v) => v == oldData ? newData : v));
            resolve(newData);
          }),
        }}
      />

      <Button
        variant="contained"
        style={{ margin: "1em" }}
        onClick={() => {
          if (props.closeDialogAction != undefined) {
            props.closeDialogAction(false);
          }
        }}
      >
        閉じる
      </Button>
    </div >
  );
};

export default UserIDTable;
