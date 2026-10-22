# Salem Cycle Marathon 2026 — Backend API Platform

A production-ready MERN stack backend built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)** for the **Salem Cycle Marathon 2026** Registration and Payment Platform.

---

## 📋 Table of Contents
1. [Event Configuration](#-event-configuration)
2. [Key Architecture & Features](#-key-architecture--features)
3. [Folder Structure](#-folder-structure)
4. [Environment Variables (.env)](#-environment-variables-env)
5. [Installation & Setup](#-installation--setup)
6. [Database Seeding](#-database-seeding)
7. [Running Automated Tests](#-running-automated-tests)
8. [Razorpay Payment Gateway Integration](#-razorpay-payment-gateway-integration)
9. [Automatic Registration Closure & Deadline Enforcement](#-automatic-registration-closure--deadline-enforcement)
10. [API Documentation](#-api-documentation)
11. [Postman Collection](#-postman-collection)
12. [Production Deployment Steps](#-production-deployment-steps)
13. [Frontend Integration Instructions](#-frontend-integration-instructions)

---

## 🚴 Event Configuration
- **Event Date:** 30 October 2026 (Race day assembly from 4:30 AM IST)
- **Registration Deadline:** 25 October 2026 at 11:00 PM IST (Asia/Kolkata)
- **Expo Venue:** Kauvery Hospital, Salem, #9/50, Trichy Main Road, Opp. Chandra Mahal, MGR Nagar, Seelanaickenpatti, Salem, Tamil Nadu – 636201
- **Google Maps Location:** [Kauvery Hospital Salem Map](https://maps.app.goo.gl/TSxqXnA53sUKqdsv9)
- **Expo Timings:** 28 & 29 October 2026 (9:00 AM – 6:00 PM IST) for Bib & Timing Chip distribution
- **Registration Categories:**
  - **21.1 KM (Half Marathon / Timed Ride):** Minimum age 18 — **₹699** (Includes Timing Chip)
  - **10 KM (Timed Ride):** Minimum age 16 — **₹499** (Includes Timing Chip, Guardian consent required if under 18)
  - **5 KM (Community Fun Ride):** Minimum age 12 — **₹349** (Non-timed, Guardian consent required if under 18)

---

## 🛡️ Key Architecture & Features
- **Strict Backend Price Calculation:** Prices are never accepted from the frontend; prices and amounts in paise are looked up and validated directly from the database `Category` model.
- **Accurate Age Calculation & Minor Safeguards:** Evaluates date of birth against the event date (30 Oct 2026) using Luxon with `Asia/Kolkata` timezone. Rejects under-age participants from 21.1 KM and mandates parent/guardian consent for participants under 18.
- **Cryptographic Payment Verification:** Razorpay HMAC-SHA256 signature verification (`order_id|payment_id` against `RAZORPAY_KEY_SECRET`) using constant-time buffer comparison (`crypto.timingSafeEqual`) to prevent timing attacks.
- **Idempotent Webhooks:** Webhook handler validates raw payload signatures and handles `payment.captured` and `payment.failed` idempotently. Duplicate callbacks or retries never trigger double-confirmations or corrupt counts.
- **Automated & Manual Closure:** Automatically rejects new registrations and payment orders after 25 October 2026 at 11:00 PM IST. Admins can also toggle closure manually with custom messaging.
- **Admin Panel & Security:** Bcrypt password hashing (12 rounds), JWT tokens stored in secure HTTP-only cookies or Authorization Bearer headers, rate limiting (Express Rate Limit), Helmet security headers, CORS origin protection, and administrative action audit logging.
- **Automated CSV Export:** Generates RFC 4180-compliant CSV exports with UTF-8 Byte Order Mark (`\uFEFF`) for immediate Microsoft Excel compatibility.

---

## 📂 Folder Structure

```
server/
├── .env.example                  # Environment variables template
├── .env                          # Local environment variables
├── package.json                  # Dependencies, scripts, and Jest config
├── server.js                     # Express application entry point & graceful shutdown
├── postman_collection.json       # Complete Postman Collection for all endpoints
├── README.md                     # Comprehensive backend documentation
└── src/
    ├── config/
    │   ├── db.js                 # MongoDB connection & reconnection handler
    │   ├── env.js                # Environment variable reader with defaults
    │   ├── mailer.js             # Nodemailer transporter with dev console fallback
    │   └── razorpay.js           # Razorpay SDK initialization & sandbox fallback
    ├── models/
    │   ├── Admin.js              # Admin schema with bcrypt hashing & comparePassword
    │   ├── AuditLog.js           # Administrative activity audit trail
    │   ├── Category.js           # Distance, price, timing, and min-age requirements
    │   ├── ContactMessage.js     # User inquiry submissions & admin inbox
    │   ├── Event.js              # Event settings, venue, schedule, countdown, benefits
    │   ├── Gallery.js            # Cycling photo showcase and media items
    │   ├── Payment.js            # Razorpay orders, payments, receipts, webhook logs
    │   └── Registration.js       # Participant details, guardian consent, status
    ├── controllers/
    │   ├── adminController.js    # Dashboard analytics, participant search, CSV export
    │   ├── authController.js     # Admin login, logout, profile, password change
    │   ├── categoryController.js # Category listings & admin CRUD
    │   ├── contactController.js  # Public inquiry submission & admin inbox management
    │   ├── eventController.js    # Public event details & manual registration toggle
    │   ├── galleryController.js  # Public gallery showcase & media management
    │   ├── paymentController.js  # Signature verification & webhook processing
    │   └── registrationController.js # Registration initiation & public status lookup
    ├── routes/
    │   ├── adminRoutes.js        # Protected administrative routes
    │   ├── authRoutes.js         # Authentication routes
    │   ├── categoryRoutes.js     # Category routes
    │   ├── contactRoutes.js      # Contact inquiry routes
    │   ├── eventRoutes.js        # Event configuration routes
    │   ├── galleryRoutes.js      # Gallery routes
    │   ├── index.js              # Master API router (/api/v1)
    │   ├── paymentRoutes.js      # Payment verification & webhook routes
    │   └── registrationRoutes.js # Registration initiation & lookup routes
    ├── middleware/
    │   ├── authMiddleware.js     # JWT & HTTP-only cookie authentication check
    │   ├── deadlineMiddleware.js # Enforces 25 Oct 2026 11:00 PM IST & manual closure
    │   ├── errorHandler.js       # Centralized error handler and 404 response
    │   └── rateLimiter.js        # DDoS & brute-force rate limiters
    ├── services/
    │   ├── auditService.js       # Records audit events in MongoDB
    │   ├── emailService.js       # Sends confirmation receipts and organizer alerts
    │   ├── paymentService.js     # Razorpay orders, signatures, and webhook events
    │   └── registrationService.js # Age check, duplicate prevention, pending creation
    ├── utils/
    │   ├── csvExporter.js        # CSV generation with UTF-8 BOM
    │   ├── idGenerator.js        # Generates unique registration IDs & receipt numbers
    │   ├── seed.js               # Database seeder for initial event, categories, admin
    │   └── timeUtils.js          # Asia/Kolkata timezone calculations & age evaluation
    └── tests/
        ├── marathon.test.js      # 15 automated integration tests with Jest & Supertest
        └── testHelper.js         # In-memory MongoDB server setup for self-contained tests
```

---

## ⚙️ Environment Variables (.env)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Port for Express server | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGODB_URI` | MongoDB Connection URI | `mongodb://127.0.0.1:27017/cycle_marathon_db` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `JWT_SECRET` | Secret key for JWT signing | `your_strong_jwt_secret_key` |
| `JWT_EXPIRES_IN` | Token validity duration | `7d` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | `...` |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Webhook Secret | `...` |
| `EVENT_TIMEZONE` | Timezone for deadline checks | `Asia/Kolkata` |
| `SMTP_HOST` | SMTP server for emails | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username / email | `...` |
| `SMTP_PASS` | SMTP application password | `...` |
| `SEED_ADMIN_EMAIL` | Default seed admin email | `admin@cyclemarathon.com` |
| `SEED_ADMIN_PASSWORD` | Default seed admin password | `AdminSecure2026!` |

---

## 🚀 Installation & Setup

1. **Clone and navigate to the server folder:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and Razorpay keys
   ```

4. **Seed database with initial categories, venue, and admin account:**
   ```bash
   npm run seed
   ```

5. **Start server in development mode (with auto-reload):**
   ```bash
   npm run dev
   ```

6. **Start server in production mode:**
   ```bash
   npm start
   ```

---

## 🧪 Running Automated Tests

The backend includes a comprehensive, self-contained automated test suite utilizing **Jest**, **Supertest**, and **mongodb-memory-server**. No running local MongoDB daemon is required to execute tests.

Run the test suite:
```bash
npm test
```

### Verified Test Cases (15/15 Passed):
- `GET /api/v1/health`: API health check.
- `GET /api/v1/event`: Event configuration, venue at Kauvery Hospital Salem, schedule, and countdown info.
- `GET /api/v1/categories`: Verification of 3 categories (21.1 KM @ ₹699, 10 KM @ ₹499, 5 KM @ ₹349).
- `POST /api/v1/registration/initiate`: Rejection of missing required fields.
- `POST /api/v1/registration/initiate`: Age validation (rejecting underage riders from 21.1 KM).
- `POST /api/v1/registration/initiate`: Minor guardian consent check (mandatory for riders under 18).
- `POST /api/v1/registration/initiate`: Successful registration initiation and backend Razorpay order creation.
- `Registration Closure`: Automatic rejection with HTTP 403 `REGISTRATION_CLOSED` when registration is closed.
- `POST /api/v1/payment/verify`: Cryptographic payment verification and registration status transition to `CONFIRMED`.
- `Duplicate Prevention`: Rejection of duplicate confirmed registrations for the same participant in the same category.
- `Admin Auth`: Rejection of invalid credentials (401).
- `Admin Auth`: Successful login returning JWT and secure HTTP-only cookie.
- `Admin Auth`: Rejection of unauthenticated requests to protected admin routes.
- `Admin Dashboard`: Analytics metrics, participant counts, category distributions, and revenue calculations.
- `CSV Export`: Export of participant data in RFC 4180 CSV format with UTF-8 BOM encoding.

---

## 💳 Razorpay Payment Gateway Integration

### Standard Checkout Workflow:
1. Participant fills registration form on frontend.
2. Frontend submits participant data to `POST /api/v1/registration/initiate`.
3. Backend validates age against category `minAge`, validates guardian consent if minor, checks slot availability, and creates a `PENDING_PAYMENT` registration.
4. Backend creates an order via Razorpay API (`amount` in paise = `priceInr * 100`, `currency` = `INR`, `receipt` = `registrationId`).
5. Backend returns `orderId`, `amount`, `currency`, and `keyId` to frontend.
6. Frontend opens Razorpay Checkout modal using `new window.Razorpay(options)`.
7. Upon successful payment on frontend, Razorpay modal returns `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.
8. Frontend sends these details to `POST /api/v1/payment/verify`.
9. Backend calculates expected HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET`:
   ```javascript
   crypto.createHmac('sha256', secret)
         .update(order_id + '|' + payment_id)
         .digest('hex');
   ```
10. If signatures match via constant-time buffer comparison, registration status is updated to `CONFIRMED`, payment status is set to `CAPTURED`, category registered count is incremented, and an HTML receipt email is dispatched.
11. If a webhook arrives from Razorpay (`POST /api/v1/payment/webhook`), it is processed idempotently using the raw body and `X-Razorpay-Signature`.

---

## ⏰ Automatic Registration Closure & Deadline Enforcement

- **Hard Deadline:** 25 October 2026 at 11:00 PM IST (`2026-10-25T23:00:00+05:30`).
- **Timezone:** Evaluated strictly using the `Asia/Kolkata` timezone.
- **Middleware:** `deadlineMiddleware.js` intercepts all calls to `POST /api/v1/registration/initiate`.
- **Manual Toggle:** Administrators can manually close or open registration at any time via `POST /api/v1/event/toggle-registration` with a custom announcement reason.
- **In-flight Payment Reconcile:** If a participant already has an order created prior to closure and completes valid payment, their payment verification is honored and confirmed. No new registrations or orders can be started after closure.

---

## 📖 API Documentation

### Public Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service health status |
| `GET` | `/api/v1/event` | Public event details, venue, countdown, benefits |
| `GET` | `/api/v1/categories` | Active registration categories with prices and age rules |
| `GET` | `/api/v1/gallery` | Published cycling event photos |
| `POST` | `/api/v1/contact` | Submit contact form inquiry |
| `POST` | `/api/v1/registration/initiate` | Validate participant, create pending registration & Razorpay order |
| `GET` | `/api/v1/registration/:registrationId` | Get registration status and confirmed receipt |
| `POST` | `/api/v1/registration/lookup` | Lookup registration IDs by email or phone |
| `POST` | `/api/v1/payment/verify` | Verify Razorpay payment signature & confirm registration |
| `POST` | `/api/v1/payment/failed` | Record payment cancellation or failure from client |
| `POST` | `/api/v1/payment/webhook` | Asynchronous Razorpay webhook listener |

### Administrative Endpoints (Require Admin JWT or Cookie)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate admin, returns JWT & HTTP-only cookie |
| `POST` | `/api/v1/auth/logout` | Invalidate admin cookie |
| `GET` | `/api/v1/auth/me` | Current authenticated admin profile |
| `PUT` | `/api/v1/auth/change-password` | Change admin password |
| `GET` | `/api/v1/admin/dashboard` | Overview statistics, revenue, categories, sizes |
| `GET` | `/api/v1/admin/participants` | Search, filter (status, category, dates), paginate participants |
| `GET` | `/api/v1/admin/participants/:id` | Full participant details, payment history, guardian info |
| `GET` | `/api/v1/admin/export-csv` | Download complete participant records in CSV format |
| `GET` | `/api/v1/admin/audit-logs` | Administrative audit trail logs |
| `PUT` | `/api/v1/event` | Update event config, venue, schedule, or benefits |
| `POST` | `/api/v1/event/toggle-registration` | Manually open or close registration with reason |
| `GET` | `/api/v1/categories/admin/all` | List all categories including inactive |
| `POST` | `/api/v1/categories` | Create new category |
| `PUT` | `/api/v1/categories/:id` | Update category details/pricing |
| `DELETE` | `/api/v1/categories/:id` | Deactivate category |
| `GET` | `/api/v1/gallery/admin/all` | Manage gallery showcase images |
| `POST` | `/api/v1/gallery` | Upload/add new gallery image |
| `PUT` | `/api/v1/gallery/:id` | Edit gallery image details |
| `DELETE` | `/api/v1/gallery/:id` | Remove gallery image |
| `GET` | `/api/v1/contact/admin/all` | View user inquiries |
| `PUT` | `/api/v1/contact/admin/:id` | Update inquiry status / internal notes |

---

## 📮 Postman Collection
Import the provided file `server/postman_collection.json` into Postman. It includes pre-configured environment variables, request bodies, and automated test scripts that capture `adminToken`, `orderId`, and `registrationId` automatically across sequential requests.

---

## 🌐 Production Deployment Steps

1. **Deploying to Render / Railway / AWS / DigitalOcean:**
   - Set Environment Variables:
     - `NODE_ENV=production`
     - `PORT=5000`
     - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/cycle_marathon?retryWrites=true&w=majority`
     - `CLIENT_URL=https://your-marathon-domain.com`
     - `RAZORPAY_KEY_ID=rzp_live_...`
     - `RAZORPAY_KEY_SECRET=...`
     - `RAZORPAY_WEBHOOK_SECRET=...`
     - `JWT_SECRET=...`
   - Run Build / Start Command:
     ```bash
     npm install --omit=dev
     npm run seed
     npm start
     ```
2. **Process Management with PM2:**
   ```bash
   pm2 start server.js --name "cycle-marathon-api" -i max
   ```

---

## 🎨 Frontend Integration Instructions (Awaiting Design Reference)

Per development rules, frontend layouts will be constructed once you provide the visual design reference. 

When you share the design reference:
1. We will initialize the Vite + React frontend in `client/`.
2. Connect the React frontend with Axios to the working backend at `http://localhost:5000/api/v1`.
3. Integrate Razorpay checkout script (`https://checkout.razorpay.com/v1/checkout.js`).
4. Implement Framer Motion transitions, countdown timer, interactive category cards, registration form with instant age validation, and the admin dashboard.
