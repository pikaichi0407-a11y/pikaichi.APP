# Windows 開発環境セットアップツール

新しいWindows PCに以下のツールを一括インストールするスクリプトです。

- Git
- GitHub CLI (`gh`)
- Python
- Node.js (Claude Code CLI実行に必要)
- Claude Code CLI (`claude` コマンド)
- Claude Desktop アプリ

この `setup.bat` は **1台ずつネット接続して使う** 想定です。
何台もセットアップする場合は、下記の「複数台・オフライン対応版」を使うと、
インストーラーの再ダウンロードなしで作業できます。

## 使い方（1台だけ／ネット接続あり）

`setup.bat` はコマンドプロンプトだけで動く単一ファイルです（PowerShellスクリプトへの依存なし）。

1. `setup.bat` をダブルクリックして実行します。
   - `winget` (アプリ インストーラー) が必要です。Windows 10/11 には標準で入っていますが、古い場合は
     [Microsoft Store からアプリ インストーラーを更新](https://apps.microsoft.com/detail/9nblggh4nns1) してください。
2. Git / GitHub CLI / Python / Node.js / Claude Desktop / Claude Code CLI が自動でインストールされます。
3. 完了後、以下はネット接続が必要なため別途行ってください。
   - PCを再起動（インストールしたツールを使えるようにするため）
   - `git config --global user.name` / `user.email` の設定
   - `gh auth login` でGitHubにログイン
   - `claude` でClaude Codeにログイン

## 使い方（複数台・USBメモリで配布・完全オフライン対応）

`offline/` フォルダに、ネットの無いPCでもインストール作業ができるスクリプトを用意しています。

### 手順1: ネット接続のあるPCで1回だけ実行

1. `offline/download-installers.bat` をダブルクリック
2. Git / GitHub CLI / Node.js / Python のインストーラーと、
   Claude Code CLI 用の npm オフラインキャッシュが `offline/installers/` にまとまります。
3. **Claude Desktop だけは自動ダウンロードに対応していません。**
   [https://claude.ai/download](https://claude.ai/download) から手動でダウンロードし、
   同じ `offline/installers/` フォルダに保存してください。
4. `tools/windows-setup/offline` フォルダ（`installers` フォルダを含む）を
   そのままUSBメモリにコピーします。

### 手順2: オフラインのPC（複数台）でそれぞれ実行

1. USBメモリの `offline` フォルダをPCにコピー（USB上から直接実行も可）
2. `install-offline.bat` をダブルクリック
3. Git / GitHub CLI / Python / Node.js / Claude Desktop / Claude Code CLI が
   **ネット接続なしで** インストールされます

### 手順3: 各PCがネットに繋がったら（ログインのみ・PCごとに必要）

アカウントへのログインはオフラインではできないため、最後にネットに繋いだ状態で以下を行います。

```
git config --global user.name "あなたの名前"
git config --global user.email "あなたのメールアドレス"
gh auth login
claude
```

Claude Desktop アプリも起動してログインしてください。

## 補足

- どちらのスクリプトも何度実行しても安全です（すでにインストール済みのものはスキップされます）。
- `winget` 版でインストールに失敗した項目は、画面に表示される手動インストール用のURLからインストールしてください。
- 管理者権限なしでも実行できますが、環境によっては一部のインストールで管理者権限を求められることがあります。
- `offline/installers/python-*-amd64.exe` のPythonバージョンは `1-download-installers.ps1` 内の
  `$pythonVersion` を書き換えれば変更できます。
