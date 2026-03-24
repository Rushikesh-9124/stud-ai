This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.









// Prisma + NeonDB
# 📘 Prisma + Neon + Express Setup (Final Working Documentation)

## 🧩 Tech Stack

* Node.js (ESM)
* Express.js
* Prisma ORM
* Neon (Serverless PostgreSQL)

---

# 🚨 Problems Faced & Root Causes

## ❌ 1. Prisma Client Not Found

### Error:

Cannot find module '.prisma/client/default'

### Root Cause:

* Wrong generator provider:

  ```prisma
  provider = "prisma-client" ❌
  ```
* Custom output path:

  ```prisma
  output = "../generated/prisma" ❌
  ```
* Prisma generated client in a different location, but app was importing from `@prisma/client`

---

## ❌ 2. ESM vs CommonJS Conflict

### Error:

Named export 'PrismaClient' not found

### Root Cause:

* Project uses `"type": "module"` (ESM)
* Prisma uses CommonJS internally
* Named imports don’t work directly

---

## ❌ 3. Neon WebSocket Connection Failure

### Error:

WebSocket failed / fetch failed

### Root Cause:

* Neon serverless uses WebSockets
* Node.js does NOT provide WebSocket by default

---

# ✅ Final Solutions

---

## ✅ 1. Correct Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## ✅ 2. Generate Prisma Client

```bash
rm -rf node_modules package-lock.json
npm install
npx prisma generate
npx prisma db push
```

---

## ✅ 3. Fix ESM Import Issue

```js
import pkg from '@prisma/client'
const { PrismaClient } = pkg
```

---

## ✅ 4. Fix Neon WebSocket Issue

### Install:

```bash
npm install ws
```

### Update db.js:

```js
import 'dotenv/config'
import pkg from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

const { PrismaClient } = pkg

global.WebSocket = ws  // REQUIRED for Neon

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
})

export const prisma = new PrismaClient({ adapter })
```

---

## ✅ 5. Correct Environment Variables

```env
DATABASE_URL="postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

### Important:

* `-pooler` → for app connection ✅
* `sslmode=require` → mandatory ✅

---

# 🧠 Final Architecture

```
Express Server
      ↓
Prisma Client
      ↓
PrismaNeon Adapter
      ↓
Neon Database (via WebSocket)
```

---

# 💥 Key Learnings

### 1. Prisma Client Generation is Critical

* Always run:

  ```bash
  npx prisma generate
  ```
* Client is created inside:

  ```
  node_modules/.prisma/client
  ```

---

### 2. Never Use Custom Output (Beginner Phase)

* Causes path mismatch
* Breaks `@prisma/client`

---

### 3. ESM vs CommonJS

* ESM cannot directly import named exports from CommonJS
* Use:

  ```js
  import pkg from '@prisma/client'
  ```

---

### 4. Neon Requires WebSocket

* Node doesn’t support it by default
* Must install and inject:

  ```js
  global.WebSocket = ws
  ```

---

### 5. Two Connection URLs

| Type         | Usage       |
| ------------ | ----------- |
| DATABASE_URL | App (poole_ |

