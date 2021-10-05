# flex-app


ローカルサーバー起動
下のコマンド入力した後、[localhost:3000](localhost:3000)を開くと`index.tsc`の内容が描画されます
```sh
$ npm run dev
```

## ディレクトリについて
```txt
|-components  コンポーネント（フォームやボタンなど)
|-firebase    Firebase関連
|-hooks       カスタムフックなど
|-models      TypeScriptの型定義（interfaceとか) 
|-pages       ページ（これが表示されるページ)
|-public      公開されるもの（画像やアイコンはここ）
|-styles      CSSファイル、pageごとに書く
|-utils       共通で使える便利な関数など定数とか書いてもOK
```

## Tips
### npm
Node Package Manager (npm)
Node.jsのパッケージ管理システム。Nodeをインストールすることで、npmコマンドも一緒にインストールできる。ライブラリ、パッケージはここからインストール（追加）していく。

パッケージのインストール
```sh
$ npm install <package-name>
```
パッケージのアンインストール
```sh
$ npm remove <package-name>
```
プロジェクトに追加されているパッケージのリスト
```sh
$ npm list
```


今回は`Yarn`は使いません。サイトとか調べててyarnのコマンド出てきたら、次のように置き換えよう。(npmで十分)
```sh
$ yarn add <package-name>
$ npm install <package-name>

$ yarn remove <package-name>
$ npm remove <package-name>
```

### React Developer Tools
ChromeおよびFirefox向け、最近のEdgeは内部でChrome使ってるので多分入れられるかも。
拡張機能で`React Developer Tools`を検索して追加すると、開発が楽になります。多分

