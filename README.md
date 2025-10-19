# capitalOne

**A gamified savings and expense dashboard to help you fund your dream car—built with Next.js, Supabase, and the Nessie open banking API.**

## 🚗 What is this?

Cosmic Car Fund is an engaging React/Next.js app that lets users track real bank balances, log expenses, set and complete saving goals, and simulate payment plans to buy their favorite car—all in one connected dashboard. Smart progress, streaks, and a cosmic theme keep users motivated every step of the way.

## ✨ Features

- **Live Banking Data:** Connects to demo accounts on the Nessie open banking API.
- **Car Savings Goal:** Select a car (e.g., Toyota RAV4) during onboarding, then track progress toward funding it.
- **Expense Tracking:** Log daily expenses and instantly see their impact on your goal.
- **Personalized Saving Goals:** Toggle goal checklists that increment your fund as you build new habits.
- **Payment Simulator:** Understand what monthly payments look like using your real and projected savings.
- **Cosmic Gamification:** Track your streak, earn badges, and visualize your progress with animated UI.

## 🚀 Getting Started

**Clone the repo:**

git clone https://github.com/aviyannn/capitalOne.git
cd capitalOne


**Install dependencies:**

npm install

or
yarn

or
pnpm install

or
bun install

**Set API keys and config in `.env.local`:**
- Get a Nessie API key and customer ID.
- Set `NEXT_PUBLIC_NESSIE_API_KEY` and your customer ID in the app.

**Run the development server:**

npm run dev

or
yarn dev

or
pnpm dev

or
bun dev


Open [http://localhost:3000](http://localhost:3000/) in your browser.

**Edit files:**  
Main app code lives in `src/pages/dashboard.tsx`. The page updates automatically as you edit.

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) (with App Router)
- [Supabase](https://supabase.com/) for authentication (optionally)
- [Nessie Open Banking API](https://api.nessieisreal.com)
- Tailwind CSS for styles
- React Hot Toast for notifications

## 🌐 Learn More

- [Next.js Documentation](https://nextjs.org/docs) — deep dive into the framework
- [Supabase Docs](https://supabase.com/docs)
- [Nessie API Docs](https://api.nessieisreal.com/reference)
- [Vercel deployment docs](https://nextjs.org/docs/app/building-your-application/deploying)
