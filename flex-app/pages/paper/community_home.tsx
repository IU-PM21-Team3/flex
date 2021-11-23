import type { NextPage } from "next";
import image from "../../images/CommunityTop.jpg";
import MyLink from "../../components/MyLink";
import PrivatePage from "../../components/PrivatePage";
import styles from "../../styles/community_home.module.css";
import Button from '@material-ui/core/Button';
import React from "react";

const Community_Home: NextPage = () => {

  return (
    <PrivatePage>
      <div className={styles.all}>
        <div className={styles.title}>
          <h1>Community Page</h1>
        </div>
        <br />
        <div className={styles.page}>
          <input type="image" src={image.src} alt="Image" />
          <p>浅草寺</p>
        </div>
        <div className={styles.button}>
          <MyLink href="/paper/community_talk">
            <Button size="large" color="primary" variant="contained">
              <big>Community Talk</big>
            </Button> </MyLink>
        </div>
      </div>
    </PrivatePage>
  );
};

export default Community_Home;
