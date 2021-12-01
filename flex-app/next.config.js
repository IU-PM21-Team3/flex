/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      // 外部のサービスから画像を取得する場合は, ここにドメインを記載しておく
      // ref : https://zenn.dev/catnose99/articles/883f7dbbe21632a5254e
      "maps.googleapis.com",
    ]
  },
  distDir: "./.next"
};
