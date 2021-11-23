import type { NextPage } from "next";
import Image from "next/image";
import React, { ChangeEvent, ChangeEventHandler, useState } from "react";
import imageNotFound from "../../images/ImageNotFound.png";
import PrivatePage from "../../components/PrivatePage";
import styles from "../../styles/uploadPhoto.module.css";

/**
 * 画像のアップロードを行う
 * @return 画像をアップロードするページ
 */
const UploadPhoto: NextPage = () => {
  const defaultDate: Date = new Date(0, 0, 0, 0, 0, 0, 0);
  const [imageUrl, setImageUrl] = useState(imageNotFound.src);
  const [imageDate, setImageDate] = useState(defaultDate);
  const [imageHeight] = useState(300);
  const [imageWidth] = useState(300);
  const [imageName, setImgName] = useState("imageNotFound");

  // ref : https://zenn.dev/dove/articles/1927889e1c4153
  const onUploadImageChanged: ChangeEventHandler<HTMLInputElement> =
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files == null || event.target.files[0] == null) {
        return;
      }

      const imgFile = event.target.files[0];
      setImageDate(new Date(imgFile.lastModified));

      const imageUrl = URL.createObjectURL(imgFile);
      setImageUrl(imageUrl);

      setImgName(imgFile.name);
    };

  return (
    <PrivatePage>
      <div className={styles.all}>
        <h1>uploadPhoto Page</h1>
        <label htmlFor="id_img">
          <input
            id="id_img"
            type="file"
            accept="image/*"
            onChange={onUploadImageChanged} />
        </label>
        <p />
        <Image
          src={imageUrl}
          height={imageHeight}
          width={imageWidth}
          objectFit="contain"
          alt={imageName} />
        <div>画像の最終更新日: {imageDate.toISOString()}</div>
        <br />
        <br />
      </div>
    </PrivatePage>
  );
};

export default UploadPhoto;
