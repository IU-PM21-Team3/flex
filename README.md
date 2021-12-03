# flex

flexとは, 旅行プランの組み立てを支援するシステムです.  交通情報や施設の休業情報等の変更通知を確認することができ, それをもとに旅行プランの修正も可能にすることを目標にしています.

## 開発用ソフトウェアをインストールする
### Windows環境の場合
次のものをインストールする

- `scoop`: Windows用のパッケージ管理ツール
- `vscode`: コードエディタ
- `nodejs`: JavaScript実行環境

まずはscoopのインストールを行います.  最初にPowerShellを開いてください

以下をコピーして貼り付けてください。なお、色々出てきますが全部`Y`で大丈夫です。
```txt
Set-ExecutionPolicy RemoteSigned -scope CurrentUser
invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')
```

あとは
```sh
$ scoop install vscode
$ scoop install nodejs
```

で完了！

最後に, `vscode`コマンドにてVisual Studio Codeのウィンドウが開くこと, および`npm -v`コマンドにて正常にバージョン情報が出力されることを確認してください.

## Ubuntu(Debian)環境の場合
terminalにて以下のコマンドを実行して, 必要なソフトウェアをインストールしてください.  なお, テキストエディタはVisual Studio Codeの使用を推奨しますが, 特に制限しません.

[LinuxにVSCodeをインストールする手順 (VSCode Docs)](https://code.visualstudio.com/docs/setup/linux)

```sh
sudo apt install nodejs
```

インストール後, `npm -v`でバージョン情報が出力されればインストール成功です.

上記では説明していませんが, gitクライアントもインストールされている必要があります.  通常はインストール済みだと思いますが, 念のため`git --version`でバージョン情報が出力されるかを確認してください.

## 最初にやること
必要なソフトウェアをインストールしたら, 以下のコマンドにて開発環境を整えます

1. gitリポジトリを手元に落とす (`git clone https://github.com/IU-PM21-Team3/flex.git`)
2. アプリ開発用ディレクトリに移動する (`cd flex/flex-app`)
3. アプリケーションで使用する, あるいは開発に必要になるパッケージをインストールする (`npm install` OR `npm i`)

## 作業のルーチン
各タスクは, 以下の手順で消化していってください

1. ブランチを新規に作成し, チェックアウト
2. `npm i` (もしくは`npm install`)で不足しているパッケージをインストール
3. コードを書く
4. commitする
5. pushする
6. 3~5の繰り返し
7. GitHub.com上でPull Requestを作成する
8. GitHub.com上でmergeを行う (現在のブランチは自動で削除されます)
9. 手元でフェッチを行い, 現在のブランチを削除する

## デバッグ方法
`npm run dev`コマンドにて, デバッグ用Webサーバがローカルに立ち上がります.  http://localhost:3000/ にアクセスして, デバッグを開始してください.

## デプロイ方法
GitHub Actionsを用いた自動デプロイフローを構築しているため, 通常は手元からデプロイする必要はありません.

デプロイする必要がある場合は, `npx firebase login`コマンドにて「Firebaseのflexプロジェクトに対する適切な権限を持ったアカウント」にログインしたうえで, `npm run deploy`にてデプロイできます.

なお, 上記コマンドでデプロイできるのはCloud HostingとCloud Functions for Firebaseに対してのみです.
