# LoanPro - Loan Management System

A full-stack loan management application built with **Node.js**, **React**, and **MySQL**.

![LoanPro](https://img.shields.io/badge/LoanPro-Loan%20Management-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.x-orange)

## 📁 Updated Project Structure

```
loan-management-system/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection pool
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Login/Register routes
│   │   ├── loans.js           # Loan CRUD routes
│   │   ├── payments.js        # Payment routes
│   │   ├── users.js           # User management routes
│   │   └── stats.js           # Dashboard statistics routes
│   ├── server.js              # Main Express server
│   ├── package.json
│   ├── database.sql           # MySQL schema (RUN THIS IN WORKBENCH!)
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Modal.js       # Reusable modal
│   │   │   │   ├── Sidebar.js     # Reusable sidebar
│   │   │   │   ├── StatCard.js    # Dashboard stat cards
│   │   │   │   └── StatusBadge.js # Status badges
│   │   │   ├── LoginPage.js       # Login/Register page
│   │   │   ├── UserDashboard.js   # User dashboard
│   │   │   └── AdminDashboard.js  # Admin dashboard
│   │   ├── context/
│   │   │   └── AuthContext.js     # Authentication context
│   │   ├── services/
│   │   │   └── api.js             # Axios API service
│   │   ├── App.js                 # Main app with routing
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## 🗄️ About database.sql

**IMPORTANT:** The `database.sql` file is just a SQL script. It does NOT work as a database by itself!

### You MUST run it in MySQL Workbench:
1. Open **MySQL Workbench**
2. Connect to your MySQL Server
3. Go to **File → Open SQL Script** → select `database.sql`
4. Click the ⚡ **Execute** button (lightning bolt)
5. This creates the `loan_management` database with all tables

This only needs to be done ONCE. After that, your Node.js backend connects to this database.

## 📋 Features

### User Features
- ✅ User registration and authentication
- ✅ Apply for different types of loans (Personal, Home, Car, Education, Business)
- ✅ Real-time EMI calculator
- ✅ View loan application status
- ✅ Make payments on approved loans
- ✅ View payment history
- ✅ Update profile information

### Admin Features
- ✅ Dashboard with loan statistics
- ✅ View all loan applications
- ✅ Approve or reject loan applications
- ✅ View all registered users
- ✅ Track all payments
- ✅ Generate reports

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router, Axios, React Toastify, React Icons
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

## 📁 Project Structure

```
loan-management-system/
├── backend/
│   ├── server.js          # Main server file with all routes
│   ├── package.json       # Backend dependencies
│   ├── database.sql       # MySQL database schema
│   └── .env.example       # Environment variables template
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── App.js         # Main React app with all components
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- MySQL Workbench (optional, for database management)
- npm or yarn

### 1. Database Setup

1. Open MySQL Workbench and connect to your MySQL server

2. Open the `backend/database.sql` file and execute it to:
   - Create the `loan_management` database
   - Create all required tables (users, loans, payments)
   - Insert default admin and user accounts

```sql
-- Or run from command line:
mysql -u root -p < backend/database.sql
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your MySQL credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=loan_management
# JWT_SECRET=your-secret-key
# PORT=5000

# Start the server
npm run dev   # Development mode with nodemon
# OR
npm start     # Production mode
```

The backend server will start at `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start at `http://localhost:3000`

## 🔑 Default Login Credentials

| Role  | Email           | Password  |
|-------|-----------------|-----------|
| Admin | admin@loan.com  | admin123  |
| User  | user@loan.com   | user123   |

## 📡 API Endpoints

### Authentication
| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| POST   | /api/auth/register | Register new user  |
| POST   | /api/auth/login    | Login user         |
| GET    | /api/auth/me       | Get current user   |

### Loans
| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| POST   | /api/loans                | Create loan application   |
| GET    | /api/loans/my-loans       | Get user's loans          |
| GET    | /api/loans                | Get all loans (Admin)     |
| GET    | /api/loans/:id            | Get single loan           |
| PATCH  | /api/loans/:id/status     | Update loan status (Admin)|

### Payments
| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| POST   | /api/payments             | Make a payment            |
| GET    | /api/payments/my-payments | Get user's payments       |
| GET    | /api/payments             | Get all payments (Admin)  |

### Users
| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | /api/users          | Get all users (Admin)    |
| PUT    | /api/users/profile  | Update user profile      |

### Statistics
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | /api/stats/user   | Get user dashboard stats |
| GET    | /api/stats/admin  | Get admin dashboard stats|

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes for admin-only access
- Input validation on both frontend and backend
- SQL injection prevention with parameterized queries

## 📱 Screenshots

### Login Page
- User/Admin role selection
- Registration form
- Demo credentials display

### User Dashboard
- Loan statistics overview
- Recent applications and payments
- Apply for new loans
- Make payments

### Admin Dashboard
- Overview statistics
- Loan status distribution
- Manage applications (approve/reject)
- View all users and payments
- Generate reports

## 🐛 Troubleshooting

### Database Connection Error
- Ensure MySQL server is running
- Check your .env file credentials
- Verify the database exists

### CORS Error
- Backend must be running on port 5000
- Frontend proxy is configured in package.json

### Login Issues
- Run the database.sql to create default users
- Password for default users is hashed - use the credentials above

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built with ❤️ for learning purposes.

---

**Happy Coding! 🚀**
