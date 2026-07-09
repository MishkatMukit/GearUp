# GearUp Backend

GearUp is a premium Gear Rental and Sharing Platform where users can sign up as customers to rent premium gear, or as providers to list their gear for rental. This repository houses the robust and scalable Node.js + Express.js backend for GearUp, built with TypeScript, Prisma ORM, and integrated with Stripe for seamless, secure payments.

---

## 🚀 Key Features

- **Robust User Authentication & Management**:
  - Secure registration, login, and profile updates.
  - Role-Based Access Control (RBAC) with three primary roles: `CUSTOMER`, `PROVIDER`, and `ADMIN`.
  - Secure JWT authentication with Access and Refresh tokens (with automatic refresh handling).
- **Comprehensive Gear Catalog**:
  - Providers can list, update, and soft/hard delete gear.
  - Customers can browse all available gear, filter by category, and view detailed listings.
- **Rental Reservation System**:
  - Customers can place reservations/rentals by specifying a date range (`startDate`, `endDate`) and quantity.
  - Automatic calculation of rental duration (days) and total price based on the gear's daily pricing.
  - Multi-state rental order lifecycle management: `PLACED`, `CONFIRMED`, `PAID`, `PICKED_UP`, `RETURNED`, `CANCELLED`.
- **Secure Stripe Payment Integration**:
  - Seamless Stripe Checkout/Payment Intent creation.
  - Live order updates via Stripe Webhooks (secure signature verification).
- **Reviews & Ratings**:
  - Customers can submit reviews and star ratings for gear items they have rented.
- **Admin Control Panel**:
  - Admins can manage all users, update status (`ACTIVE`, `SUSPENDED`), and monitor all gear listings and rental orders.

---

## 🛠️ Tech Stack & Libraries

- **Runtime Environment**: [Node.js](https://nodejs.org/)
- **Web Framework**: [Express.js](https://expressjs.com/) (v5.x)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`
- **Validation**: [Zod](https://zod.dev/) (Request payload validation)
- **Payment Processing**: [Stripe Node SDK](https://stripe.com/)
- **Bundler & Dev Tools**: [tsup](https://tsup.egoist.dev/) & [tsx](https://github.com/privatenumber/tsx)

---

## 📁 Directory Structure

```text
gear-up-backend/
├── prisma/
│   ├── migrations/         # Database migrations
│   └── schema/             # Split Prisma schema files
│       ├── category.prisma
│       ├── enums.prisma
│       ├── gearItem.prisma
│       ├── payment.prisma
│       ├── profile.prisma
│       ├── rental.prisma
│       ├── review.prisma
│       ├── schema.prisma
│       └── user.prisma
├── src/
│   ├── Interfaces/         # Interface definitions
│   ├── config/             # Environment variables setup
│   ├── lib/                # Database/Prisma client utility
│   ├── middleware/         # Auth guard, error and router handlers
│   ├── modules/            # Domain modules (routes, controllers, services)
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── category/
│   │   ├── gear/
│   │   ├── payment/
│   │   ├── provider/
│   │   ├── rental/
│   │   ├── review/
│   │   └── users/
│   ├── utils/              # Helper utilities
│   ├── validations/        # Zod request validator schemas
│   ├── app.ts              # Express application configuration
│   └── server.ts           # Server runner/listener
├── .env.example            # Environment variables template
├── package.json            # Scripts & dependencies
├── tsconfig.json           # TypeScript configuration
└── tsup.config.js          # tsup build configuration
```

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) database
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (for local webhook testing)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd gear-up-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and copy the contents of `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Fill in your local PostgreSQL database URL, JWT secrets, and Stripe API keys in the `.env` file.

### Database Setup & Prisma Generation

Generate the Prisma Client and sync the database schema:
```bash
npx prisma generate
npx prisma db push
```

### Running the Server

#### Development Mode
Run the development server with hot-reloading:
```bash
npm run dev
```
The server will start on the port configured in `.env` (default is `3000` or `5000`).

#### Production Build
Build the TypeScript code into JavaScript using `tsup` and start:
```bash
npm run build
npm start
```

---

## 💳 Stripe Webhook Testing

To listen and forward Stripe events to your local server during development:

1. Log in to Stripe CLI:
   ```bash
   stripe login
   ```
2. Start the webhook listener forwarding to the backend confirmation endpoint:
   ```bash
   npm run stripe:webhook
   ```
3. Copy the webhook signing secret (starts with `whsec_`) printed in the Stripe CLI console and paste it into the `STRIPE_WEBHOOK_SECRET_KEY` field in your `.env` file.

---

## 🛣️ API Endpoints

### 🔐 Authentication & Users
| Method | Endpoint | Access Control | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user (`CUSTOMER` or `PROVIDER`) |
| `POST` | `/api/auth/login` | Public | Log in and receive access token (cookie/body) |
| `POST` | `/api/auth/refresh-token` | Public | Refresh expired access tokens |
| `GET` | `/api/users/profile` | Authenticated | View authenticated user profile |
| `PATCH` | `/api/users/profile` | Authenticated | Update user profile and info |

### 📂 Categories & Gear
| Method | Endpoint | Access Control | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Public | List all gear categories |
| `POST` | `/api/categories` | `ADMIN` | Create a new gear category |
| `GET` | `/api/gear` | Public | Fetch all gear listings with filters |
| `GET` | `/api/gear/:id` | Public | Get details of a specific gear item |

### 🛠️ Provider Actions
| Method | Endpoint | Access Control | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/provider/gear` | `PROVIDER` | Add a new gear item listing |
| `PUT` | `/api/provider/gear/:id` | `PROVIDER` | Update details of a listed gear item |
| `DELETE` | `/api/provider/gear/:id`| `PROVIDER` | Delete a listed gear item |
| `GET` | `/api/provider/orders` | `PROVIDER` | View all rental orders placed for provider's gear |
| `PATCH` | `/api/provider/orders/:id`| `PROVIDER` | Update rental order status (e.g. `PICKED_UP`, `RETURNED`) |

### 🛒 Rentals & Reviews
| Method | Endpoint | Access Control | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/rentals` | `CUSTOMER` | Book/rent a gear item |
| `GET` | `/api/rentals` | `CUSTOMER` | Fetch customer's own rental history |
| `GET` | `/api/rentals/:id` | `CUSTOMER` | Fetch specific rental details |
| `PATCH` | `/api/rentals/:id/cancel`| `CUSTOMER` | Cancel a rental before booking starts |
| `POST` | `/api/reviews` | `CUSTOMER` | Review/rate a gear item (requires active rental) |

### 💳 Payments
| Method | Endpoint | Access Control | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/create` | `CUSTOMER` | Initialize a Stripe session for a rental order |
| `POST` | `/api/payments/confirm`| Public (Stripe Webhook)| Stripe webhook listener to verify and confirm payments |
| `GET` | `/api/payments` | `CUSTOMER` | View payment history of customer |
| `GET` | `/api/payments/:id` | `CUSTOMER` / `ADMIN`| Get specific payment details |

### 👑 Admin Controls
| Method | Endpoint | Access Control | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | `ADMIN` | Retrieve all registered users |
| `PATCH` | `/api/admin/users/:id` | `ADMIN` | Suspend or reactivate user account |
| `GET` | `/api/admin/gear` | `ADMIN` | Monitor all gear items across providers |
| `GET` | `/api/admin/rentals` | `ADMIN` | Retrieve all platform rental transactions |

---

## 📝 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
