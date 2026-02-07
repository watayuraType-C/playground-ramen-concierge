This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## フロントエンド用の型定義を更新
```
npx openapi-typescript schema/api.yaml -o src/types/api.ts
```

# バックエンド用のZodスキーマを更新
```
npx openapi-zod-client schema/api.yaml -o src/types/zod-schemas.ts
```

## コーディング規約
- **原則 1ファイル 1関数**: ロジックの最小単位で分割し、テストしやすくする。
- **ファイル命名**: 関数名と同一とし、`snake_case` を採用する。
- **関数命名**: ファイル名と同一とし、`snake_case` を採用する。
- **変数命名**: `snake_case` を採用する。
- **コロケーション**: 特定のエンドポイントでしか使わない関数は、その `route.ts` と同じ階層に置く。