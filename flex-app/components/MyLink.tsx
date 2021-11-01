import { Link } from "react-router-dom";
import { ReactNode } from 'react';
import * as style from '../styles/MyLink.styles'

const MyLink = (props: { children?: ReactNode, href?: string }) => (
  <Link to={props.href ?? "/"}>
    <a style={style.link}>{props.children}</a>
  </Link>
);

export default MyLink;