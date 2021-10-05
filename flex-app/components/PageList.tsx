import { NextPage } from 'next';
import MyLink from './MyLink';

const PageList: NextPage = () => (
  <div>
    <MyLink href="/">
      HOME
    </MyLink>
    <MyLink href="/uploadPhoto">
      Upload Photo
    </MyLink>
  </div>
);

export default PageList;