# bharathproject

# Salem Cycle Marathon 2026 | Kauvery Hospital Salem

Official web application and registration platform for the **Salem Cycle Marathon 2026** hosted at **Kauvery Hospital, Salem** on **30 October 2026**.

Built with a luxury editorial aesthetic (inspired by warm linen, gold accents, and serif typography), fluid vanilla CSS responsive grids, and a Node.js + Express + MongoDB Atlas backend.

---

## 🚴 Key Features

1. **Multi-Universe Responsive Grid Architecture**:
   - Universal device support: mobile (320px–480px), tablets (768px–1024px), laptops (1280px–1440px), and 4K desktop screens (1920px+).
   - Zero horizontal overflow (`overflow-x: hidden`), clamped typography, and adaptive flex/grid columns.

2. **Direct UPI QR Scan & UTR Verification (Solution 2 - No PAN required)**:
   - Direct integration for **PhonePe** & **Google Pay** QR scans.
   - Payee: `Mr bharath` • UPI ID: `bharathkyrie8-1@oksbi`.
   - 12-digit UTR reference entry & screenshot upload proof.
   - Fallback gateway support for Razorpay test mode.

3. **Participant Registration Wizard**:
   - 3-step interactive flow: Category selection (21.1 KM, 10 KM, 5 KM) $\rightarrow$ Participant dossier & emergency medical contacts $\rightarrow$ Payment & entry pass generation.
   - Minor consent validation for participants under 18 years of age.
   - Printable participant entry pass with unique ticket ID.

4. **Executive Admin Operations Portal**:
   - Live analytics: revenue metrics, participant count, and distance distribution.
   - 1-click verification & approval queue for pending UPI UTR submissions.
   - Search & CSV export for race day kit expo distribution.

5. **Automated Dual Email Notifications (Nodemailer + Gmail SMTP)**:
   - **User Acknowledgment**: Warm linen branded receipt with race day itinerary and kit expo details.
   - **Organizer Alert**: Executive dark theme with participant contact dossier, pre-formatted message box, and 1-click reply action buttons.

6. **Interactive Gallery & Exhibition**:
   - High-definition photography with Bento mosaic layout and Museum Matting toggle.
   - Lightbox modal with shutter speed, elevation details, and mobile thumb navigation.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18 + Vite
  - Pure Vanilla CSS (custom tokens, zero external CSS framework bloat)
  - Framer Motion (page transitions and micro-interactions)
  - Lucide React (feather-weight vector icons)
  - Canvas Confetti (celebration feedback)
- **Backend**:
  - Node.js & Express
  - MongoDB Atlas (Mongoose ODM)
  - Nodemailer (Gmail SMTP)
  - Cloudinary (media & payment screenshot asset storage)
  - JWT & Cookie-parser (admin authentication)

---

## 🚀 Getting Started

### Prerequisites
- Node.js $\ge 18$
- npm $\ge 9$
- MongoDB Atlas cluster connection string
- Gmail App Password (for transactional email dispatch)

### Installation & Local Setup

1. **Clone repository**:
   ```bash
   git clone https://github.com/bharathkyrie8/bharathproject.git
   cd bharathproject
   ```

2. **Configure Backend Environment**:
   ```bash
   cd server
   cp .env.example .env
   # Edit .env and supply your MongoDB URI and Gmail SMTP credentials
   npm install
   npm run dev
   ```
   Backend service runs at: `http://localhost:5000`

3. **Configure Frontend Client**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
   Client application runs at: `http://localhost:5173`

4. **Build for Production**:
   ```bash
   cd client
   npm run build
   ```

---

## 🔒 Security Note
Private `.env` configuration files containing live database credentials and SMTP secrets are excluded from source control via `.gitignore`. Refer to [`server/.env.example`](file:///server/.env.example) for the required environment variable definitions.

---

## 📄 License
ISC © 2026 Bharath & Kauvery Hospital Salem. All rights reserved.
