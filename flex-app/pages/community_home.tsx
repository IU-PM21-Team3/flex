import type { NextPage } from "next";
import image from "../images/CommunityTop.jpg";
import MyLink from "../components/MyLink";
import PrivatePage from "../components/PrivatePage";
import React from "react";

const Community_Home: NextPage = () => {
  return (
    <PrivatePage>
      <h1>Community Page</h1>
      <br />
      <div>
        <MyLink href="/community_talk">
          <input type="image" src={image.src} alt="Image" />
        </MyLink>
        <p>浅草寺</p>
      </div>
    </PrivatePage>
  );
};

export default Community_Home;
