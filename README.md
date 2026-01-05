# TODOアプリケーション

カテゴリ、タグ、期限、優先度などの高度な機能を備えたフルスタックTODOアプリケーションです。

## 機能

- ✅ タスクの作成、閲覧、更新、削除
- ✅ タスクの完了/未完了の切り替え
- ✅ カテゴリでタスクを整理
- ✅ タスクに複数のタグを追加
- ✅ 期限日の設定と期限切れインジケーター
- ✅ 優先度レベルの設定（高、中、低）
- ✅ ステータス、優先度、カテゴリ、タグでタスクをフィルタリング
- ✅ 作成日、期限日、優先度でタスクをソート
- ✅ モバイル・デスクトップ対応のレスポンシブデザイン
- ✅ リアルタイム更新

## デモ

**GitHub Pages**: https://ryutokanazawa.github.io/TODO/

※ GitHub Pagesではフロントエンドのみ（LocalStorage使用）

## 技術スタック

### バックエンド（ローカル開発用）
- Node.js + Express.js + TypeScript
- SQLite データベース + Sequelize ORM
- RESTful API アーキテクチャ
- express-validator による入力検証

### フロントエンド
- React + TypeScript
- Vite（高速開発）
- Tailwind CSS（スタイリング）
- LocalStorage（GitHub Pages版ではデータ永続化）
- Context API（状態管理）
- date-fns（日付処理）
- lucide-react（アイコン）

## 前提条件

- Node.js（v18以上）
- npm（v9以上）

## インストール

1. リポジトリをクローン:
```bash
git clone https://github.com/RyutoKanazawa/TODO.git
cd todo
```

2. 依存関係をインストール:
```bash
# ルートの依存関係をインストール
npm install

# バックエンドの依存関係をインストール
cd backend && npm install && cd ..

# フロントエンドの依存関係をインストール
cd frontend && npm install && cd ..
```

## 開発

### フロントエンドとバックエンドを同時実行:
```bash
npm run dev
```

### バックエンドのみ実行:
```bash
npm run backend
```

### フロントエンドのみ実行:
```bash
npm run frontend
```

アプリケーションは以下のURLで利用可能:
- **フロントエンド**: http://localhost:5173
- **バックエンド**: http://localhost:3000
- **API**: http://localhost:3000/api

## APIエンドポイント

### タスク
- `GET /api/tasks` - 全タスクを取得（フィルタリングとソートに対応）
  - クエリパラメータ: `completed`, `priority`, `categoryId`, `tag`, `sortBy`, `order`
- `GET /api/tasks/:id` - 単一タスクを取得
- `POST /api/tasks` - 新規タスクを作成
- `PUT /api/tasks/:id` - タスクを更新
- `PATCH /api/tasks/:id/complete` - タスクの完了状態を切り替え
- `DELETE /api/tasks/:id` - タスクを削除

### カテゴリ
- `GET /api/categories` - 全カテゴリを取得
- `GET /api/categories/:id` - 単一カテゴリを取得
- `POST /api/categories` - カテゴリを作成
- `PUT /api/categories/:id` - カテゴリを更新
- `DELETE /api/categories/:id` - カテゴリを削除

## プロジェクト構造

```
todo/
├── backend/                 # バックエンドアプリケーション
│   ├── src/
│   │   ├── config/         # データベース設定
│   │   ├── controllers/    # リクエストハンドラー
│   │   ├── middleware/     # Expressミドルウェア
│   │   ├── models/         # データベースモデル
│   │   ├── routes/         # APIルート
│   │   ├── types/          # TypeScript型定義
│   │   └── server.ts       # アプリケーションエントリーポイント
│   └── database/           # SQLiteデータベースファイル
├── frontend/               # フロントエンドアプリケーション
│   ├── src/
│   │   ├── components/     # Reactコンポーネント
│   │   ├── context/        # React Context
│   │   ├── services/       # APIサービス
│   │   ├── types/          # TypeScript型定義
│   │   ├── utils/          # ユーティリティ関数
│   │   ├── test/           # テストファイル
│   │   └── App.tsx         # メインアプリコンポーネント
│   └── public/             # 静的アセット
└── package.json            # ルートパッケージ設定
```

## 本番環境用ビルド

### バックエンドをビルド:
```bash
cd backend && npm run build
```

### フロントエンドをビルド:
```bash
cd frontend && npm run build
```

### 両方をビルド:
```bash
npm run build
```

## GitHub Pagesへのデプロイ

```bash
cd frontend
npm run build
npm run deploy
```

## 環境変数

バックエンドの`.env`ファイル:
```
PORT=3000
NODE_ENV=development
DATABASE_PATH=./database/todo.db
```

## テスト

```bash
cd frontend
npm run test      # ウォッチモード
npm run test:run  # 1回実行
```

詳細は`CLAUDE.md`を参照してください。

## ライセンス

MIT

## 作者

Created with Claude Code
