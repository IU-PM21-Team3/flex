import React, { ReactNode } from "react";
import { GetAuthContext } from "../contexts/authContext";

const PrivatePage = (props: { children?: ReactNode }) => {
  const isSignedIn = GetAuthContext().user != null;

  if (!isSignedIn) {
    return (
      <div>
        <h1>Error(403) Forbidden</h1>
      </div>
    );
  }

  return <div>{props.children}</div>;
};

export default PrivatePage;
