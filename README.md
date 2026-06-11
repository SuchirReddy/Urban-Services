# Urban Services Demo
> A full-stack, real-time home service booking platform built with Next.js 15, Prisma, and Tailwind CSS.

![Hero](/docs/hero.png)

This project is a comprehensive clone of platforms like Urban Company, designed to demonstrate a robust, multi-tenant marketplace architecture. It features three distinct portals (Customer, Professional, and Admin) communicating in real-time via Pusher.

## 🚀 Key Features

* **Customer Portal**: Browse services, configure add-ons, book appointments, track professionals on a live map, and chat in real-time.
* **Professional Portal**: Dedicated dashboard for service providers to receive job requests, accept/reject, manage active jobs, update statuses, and track earnings.
* **Admin Dashboard**: Comprehensive control center with metrics, charts (Recharts), and CRUD operations for Bookings, Professionals, and Services.
* **Real-time Engine**: Built with Pusher for instant chat messaging, status updates, and new job push notifications.
* **Fluid UI**: Designed with Tailwind CSS, shadcn/ui components, and Framer Motion for beautiful page transitions and micro-interactions.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions, Route Handlers)
- **Database**: SQLite via Prisma ORM
- **Styling**: Tailwind CSS + `shadcn/ui` + Base UI
- **Animations**: Framer Motion
- **Maps**: Leaflet (`react-leaflet`)
- **Real-time**: Pusher
- **Charts**: Recharts

## 📦 Local Setup

1. **Clone & Install**
   ```bash
   git clone <your-repo>
   cd urban-services-demo
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_PUSHER_KEY="mock_key"
   NEXT_PUBLIC_PUSHER_CLUSTER="mock_cluster"
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to view the application. Use the **Demo Role** dropdown in the header to switch between Customer, Professional, and Admin views.

## ☁️ Vercel Deployment

This project is pre-configured for one-click Vercel deployment. The `package.json` includes custom scripts to ensure Prisma generates and migrates your database during the build phase:

1. Push your code to a GitHub repository.
2. Log into [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Expand the **Environment Variables** section and add your `.env` variables (e.g., `DATABASE_URL`, `NEXT_PUBLIC_PUSHER_KEY`).
5. Click **Deploy**. Vercel will automatically run the `vercel-build` script (`prisma migrate deploy && next build`).

## 📄 License
MIT
