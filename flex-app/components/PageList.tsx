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
    <MyLink href="/booking">
      Booking
    </MyLink>
    <MyLink href="/community_home">
      Community
    </MyLink>
    <MyLink href="/paidPlan">
      Paid Plan
    </MyLink>
    <MyLink href="/timeLine">
      Timeline
    </MyLink>
  </div>
);

export default PageList;