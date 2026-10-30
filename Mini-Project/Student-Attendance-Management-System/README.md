# Student Attendance & Leave Management System

A simple, lightweight full-stack web application built strictly with core FSWD technologies:
**HTML/CSS, JavaScript, React components, Forms, REST API (Node.js & Express), CRUD operations, and MongoDB.**

---

## 🚀 Features

### 🎓 Student Features:
- **Student Registration & Login** (with roll number & department).
- **Attendance Dashboard:** Overall attendance percentage KPI, classes attended vs missed.
- **Subject-wise Attendance:** Visual progress indicators for individual courses (Data Structures, DBMS, Web Tech, OS).
- **Leave Request Management:** Submit leave applications with date range and reason.
- **Leave Status Tracking:** Real-time status badges (`Pending`, `Approved`, `Rejected`) and faculty remarks.

### 👨‍🏫 Faculty Features:
- **Faculty Login.**
- **Mark Class Attendance:** Select subject & date, toggle Present/Absent for students, and submit.
- **Leave Approval System:** Review student leave applications and 1-click **Approve** or **Reject**.
- **Search Student Records:** Instant lookup by Name or Roll Number with detailed attendance reports.

---

## 📁 Project Structure

```text
Student-Attendance-Management-System/
├── server/                    # Node.js + Express REST API
│   ├── models/                # MongoDB Collections (Student, Attendance, LeaveRequest)
│   ├── routes/                # REST API CRUD Routes (auth, attendance, leaves, students)
│   ├── db.js                  # MongoDB Mongoose Connection
│   ├── seed.js                # Initial Demo Database Seeder
│   ├── server.js              # Express App & Middlewares
│   └── package.json
│
└── client/                    # React (Vite)
    ├── src/
    │   ├── components/        # Navbar, StatCard, LeaveStatusBadge
    │   ├── pages/             # Login, Register, StudentDashboard, FacultyDashboard
    │   ├── App.jsx            # Main view switcher & auth state
    │   ├── App.css            # Custom CSS Styling (Flexbox, Grid, Cards)
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## 🛠️ How to Run Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI

### 2. Start the Backend Server
```bash
cd server
npm install
npm run seed      # (Optional) Seed demo accounts and attendance logs
npm start         # Runs on http://localhost:5000
```

### 3. Start the React Frontend
```bash
cd client
npm install
npm run dev       # Runs on http://localhost:3000
```

---

## 🔑 Demo Accounts (After running `npm run seed`)

| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `john@student.edu` | `password123` | Roll No: `CS2024-001` |
| **Student** | `jane@student.edu` | `password123` | Roll No: `CS2024-002` |
| **Faculty** | `faculty@college.edu` | `password123` | CS Department |
