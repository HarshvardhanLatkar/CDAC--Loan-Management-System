🏦 LoanPro - Loan Management System

A full-stack Loan Management System built using Spring Boot, Spring Security, Thymeleaf, JPA/Hibernate, MySQL, and Razorpay Integration.

LoanPro | Spring Boot | Thymeleaf | MySQL | Spring Security
📁 Project Structure

loan-management-system/
│
├── src/
│   ├── main/
│   │   ├── java/com/loanmanagement/
│   │   │
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   ├── RazorpayConfig.java
│   │   │   └── DataLoader.java
│   │   │
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── LoanController.java
│   │   │   ├── PaymentController.java
│   │   │   └── AdminController.java
│   │   │
│   │   ├── service/
│   │   │   ├── LoanService.java
│   │   │   ├── PaymentService.java
│   │   │   ├── DocumentService.java
│   │   │   └── CustomUserDetailsService.java
│   │   │
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── LoanRepository.java
│   │   │   ├── PaymentRepository.java
│   │   │   └── DocumentRepository.java
│   │   │
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Loan.java
│   │   │   ├── Payment.java
│   │   │   └── Document.java
│   │   │
│   │   ├── dto/
│   │   ├── enums/
│   │   └── LoanManagementApplication.java
│   │
│   └── resources/
│       ├── templates/
│       │   ├── admin/
│       │   ├── user/
│       │   ├── fragments/
│       │   ├── login.html
│       │   └── register.html
│       │
│       ├── static/
│       │   ├── css/
│       │   └── js/
│       │
│       ├── schema.sql
│       └── application.properties
│
├── test/
├── pom.xml
└── README.md

📋 Features

👤 User Features

✅ User Registration & Login
✅ Secure Authentication using Spring Security
✅ Apply for Loans
✅ Upload Required Documents
✅ Track Loan Status
✅ View Loan History
✅ EMI Calculation
✅ Online Payment Integration using Razorpay
✅ Payment History Tracking

👨‍💼 Admin Features

✅ Admin Dashboard
✅ View All Loan Applications
✅ Approve / Reject Loans
✅ Manage Users
✅ Monitor Payments
✅ Loan Statistics & Reports
✅ Review Uploaded Documents

🛠️ Tech Stack

Backend

Java 17
Spring Boot 3
Spring MVC
Spring Security
Spring Data JPA (Hibernate)

Frontend

Thymeleaf
HTML5
CSS3
JavaScript

Database

MySQL

Payment Gateway
Razorpay

Build Tool
Maven

🚀 Getting Started

Prerequisites
Java 17+
Maven
MySQL Server 8+
Spring Tool Suite (STS) / IntelliJ IDEA

1️⃣ Database Setup

Create a MySQL database:
CREATE DATABASE loan_management_db;
Update database credentials inside:
src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/loan_management_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

2️⃣ Clone the Repository
git clone https://github.com/your-username/loan-management-system.git
cd loan-management-system

3️⃣ Build the Project
mvn clean install

4️⃣ Run the Application
mvn spring-boot:run

or run:

LoanManagementApplication.java

from your IDE.

🌐 Application URL
http://localhost:8080

🔐 Security Features

✅ Spring Security Authentication
✅ Role-Based Access Control (Admin/User)
✅ Password Encryption
✅ Secure Session Management
✅ Input Validation
✅ Protection Against Unauthorized Access

💳 Payment Features

✅ Razorpay Payment Gateway Integration
✅ Secure Online Transactions
✅ Payment Tracking
✅ Transaction Records

📄 Database Entities

User
User Registration
Authentication
Role Management

Loan
Loan Amount
Interest Rate
Tenure
Status Tracking

Payment
Payment Records
Transaction Details
EMI Tracking
Document
Identity Verification
Loan Documentation
Secure Upload Storage

📱 Screenshots

Login & Registration
User Registration
Secure Login
Role-Based Access
User Dashboard
Loan Overview
Apply for Loan
Payment Tracking
Document Upload
Admin Dashboard
Manage Applications
User Management
Loan Approval System
Payment Monitoring

🐛 Troubleshooting
Database Connection Error

✔ Verify MySQL is running

✔ Check database credentials

✔ Ensure database exists

Application Not Starting

✔ Verify Java 17 is installed

✔ Run:

mvn clean install

✔ Check Maven dependencies

Razorpay Issues

✔ Verify Razorpay Key ID

✔ Verify Razorpay Secret Key

✔ Update credentials in:

application.properties
📄 License

This project is developed for educational and learning purposes.

👨‍💻 Author

Harshavardhan Latkar

Built with ❤️ using Spring Boot, Thymeleaf, MySQL, and Razorpay.

🚀 Happy Coding!
