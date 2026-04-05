# See You Later

一个「电子时间胶囊」工具。聚会结束后创建链接，大家上传照片和一句话，封存数周或数月后自动送达，让回忆在遗忘之后重新找到你。

## 技术栈

- Next.js 16 App Router
- Tailwind CSS 4
- Supabase Postgres + Storage
- Resend 邮件通知
- Vercel Cron 定时唤醒

## 已实现的 MVP 范围

- 首页叙事型落地页 `/`
- 创建胶囊 `/create`
- 上传页 `/c/[capsuleId]`
- 到期前封存态倒计时
- 开启页 `/c/[capsuleId]/open`
- Supabase 数据读写封装
- 图片上传到 Storage
- 定时任务 `/api/cron/open-capsules`
- Resend 邮件模板

## 本地启动

1. 安装依赖

```bash
npm install
```

2. 复制环境变量模板

```bash
cp .env.example .env.local
```

3. 在 Supabase SQL Editor 执行 `supabase/schema.sql`

4. 填好 `.env.local`

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PHOTOS_BUCKET=capsule-photos
RESEND_API_KEY=
RESEND_FROM_EMAIL="See You Later <capsule@example.com>"
CRON_SECRET=
```

5. 启动开发环境

```bash
npm run dev
```

## 数据结构

### `capsules`

- `id`: UUID
- `title`: 胶囊标题
- `creator_name`: 创建者昵称
- `creator_email`: 创建者邮箱
- `open_at`: 开启时间
- `status`: `collecting | sealed | opened`
- `created_at`: 创建时间

### `contributions`

- `id`: UUID
- `capsule_id`: 关联胶囊
- `nickname`: 上传者昵称
- `email`: 上传者邮箱
- `message`: 给未来的话
- `photos`: Storage 路径数组
- `created_at`: 上传时间

## 定时任务

仓库内置了 [`vercel.json`](./vercel.json)，默认每小时触发一次：

- 读取 `open_at <= now` 且未开启的胶囊
- 聚合所有参与者邮箱
- 发送唤醒邮件
- 更新状态为 `opened`

如果设置了 `CRON_SECRET`，调用 `/api/cron/open-capsules` 时需要带上：

```bash
Authorization: Bearer <CRON_SECRET>
```

## 说明

- 这版故意不做账号体系，邮箱即身份。
- 页面在未配置环境变量时也能打开，用于先看 UI 和交互。
- Storage bucket 默认使用 `capsule-photos`，如需修改请同步更新环境变量。
