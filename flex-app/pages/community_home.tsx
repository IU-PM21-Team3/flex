import type { NextPage } from "next";
import image from "../images/CommunityTop.jpg";
import Link from "next/link";
import MyLink from "../components/MyLink";

const Community_Home: NextPage = () => {
  return (
    <div>
      <h1>Community Page</h1>
      <br />
      <div>
        <MyLink href="/community_talk">
          <input type="image" src={image.src} alt="Image" />
        </MyLink>
        <p>浅草寺</p>
      </div>
    </div>
  );
};

export default Community_Home;
