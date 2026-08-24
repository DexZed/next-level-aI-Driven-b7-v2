# FixItNow Frontend 🔧

**"Your Trusted Home Service Platform"**

---

## Project Overview

FixItNow is a modern, responsive **Next.js application** for a home services marketplace. Customers can browse available services, view technician profiles, and book qualified professionals for specific time slots. Technicians can build their service profiles, manage their availability via an interactive scheduler, and handle job bookings. Admins oversee the entire platform through a comprehensive moderation dashboard.

---

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (with React 19) – For server-side rendering, routing, and overall application architecture.
- **Database & ORM:** [Neon](https://neon.tech/) & [Drizzle ORM](https://orm.drizzle.team/) – Serverless PostgreSQL database paired with a lightweight, type-safe SQL ORM.
- **Authentication:** [Better Auth](https://better-auth.com/) – Comprehensive authentication and session management solution.
- **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/) – Utility-first CSS framework coupled with pre-built Tailwind component classes.
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) – Performant, flexible form state management with static type validation.
- **Payments:** [Stripe](https://stripe.com/) – Robust payment processing and subscription management.
- **Icons & Notifications:** [Lucide React](https://lucide.dev/) & [React Toastify](https://fkhadra.github.io/react-toastify/) – Modern icon set and clean toast notification popups.

---

## Roles & Permissions

| Role           | Description                  | Frontend UI Expectations                                                                                                                                                  |
| -------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Customer**   | Users who book home services | Public browsing, interactive time-slot selection for bookings, payment checkout flow, booking tracking dashboard, review submission.                                      |
| **Technician** | Service professionals        | Protected technician dashboard, profile/services setup forms, interactive availability calendar/scheduler UI, booking management table (accept/decline/complete actions). |
| **Admin**      | Platform moderators          | Protected admin dashboard, user management tables (ban/unban actions), global platform statistics, service category management UI.                                        |

---

## Features & UI/UX

### Public Features

- **Responsive Service Grid**: Display services and top-rated technicians with optimized images (`next/image`), ratings, and starting prices.
- **Advanced Search & Filter**: Sidebar or top-bar filters for service type, location, rating, and price range with real-time UI updates.
- **Technician Profile Page**: Comprehensive view with technician bio, skills, past reviews, and an interactive "Book Now" section (with date/time pickers).
- **Loading & Error States**: Skeleton loaders for data fetching and graceful `error.tsx` fallbacks.

### Customer Features

- **Auth Flows**: Registration and login forms with validation error messages.
- **Booking Flow**: Interactive UI to select a service, choose a technician, and pick an available time slot.
- **Payment Integration**: Seamless redirect to **Stripe Checkout** gateway after the technician accepts the booking.
- **Customer Dashboard**: View booking history (with status badges and a "Cancel" button for eligible bookings), payment history table, and a form to leave reviews after job completion.

### Technician Features

- **Technician Dashboard**: Overview of upcoming jobs, total earnings, and pending requests.
- **Profile & Services Management**: Forms to update skills, experience, pricing, and profile picture.
- **Availability Scheduler**: An interactive calendar or time-slot picker UI to set working hours and block out unavailable times.
- **Booking Management**: A dedicated table to view incoming requests with action buttons ("Accept", "Decline", "Mark In-Progress", "Mark Completed").

### Admin Features

- **Admin Dashboard**: Global overview of platform health (total users, active bookings, revenue).
- **User Management**: Data table of all users with search, pagination, and "Ban/Unban" action buttons.
- **Category Management**: UI to view, create, and manage service categories.

---

## Frontend Routes & Server Actions

> **Note on Architecture**: Please note that the backend functionality for these routes is implemented using **Next.js Server Actions** instead of traditional API route handlers. For detailed backend architecture, database schemas, and integration specifics, please refer to the `API_INTEGRATIONS.md` file located in the root project directory.

---
