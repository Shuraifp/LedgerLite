# LedgerLite - Full-Stack Expense Tracker

A modern, full-stack expense tracking application built with **React Router v7 (Framework Mode)**, **Drizzle ORM**, and **PostgreSQL**.

> **Assessment Task Submission**
> This project demonstrates a secure, type-safe full-stack architecture with JWT authentication (Access + Refresh Tokens) and server-side rendering.

## 🚀 Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com/) (SSR + Server Actions)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Database**: PostgreSQL
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: Custom JWT (Dual Token Strategy + Token Rotation)

## ✨ Features

- **Secure Authentication**:
  - Email/Password Registration & Login.
  - **Dual Token Architecture**: Short-lived Access Token (15m) + Long-lived Refresh Token (7d).
  - **Token Rotation**: Reuse detection prevents stolen token attacks.
  - **HttpOnly Cookies**: Prevents XSS attacks.
- **Expense Management**:
  - Create, Read, Update, Delete (CRUD) expenses.
  - Categorize expenses.
  - Filter by date/category.
- **Dashboard**:
  - Visual summary of spending.
  - Category-wise breakdown.
- **Security**:
  - Server-Side Validation (Zod).
  - Password Hashing (Bcrypt).
  - Protected API Routes.

## 🛠️ Project Setup

### Prerequisites
- Node.js (v20+)
- PostgreSQL Database

### 1. Clone & Install
```bash
git clone <repository-url>
cd LedgerLite
npm install
```

### 2. Configure Environment
Rename `.env.example` to `.env` and update your database credentials:
```bash
mv .env.example .env
```
Edit `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ledgerlite"
ACCESS_TOKEN_SECRET="your_random_access_secret"
REFRESH_TOKEN_SECRET="your_random_refresh_secret"
```

### 3. Database Migration
Push the schema to your PostgreSQL database:
```bash
npx drizzle-kit push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view the app.

## 🏗️ Architecture Decisions

### Why React Router v7?
We use React Router in **Framework Mode** to eliminate the need for a separate backend server (like Express).
- `loader` functions handle GET requests (data fetching).
- `action` functions handle POST/PUT/DELETE requests (mutations).
- This "Monolith" approach reduces latency and complexity.

### Why Drizzle ORM?
Drizzle is lightweight, "serverless-ready", and offers best-in-class TypeScript inference compared to heavier ORMs like Prisma.

### Auth Strategy
We avoided `localStorage` for tokens to prevent XSS. Instead, we use **HttpOnly Cookies**. To handle the stateless nature of JWTs securely, we implemented **Refresh Token Rotation**, ensuring that even if a token is stolen, it cannot be used indefinitely.

## 📦 Deployment

The application is Docker-ready.
```bash
docker build -t ledgerlite .
docker run -p 3000:3000 ledgerlite
```
can be deployed to AWS EC2, Google Cloud Run, or any VPS.

---
Built with ❤️ by Mohammed Shuraif
