# PrintCraft Frontend

A modern React + Vite + TypeScript frontend for a printing and custom design business platform.

## Tech Stack

- React 19 + TypeScript
- Vite (fast build tool)
- React Router v6
- Tailwind CSS
- Zustand (state management)
- React Hook Form + Zod (forms & validation)
- Axios (API client)
- Recharts (charts)
- Sonner (notifications)
- Lucide Icons

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Dev server runs at: `http://localhost:5173`

## Project Structure

```
src/
├── pages/                 # Page components
│   ├── public/           # Marketing pages
│   ├── auth/             # Login, Register, etc.
│   ├── dashboard/        # Customer dashboard
│   └── admin/            # Admin dashboard
├── components/           # Reusable components
│   ├── layout/
│   ├── forms/
│   └── ui/
├── routes/               # Route definitions
├── services/             # API services
├── store/                # Zustand stores
├── types/                # TypeScript types
├── utils/                # Utilities & helpers
├── styles/               # Global styles
├── App.tsx
└── main.tsx
```

## Routes

**Public**: `/`, `/products`, `/services`, `/pricing`, `/about`, `/contact`

**Auth**: `/login`, `/register`, `/forgot-password`, `/verify-otp`

**Dashboard**: `/dashboard`, `/dashboard/orders`, `/dashboard/quotations`, `/dashboard/account`

**Admin**: `/admin`, `/admin/orders`, `/admin/customers`, `/admin/products`, `/admin/payments`

## Environment Variables

Create `.env` in the project root:

```env
VITE_API_URL=http://localhost:3000/api
```

## State Management

Three Zustand stores:
- `useAuthStore()` - Authentication
- `useProductStore()` - Products & catalog
- `useOrderStore()` - Orders & quotations

## API Services

Located in `src/services/`:
- `api.ts` - HTTP client
- `auth.service.ts` - Auth operations
- `product.service.ts` - Products
- `order.service.ts` - Orders
- `payment.service.ts` - Payments
- `upload.service.ts` - File uploads
