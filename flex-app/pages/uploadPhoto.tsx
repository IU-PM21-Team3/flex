import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { ChangeEvent, ChangeEventHandler, useState } from 'react'
import styles from '../styles/Home.module.css'


const uploadPhoto: NextPage = () => {
  const [imageUrl, setImage] = useState("");

  //ref : https://zenn.dev/dove/articles/1927889e1c4153
  const onUploadImageChanged: ChangeEventHandler<HTMLInputElement> =
    (event: ChangeEvent<HTMLInputElement>) =>
    {
      if (event.target.files == null)
        return;

      const imgFile = event.target.files[0];
      const imageUrl = URL.createObjectURL(imgFile);
      setImage(imageUrl);
    }

  return (
    <div>
      <h1>uploadPhoto Page</h1>

      <input type="file" accept="image/*" onChange={onUploadImageChanged} />
      
      <img src={imageUrl} />
      <h2>abc</h2>
    </div>
  )
}

export default uploadPhoto
