import PrivatePage from "../../components/PrivatePage";
import UsersListTable from "../../components/UsersList";
import React from "react";

const userList = () => {
  return (
    <PrivatePage>
      <UsersListTable />
    </PrivatePage>
  );
}

export default userList;
