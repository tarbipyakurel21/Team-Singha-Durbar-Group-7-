# Inventory Management System

A modern, full-stack inventory management application built with Next.js and MongoDB.

## Features

- 📦 **Product Management** - Complete CRUD operations for inventory products
- 🏷️ **Category Management** - Organize products with categories
- 📊 **Dashboard** - Real-time analytics and statistics
- 📈 **Reports** - Generate and export inventory reports
- ⚙️ **Settings** - User and system configuration
- 🔍 **Search & Filter** - Quick product and category search
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS, Radix UI
- **Database:** MongoDB Atlas (MongoDB)
- **ORM:** Mongoose

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd inventory-management/inventory-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster1.xxxxx.mongodb.net/csc317-project?retryWrites=true&w=majority
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
inventory-app/
├── app/
│   ├── api/              # API routes
│   │   ├── products/    # Product endpoints
│   │   └── categories/  # Category endpoints
│   ├── dashboard/        # Dashboard page
│   ├── reports/          # Reports page
│   ├── settings/         # Settings page
│   └── page.tsx          # Products page (home)
├── components/           # React components
│   ├── ui/              # UI components (buttons, dialogs, etc.)
│   └── ...              # Feature components
├── lib/
│   ├── database.ts      # Database functions
│   ├── mongodb.ts       # MongoDB connection
│   └── models/         # Mongoose models
└── data/                # (Deprecated - using MongoDB now)
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `GET /api/categories/[id]` - Get single category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

## Database

The application uses **MongoDB Atlas** for data storage. On first run, the system automatically:
- Creates the database (`csc317-project`)
- Creates collections (`categories`, `products`, `users`)
- Inserts sample data (5 categories, 3 products, 2 users)

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

The app is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Railway
- Render
- Any Node.js hosting platform

Make sure to set the `MONGODB_URI` environment variable in your hosting platform.

## License

Private project
