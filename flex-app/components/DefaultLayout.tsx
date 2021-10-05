import { NextPage } from 'next'
import PageList from './PageList';
import * as style from '../styles/DefaultLayout.style'


const DefaultLayout: NextPage = (props) => (
  <div style={style.page}>
    <div style={style.header}>
      <PageList />
    </div>

    <hr />

    <div style={style.content}>
      {props.children}
    </div>
  </div>
);

export default DefaultLayout;