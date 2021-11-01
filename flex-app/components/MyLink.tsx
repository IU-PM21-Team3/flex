import { Link } from "react-router-dom";
import { ReactNode } from 'react';
import * as style from '../styles/MyLink.styles'

const MyLink = (props: { children?: ReactNode, href?: string }) => (
  <Link to={props.href ?? "/"} style={style.link}>
    <div>
      {props.children}
    </div>
  </Link>
);

export default MyLink;