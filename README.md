# Inventory Management System

A full-stack inventory management application built with Next.js, MongoDB, and Clerk authentication.

**Live Demo:** [https://inventory-management-akc5.vercel.app/](https://inventory-management-akc5.vercel.app/)

## Prerequisites

- Node.js 18 or higher
- MongoDB Atlas account (or local MongoDB instance)
- Clerk account for authentication

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory with the following variables:
```bash
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

Get your MongoDB connection string from MongoDB Atlas and your Clerk keys from the [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys).

## Running the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Removing Clerk Authentication

If you don't have Clerk Authentication, to remove clerk auth just delete the ClerkProvider wrapper in app/layout.tsx, remove the middleware.ts file, and remove the SignedIn/SignedOut checks in components/layout-wrapper.tsx. Also remove the NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY from .env.local.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- MongoDB with Mongoose
- Clerk Authentication
- Tailwind CSS
- React 19
