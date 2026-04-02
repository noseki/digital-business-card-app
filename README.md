# デジタル名刺アプリ

## サービスの説明

デジタル名刺を作成・共有できるアプリです。
名前・自己紹介・スキル・各種SNSアカウント（GitHub/Qiita/ X）を登録し、IDで名刺を共有できます。
※登録データは毎日自動削除されます。

**技術スタック**

- フロントエンド: React / TypeScript / Vite / Chakra UI
- バックエンド: Supabase (DB / 認証)

## 環境設定

前提：Node.js（推奨バージョン: 20 以上）がインストールされていること。

`.env_template` をコピーして `.env` を作成し、各値を設定します。

```bash
cp .env_template .env
```

`.env` の内容:

```
VITE_SUPABASE_URL=<Supabase のプロジェクトURL>
VITE_SUPABASE_ANON_KEY=<Supabase のanon key>
```

SupabaseのURLとanon keyは、Supabaseダッシュボードの `Project Settings > API` から取得できます。

## 起動方法

```bash
git clone git@github.com:noseki/digital-business-card-app.git
cd digital-business-card-app

# 依存パッケージのインストール
npm install

# 開発サーバー起動
npm run dev
```

開発サーバーが起動したら `http://localhost:5173` にアクセスします。

## アプリ使用方法

1. トップページの`新規登録はこちら`より名刺情報を入力・登録
2. `好きな英単語`として登録したIDをトップページに入力し、`名刺を見る`ボタン押下
3. 登録した情報を名刺カードとして見ることができます
