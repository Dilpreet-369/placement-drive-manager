# Placement Drive Manager

A modern full-stack web application built with **Next.js**, **Prisma**, **PostgreSQL** (via **Supabase**), and **Tailwind CSS**. This project is bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Database Setup (Supabase + Prisma)](#-database-setup-supabase--prisma)
- [Running the Project](#-running-the-project)
- [Project Structure](#-project-structure)

---

## 🛠 Tech Stack

| Category       | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | [Next.js](https://nextjs.org/) (App Router) |
| Language       | JavaScript / TypeScript             |
| ORM            | [Prisma](https://www.prisma.io/)    |
| Database       | [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/) |
| Styling        | [Tailwind CSS](https://tailwindcss.com/) |
| Font           | [Geist](https://vercel.com/font) via `next/font` |
| Deployment     | [Vercel](https://vercel.com/)       |

---

## ✅ Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** `v18.17+` or `v20+` — [Download](https://nodejs.org/)
- **npm**, **yarn**, **pnpm**, or **bun** (package manager)
- A **Supabase** account — [Sign up free](https://supabase.com/)
- **Git** — [Download](https://git-scm.com/)

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

Using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set up environment variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

> See the [Environment Variables](#-environment-variables) section below for details.

---
### 2. Configure Prisma

Your `prisma/schema.prisma` should look like this:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// Your models go here, e.g.:
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 3. Run Prisma commands

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply the initial migration
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to inspect data
npx prisma studio
```

---

## 🏃 Running the Project

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## 📁 Project Structure

```
placement-drive-manager/
├── .agents/
│   └── skills/
│       ├── prisma-composer-core-concepts/
│       │   └── SKILL.md
│       └── prisma-platform-core-concepts/
│           └── SKILL.md
├── .claude/
│   └── skills/
│       ├── prisma-composer-core-concepts/
│       │   └── SKILL.md
│       └── prisma-platform-core-concepts/
│           └── SKILL.md
├── .cursor/
│   └── skills/
│       ├── prisma-composer-core-concepts/
│       │   └── SKILL.md
│       └── prisma-platform-core-concepts/
│           └── SKILL.md
├── .devin/
│   └── skills/
│       ├── prisma-composer-core-concepts/
│       │   └── SKILL.md
│       └── prisma-platform-core-concepts/
│           └── SKILL.md
├── .gitignore
├── AGENTS.md
├── eslint.config.mjs
├── jsconfig.json
├── LICENSE
├── next.config.mjs
├── package-lock.json
├── package.json
├── prisma/
│   └── schema.prisma
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
└── src/
    ├── app/
    │   ├── admin/
    │   │   └── add-drive/
    │   │       └── page.js
    │   ├── api/
    │   │   └── drives/
    │   │       └── route.js
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.js
    │   └── page.js
    └── lib/
        └── prisma.js
```
---

## 📜 Available Scripts

| Command                  | Description                               |
| ------------------------ | ----------------------------------------- |
| `npm run dev`            | Start the development server on port 3000 |
