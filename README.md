# EduMark - Smart Student Attendance & Activity Management System

A full-stack web application for tracking student attendance and managing academic activity records, built with React, Node.js/Express, and MySQL.

## 📋 Features

### Student Management
- Add, view, and manage student records
- Centralized student database with attendance history

### Attendance Tracking
- Mark and update daily attendance
- View attendance records by student, date, or class
- Real-time sync with the database via phpMyAdmin/XAMPP

### Dashboard
- Consolidated view of attendance and activity statistics
- Quick access to student and attendance data

### Authentication
- Secure login system with token-based verification (JWT)
- Protected routes via middleware

## 🛠️ Technology Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MySQL (managed via XAMPP)
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **API Testing:** REST endpoints via Express routes

## 📁 Project Structure

```
ATTENDANCE_SYSTEM/
├── BACKEND + DATABASE/
│   └── backend/
│       ├── config/          # Database configuration
│       ├── middleware/      # Auth/token verification
│       ├── routes/          # API routes (students, attendance, dashboard, auth)
│       ├── database.sql     # Database schema
│       ├── server.js        # Entry point
│       └── .env             # Environment variables (not committed)
└── FRONTEND/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── data/             # Constants and static data
    │   └── pages/            # App pages (Login, Dashboard, Students, Attendance, Settings)
    └── vite.config.js
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js installed
- XAMPP (for MySQL database)

### Backend Setup
```bash
cd "BACKEND + DATABASE/backend"
npm install
# Create a .env file with your DB credentials (see .env.example if provided)
npm start
```
Backend runs on `http://localhost:5000`

### Frontend Setup
```bash
cd FRONTEND
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

### Database
1. Start XAMPP and enable MySQL
2. Import `database.sql` via phpMyAdmin to create the `edumark_db` database and its tables (`students`, `attendance`, `users`)

## 👤 Author

**Aayush Raj**
BCA Final Year Project (Session 2023–2026)
Cimage Professional College, Patna (affiliated with Aryabhatt Knowledge University)