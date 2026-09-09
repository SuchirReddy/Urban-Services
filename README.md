<div align="center">

# 🏙️ Urbio Services

**A full-stack, real-time home service booking platform**

[![Next.js 16](https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

![Urbio Landing](/public/landingurbio.png)

*Urbio Services is a comprehensive clone of platforms like Urban Company, designed to demonstrate a robust, multi-tenant marketplace architecture.*

</div>

---

## 📖 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Local Setup](#-local-setup)
- [☁️ Vercel Deployment](#️-vercel-deployment)
- [📐 Architecture](#-architecture)

---

## ✨ Key Features

The platform features three distinct portals communicating in real-time via Pusher, ensuring a seamless experience for all users.

### 🧑‍💼 Customer Portal
- **Discover & Browse:** Explore various services and configure add-ons.
- **Seamless Booking:** Book appointments with ease and track professionals on a live map.
- **Instant Chat:** Communicate with professionals in real-time.

### 👨‍🔧 Professional Portal
- **Job Management:** A dedicated dashboard to receive job requests, accept/reject, and manage active jobs.
- **Status Updates:** Update job statuses effortlessly.
- **Earnings Tracker:** Monitor earnings and performance.

### 🛡️ Admin Dashboard
- **Comprehensive Control:** A central hub for managing Bookings, Professionals, and Services.
- **Visual Metrics:** Interactive charts powered by Recharts for data-driven insights.
- **CRUD Operations:** Full control over marketplace data.

### ⚡ Core Capabilities
- **Real-time Engine:** Built with Pusher for instant chat messaging, status updates, and new job push notifications.
- **Fluid UI:** Designed with Tailwind CSS, shadcn/ui components, and Framer Motion for beautiful page transitions and micro-interactions.

---

## 🛠️ Tech Stack

### Frontend & UI
| Category | Technology |
| :--- | :--- |
| **Framework** | ![Next.js 16](https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js&logoColor=white) |
| **Core** | ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) |
| **Styling** | ![Tailwind CSS v4](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white) ![Base UI](https://img.shields.io/badge/Base_UI-007FFF?style=for-the-badge) |
| **Animations** | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue) ![Lenis](https://img.shields.io/badge/Lenis-black?style=for-the-badge) |
| **Components** | ![Lucide React](https://img.shields.io/badge/Lucide_Icons-FF6C37?style=for-the-badge&logo=lucide&logoColor=white) ![Sonner](https://img.shields.io/badge/Sonner-black?style=for-the-badge) |
| **Data Viz** | ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge) ![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white) |

### Backend & Infrastructure
| Category | Technology |
| :--- | :--- |
| **Database** | ![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) |
| **Real-time** | ![Pusher](https://img.shields.io/badge/Pusher-white?style=for-the-badge&logo=pusher&logoColor=black) |

---

## 📦 Local Setup

Get the project running on your local machine in a few simple steps.

### 1. Clone & Install

```bash
git clone <your-repo>
cd urban-services-demo
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_PUSHER_KEY="mock_key"
NEXT_PUBLIC_PUSHER_CLUSTER="mock_cluster"
```

### 3. Database Setup

Initialize the database, run migrations, and seed initial data:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run Development Server

Start the Next.js development server:

```bash
npm run dev
```

> **Note:** Open `http://localhost:3000` to view the application. Use the **Demo Role** dropdown in the header to switch between Customer, Professional, and Admin views.

---

## ☁️ Vercel Deployment

This project is pre-configured for one-click Vercel deployment. The `package.json` includes custom scripts to ensure Prisma generates and migrates your database during the build phase.

1. Push your code to a GitHub repository.
2. Log into [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Expand the **Environment Variables** section and add your `.env` variables (e.g., `DATABASE_URL`, `NEXT_PUBLIC_PUSHER_KEY`).
5. Click **Deploy**. Vercel will automatically run the `vercel-build` script (`prisma migrate deploy && next build`).

---

## 📐 Architecture

Urbio Services leverages modern web technologies to deliver a scalable and responsive experience. The use of Next.js App Router allows for efficient server-side rendering and routing, while Prisma ensures type-safe database interactions. Real-time features are seamlessly integrated using Pusher, providing users with instant updates and communication channels.

---

<div align="center">
  <sub>Built with ❤️ for modern home services by Suchir Reddy.</sub>
</div>
