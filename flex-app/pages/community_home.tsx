import type { NextPage } from "next";
import DefaultLayout from "../components/DefaultLayout";
import image from "../images/CommunityTop.jpg";
import Link from "next/link";

const Community_Home: NextPage = () => {
  return (
    <DefaultLayout>
      <h1>Community Page</h1>
      <br />
      <div>
        <Link href="/community_talk">
          <input type="image" src={image.src} alt="Image" />
        </Link>
        <p>浅草寺</p>
      </div>
    </DefaultLayout>
  );
};

export default Community_Home;
