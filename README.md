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









# 📘 Complete Setup: Prisma + Neon + Express (JavaScript)

---

# 🧩 0. Prerequisites

* Node.js (v18+)
* Neon account (database created)
* Basic Node + Express knowledge

---

# 🚀 1. Initialize Project

```bash
npm init -y
```

---

# 📦 2. Install Dependencies

```bash
npm install express cors dotenv jsonwebtoken
npm install @prisma/client @prisma/adapter-neon
npm install prisma --save-dev
```

---

# ⚠️ Optional (recommended for Neon)

```bash
npm install ws
```

---

# ⚙️ 3. Enable ES Modules

Open `package.json` and add:

```json
"type": "module"
```

---

# 🏗️ 4. Initialize Prisma

```bash
npx prisma init
```

This creates:

```
prisma/
  schema.prisma
.env
```

---

# 🔑 5. Add Neon Database URLs

From Neon dashboard → **Connect**

Update `.env`:

```env
DATABASE_URL="postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

---

# ⚠️ Important Rules

* `DATABASE_URL` → must contain `-pooler` ✅
* `DIRECT_URL` → no pooler ✅
* Always include `sslmode=require` ✅

---

# 🧱 6. Configure Prisma Schema

Open:

```
prisma/schema.prisma
```

---

## ✅ Correct Configuration

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

## ❌ Avoid These Mistakes

```prisma
provider = "prisma-client" ❌
output = "../generated/prisma" ❌
```

---

# 🔄 7. Generate Prisma Client

```bash
npx prisma generate
```

---

## 🔍 What This Does

Creates:

```
node_modules/.prisma/client
```

👉 This is REQUIRED for Prisma to work

---

# 🗄️ 8. Push Schema to Database

```bash
npx prisma db push
```

---

# 🧠 Flow So Far

```
schema.prisma
     ↓
prisma generate
     ↓
Prisma Client created
     ↓
db push
     ↓
Tables created in Neon
```

---

# 🔌 9. Setup Database Connection (db.js)

Create:

```
db.js
```

---

## ✅ Final db.js

```js
import 'dotenv/config'
import pkg from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

const { PrismaClient } = pkg

// Required for Neon (WebSocket support)
global.WebSocket = ws

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
})

export const prisma = new PrismaClient({ adapter })
```

---

# ⚠️ Why This is Needed

| Issue           | Fix                     |
| --------------- | ----------------------- |
| ESM vs CommonJS | `import pkg`            |
| Neon WebSocket  | `global.WebSocket = ws` |

---

# 🌐 10. Setup Express Server

Create:

```
server.js
```

---

## ✅ Basic Server

```js
import express from 'express'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.json({ message: "API Working" })
})

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000")
})
```

---

# 🔗 11. Connect Prisma to Routes

Example:

```js
import { prisma } from './db.js'

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})
```

---

# 🧠 Final Architecture

```
Express Server
      ↓
Prisma Client
      ↓
PrismaNeon Adapter
      ↓
Neon Database (WebSocket)
```

---

# ✅ Final Checklist

* [✔] npm init done
* [✔] dependencies installed
* [✔] prisma initialized
* [✔] schema configured correctly
* [✔] prisma generate executed
* [✔] db push executed
* [✔] db.js created
* [✔] WebSocket configured
* [✔] Express server running

---

# 💥 Common Errors & Fixes

## ❌ Cannot find '.prisma/client/default'

👉 Run:

```bash
npx prisma generate
```

---

## ❌ Named export error

👉 Use:

```js
import pkg from '@prisma/client'
```

---

## ❌ WebSocket error

👉 Install + add:

```bash
npm install ws
```

```js
global.WebSocket = ws
```

---

# 🚀 Final Result

You now have:

* Working backend server
* Prisma ORM integrated
* Neon database connected
* Production-ready setup

---

# 🔥 Next Steps

* Authentication (JWT + bcrypt)
* Protected routes
* Clean folder structure
* Deployment (Render / Vercel)

---

# 🧠 One-Line Summary

Initialize → configure schema → generate client → connect with adapter → enable WebSocket → run server.

