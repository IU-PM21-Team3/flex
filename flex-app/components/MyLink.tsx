import Link from "next/link";
import React, { ReactNode } from "react";
import * as style from "../styles/MyLink.styles";

const MyLink = (props: { children?: ReactNode, href?: string }) => (
  <Link href={props.href ?? "/"}>
    <a style={style.link}>{props.children}</a>
  </Link>
);

export default MyLink;
