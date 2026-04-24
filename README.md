# 💍 WedCraft – Digital Wedding Invitation Platform

WedCraft is a modern, full-stack web application that enables users to create, customize, and manage digital wedding invitations. It replaces traditional printed cards with elegant, eco-friendly, and interactive digital experiences.

---

## ✨ Overview

WedCraft simplifies the wedding invitation process by offering:
- Beautiful, customizable templates
- Easy sharing via link
- RSVP tracking
- Integrated payments
- Admin management system

---

## 🚀 Features

### 👤 User Features
- 🔐 Authentication (Email + Google OAuth)
- 🎨 Browse wedding invitation templates
- ✏️ Customize invitation details
- 📩 Share invitations via link
- ✅ RSVP tracking system
- 💳 Secure payment integration
- 🎟️ Apply discount coupons
- 📊 Invitation analytics

### 🛠️ Admin Features
- 📦 Template management
- 💰 Purchase tracking
- 🎟️ Coupon management
- 📊 Analytics dashboard

---


## 🏗️ Tech Stack

Frontend:
- Next.js
- Tailwind CSS
- TypeScript

Backend:
- Next.js API Routes
- JWT Authentication
- Google OAuth

Database:
- MongoDB

---

## 📁 Project Structure
```
wedcraft/
├── app/
│   ├── admin/          # Admin dashboard
│   ├── api/            # Backend API routes
│   ├── auth/           # Login / Signup pages
│   ├── catalog/        # Template browsing
│   ├── checkout/       # Payment flow
│   ├── contact/        # Contact page
│   └── page.tsx        # Landing page
│
├── components/         # Reusable UI components
├── public/             # Static assets
├── styles/             # Global styles
├── lib/                # Utility functions
├── models/             # Database models
│
├── package.json
├── next.config.ts
└── README.md
```

---


## 🔑 API Endpoints

### 🔐 Authentication
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/google`
- `POST /api/auth/logout`

### 💌 Invitations
- `POST /api/save-invite`
- `GET /api/user/invites`
- `POST /api/rsvp`
- `PUT /api/invite/update`

### 💳 Payments
- `POST /api/create-order`
- `POST /api/verify-payment`

### 🛠️ Admin
- `GET /api/admin/templates`
- `POST /api/admin/templates`
- `GET /api/admin/purchases`

### 📦 Other Services
- `POST /api/email`
- `POST /api/upload`
- `GET /api/analytics`
- `POST /api/coupon/apply`

---

## ⚙️ Installation

```bash
git clone https://github.com/your-username/wedcraft.git
cd wedcraft
npm install
npm run dev
```

---

## 📄 License

This project is **not open source**.

Copyright (c) 2026 Arshal Rejith  
All rights reserved.

This repository is provided for viewing and evaluation purposes only.  
No permission is granted to use, copy, modify, or distribute this code without explicit written permission.

---

## 👨‍💻 Author

Arshal Rejith
