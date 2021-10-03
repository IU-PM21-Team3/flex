# flex

## 最初のセットアップ
次のものをインストールする
- `scoop`: Windows用のパッケージ管理ツール
- `vscode`: コードエディタ
- `nodejs`: JavaScript実行環境

### scoopのインストール
最初にPowerShellを開いてください

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