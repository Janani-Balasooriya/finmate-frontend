# FinMate – Frontend

**FinMate** is a personal and family finance management app that helps households track income and expenses, plan budgets, manage subscriptions and work toward shared savings goals.

This repository contains the **React + TypeScript** web client. The Spring Boot API lives in **[finmate-backend](https://github.com/Janani-Balasooriya/finmate-backend)**.

## Features

- **Dashboard:** monthly income, expenses and net savings at a glance, with income-vs-expense trends, budget-vs-actual spending, cash-flow analysis, category trends and a spending breakdown.
- **Key Insights:** automatic alerts for budgets at risk (with an end-of-month spend forecast), upcoming subscription renewals, possible duplicate charges, and savings rate against target.
- **Budgets:** per-category monthly budgets with spent, remaining and progress tracking.
- **Income & Expenses:** add, edit and categorise transactions.
- **Subscriptions:** track recurring payments, billing dates and the account they're charged to.
- **Shared Goals:** savings goals the whole family can contribute to.
- **Family accounts:** invite family members, with role-based access (Admin / Member) enforced by the backend.
- **Settings:** with confirmation before destructive actions such as clearing all data.

## Screenshots

**FinMate dashboard**
<img width="1920" height="2330" alt="image" src="https://github.com/user-attachments/assets/3896892e-8539-4f53-877c-c1f6ff80c8fe" />

**Budgets** 
<img width="1920" height="1552" alt="image" src="https://github.com/user-attachments/assets/c09a54f4-7058-490d-ae9a-bd09b851ee23"/>

**Subscriptions**
<img width="1920" height="970" alt="image" src="https://github.com/user-attachments/assets/6028b747-5f08-42d6-8381-159a2b788ac8" />


## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS with a shadcn/ui-style component setup
- REST integration with a JWT-secured Spring Boot API
- ESLint

## Getting started

### Prerequisites

- Node.js 18+
- The [FinMate backend](https://github.com/Janani-Balasooriya/finmate-backend) running locally (default `http://localhost:8080`)

### Run locally

```bash
git clone https://github.com/Janani-Balasooriya/finmate-frontend.git
cd finmate-frontend
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

## Author

**Janani Balasooriya**: designed and built FinMate end to end (frontend and backend).
[GitHub](https://github.com/Janani-Balasooriya) · [LinkedIn](https://linkedin.com/in/janani-balasooriya)
