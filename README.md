# PixelCart — Full Stack E-Commerce Platform

> A modern, full-stack e-commerce platform for premium mobiles and laptops, built with the MERN stack, Next.js 15, TypeScript, Tailwind CSS, Redux Toolkit, and Razorpay payment integration.

🌐 **Live Demo:** [pixel-cart-ecommerce.vercel.app](https://pixel-cart-ecommerce.vercel.app)
🔗 **Backend API:** [renewed-blessing-production-644a.up.railway.app](https://renewed-blessing-production-644a.up.railway.app)

> ⚠️ **Hosting Note:** Backend is hosted on Railway free tier which provides $5 credit (~2-3 months). After credit expires, backend will be migrated to Render free tier. Frontend on Vercel is permanently free.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Test Credentials](#test-credentials)
- [Author](#author)

---

## Overview

PixelCart is a production-ready e-commerce web application for premium electronics — mobiles and laptops from brands like Apple, Samsung, and OnePlus. It features passwordless OTP-based authentication via email, a full shopping cart, Razorpay payment gateway integration, product reviews and ratings, and a complete admin dashboard for product and order management.

Built as a portfolio project to demonstrate full-stack development skills across authentication, state management, payment integration, and deployment.

---

## Features

### Authentication
- Passwordless OTP-based authentication — no passwords stored anywhere
- OTP delivered to user email via Resend email service
- OTP expires in 10 minutes for security
- JWT token stored in HTTP-only cookie with 7-day session
- Role-based access control — `user` and `admin` roles

### Store
- Product listing with category filters — Mobiles and Laptops
- Sort by price low to high, high to low, and top rated
- Individual product detail page with full specifications
- Star rating and review system — one review per user per product
- Real-time average rating calculation on every new review
- In Stock and Out of Stock indicators

### Cart and Checkout
- Add to cart with quantity controls
- Persistent cart state via Redux Toolkit
- Order summary with itemwise price breakdown
- Razorpay payment gateway — test mode
- Order confirmation page after successful payment
- Order history page showing all past orders with status

### Admin Dashboard
- Protected admin-only routes with role verification
- Add new products with full specs, images, price, stock
- Edit existing products inline
- Delete products with confirmation
- View all orders with user details and payment status
- Stats overview — total products, orders, revenue

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | React framework, file-based routing, SSR |
| TypeScript | Type safety throughout codebase |
| Tailwind CSS | Utility-first responsive styling |
| Redux Toolkit | Global state management for cart and auth |
| Axios | HTTP client with automatic cookie handling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Cloud database and ODM |
| JWT (jsonwebtoken) | Stateless session authentication |
| Resend | Transactional OTP email delivery |
| Razorpay | Payment gateway integration |
| cors + cookie-parser | Cross-origin and cookie middleware |

### Infrastructure
| Service | Purpose | Plan |
|---|---|---|
| MongoDB Atlas | Cloud database | Free forever |
| Railway | Backend hosting | Free ($5 credit ~2-3 months) |
| Vercel | Frontend hosting | Free forever |
| Resend | Email service | Free (3000 emails/month) |

---

## Project Structure

```
PixelCart-Ecommerce/
├── client/                          ← Next.js frontend
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── verify-otp/page.tsx
│   │   ├── admin/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── order-success/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── product/[id]/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── ProductCard.tsx
│   ├── lib/
│   │   └── axios.ts
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   └── cartSlice.ts
│   │   ├── hooks.ts
│   │   └── index.ts
│   └── types/
│       └── index.ts
│
└── server/                          ← Express backend
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── orderController.js
    │   ├── productController.js
    │   └── reviewController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── Order.js
    │   ├── Product.js
    │   ├── Review.js
    │   └── User.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── orderRoutes.js
    │   ├── productRoutes.js
    │   └── reviewRoutes.js
    ├── utils/
    │   └── sendEmail.js
    └── server.js
```

---

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register with username and email, sends OTP |
| POST | `/send-otp` | Public | Request OTP for login |
| POST | `/verify-otp` | Public | Verify OTP, issues JWT cookie |
| POST | `/logout` | Public | Clears JWT cookie |

### Products — `/api/products`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Get all products, supports category and sort filters |
| GET | `/:id` | Public | Get single product by ID |
| POST | `/` | Admin | Create new product |
| PATCH | `/:id` | Admin | Update product fields |
| DELETE | `/:id` | Admin | Delete product |

### Orders — `/api/orders`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | User | Create Razorpay order |
| POST | `/verify-payment` | User | Verify payment signature and confirm order |
| GET | `/my-orders` | User | Get current user's orders |
| GET | `/all` | Admin | Get all orders with user details |

### Reviews — `/api/products/:id/reviews`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Get all reviews for a product |
| POST | `/` | User | Submit a review with star rating |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Resend account (free) — for OTP emails
- Razorpay account (free test mode)

### Clone and install

```bash
git clone https://github.com/akshitmalia/PixelCart-Ecommerce.git
cd PixelCart-Ecommerce
```

### Setup backend

```bash
cd server
npm install
```

Create `server/.env` — see [Environment Variables](#environment-variables).

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Setup frontend

```bash
cd client
npm install
```

Create `client/.env.local`:
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_test_key
```

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## Environment Variables

### `server/.env`

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pixelcartdb
JWT_SECRET=your_jwt_secret_key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

### `client/.env.local`

```
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
```

---

## Deployment

| Layer | Platform | URL | Notes |
|---|---|---|---|
| Frontend | Vercel | [pixel-cart-ecommerce.vercel.app](https://pixel-cart-ecommerce.vercel.app) | Free forever |
| Backend | Railway | [renewed-blessing-production-644a.up.railway.app](https://renewed-blessing-production-644a.up.railway.app) | Free $5 credit |
| Database | MongoDB Atlas | Cloud hosted | Free forever |
| Email | Resend | API based | 3000 emails/month free |

### Backend hosting note

Backend is currently on Railway free tier ($5 credit, approximately 2-3 months). After credit expires it will be migrated to Render free tier. Render free tier has a cold start delay of 30-50 seconds on first request after inactivity — this is expected behaviour.

### Deploy backend on Railway
1. Connect GitHub repo
2. Set Root Directory → `server`
3. Set Start Command → `node server.js`
4. Add all environment variables from `server/.env`
5. Generate domain under Settings → Networking

### Deploy frontend on Vercel
1. Connect GitHub repo
2. Set Root Directory → `client`
3. Framework → Next.js (auto detected)
4. Add `NEXT_PUBLIC_RAZORPAY_KEY_ID` environment variable

---

## Test Credentials

This project uses Razorpay in **test mode**. No real money is processed.

| Payment Method | Details |
|---|---|
| UPI | `success@razorpay` |
| Netbanking | Select any bank → click Success |
| Card | `4111 1111 1111 1111` · Any future expiry · Any CVV |

---

## Author

**Akshit Malia**

- GitHub: [@akshitmalia](https://github.com/akshitmalia)

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

> **Disclaimer:** PixelCart is a portfolio and prototype project built for learning and demonstration purposes. No real products are sold and no real transactions are processed. All payments use Razorpay test mode.
