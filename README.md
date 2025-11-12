# 🧩 Kollabor8 Keystone

> Modular MERN backend powering Kollabor8 Web Collectives’ automation and SEO intelligence suite.

---

## 🚀 Overview

Kollabor8 Keystone is the backend foundation for automated SEO audits, report generation, and data-led campaign intelligence.  
It’s built for *clarity, speed, and scalability* — not clutter.

Designed around a clean **MVC architecture**, the stack focuses on modular, reusable services with a minimalist controller pattern.

---

## ⚙️ Tech Stack

| Layer | Tech | Purpose |
|-------|------|----------|
| **Runtime** | Node.js + Express | Lightweight and modular server framework |
| **Language** | TypeScript | Strict typing, modern syntax, clean maintainability |
| **Database** | MongoDB (via Mongoose) | Scalable document data store |
| **Security** | JWT + PBAC | Permission-based access control |
| **Automation** | FluentCRM / Webhooks | Workflow & lead automation (external) |
| **Containerisation** | Docker | Clean, reproducible deployments |
| **Build Tooling** | Vite | Fast, modern bundling (for frontend pairing) |

---

## 🧱 Folder Structure

k8-keystone/
├── server/
│ ├── src/
│ │ ├── config/ # Environment + DB connections
│ │ ├── controllers/ # Express route handlers
│ │ ├── routes/ # API routes
│ │ ├── services/ # Business logic layer
│ │ ├── reports/ # Report generation
│ │ └── app.ts # Express entry point
│ └── tsconfig.json
├── libs/ # Shared utilities + hooks
├── client/ # Frontend (React/Vite)
└── .env.example

---

## 🌱 Environment Setup

Duplicate `.env.example` → rename to `.env.dev` and fill in your local config:

```bash
PORT=8000
MONGO_URI=mongodb://localhost:27017/k8_keystone
NODE_ENV=development
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=debug

To start the backend locally:

pnpm install
pnpm ts-node --esm server/src/app.ts

Then check:

curl http://localhost:8000/health

You should see:

{ "ok": true }

🧩 Branch Strategy

main → stable, production-ready code
dev → active development branch
feature/* → new feature work
hotfix/* → urgent fixes

To create a new branch:

git checkout -b feature/<branch-name>
