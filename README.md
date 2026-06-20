# ⭐⭐ Live Demo Of Our Project

🔗 [Click Here to View Live Demo](https://loan-management-system-cdac.netlify.app)



# 🏦 LoanPro - Loan Management System

A comprehensive Loan Management System developed using **Spring Boot, Spring Security, Thymeleaf, Hibernate/JPA, MySQL, and Razorpay**. The application streamlines the loan application process, enables secure user authentication, loan tracking, document management, and online payment processing.

---

## 🚀 Features

### 👤 User Features

✅ User Registration and Login

✅ Secure Authentication using Spring Security

✅ Apply for Multiple Loan Types

✅ Upload Required Documents

✅ EMI Calculation

✅ Track Loan Application Status

✅ View Loan History

✅ Make Online Payments using Razorpay

✅ View Payment History

✅ Profile Management

---

### 👨‍💼 Admin Features

✅ Admin Dashboard

✅ View All Loan Applications

✅ Approve or Reject Loan Requests

✅ Manage Registered Users

✅ Monitor Loan Payments

✅ View Uploaded Documents

✅ Generate Reports and Statistics

---

## 🛠️ Tech Stack

### Backend

* Java 17
* Spring Boot
* Spring MVC
* Spring Security
* Spring Data JPA (Hibernate)

### Frontend

* Thymeleaf
* HTML5
* CSS3
* JavaScript

### Database

* MySQL

### Payment Gateway

* Razorpay

### Build Tool

* Maven

---

## 📁 Project Structure

```text
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
```

---

## 🗄️ Database Configuration

Create a MySQL database:

```sql
CREATE DATABASE loan_management_db;
```

Configure database credentials inside:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/loan_management_db
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/loan-management-system.git

cd loan-management-system
```

### 2️⃣ Install Dependencies

```bash
mvn clean install
```

### 3️⃣ Configure Database

Update the MySQL credentials in:

```text
src/main/resources/application.properties
```

### 4️⃣ Run the Application

```bash
mvn spring-boot:run
```

or run:

```text
LoanManagementApplication.java
```

from your IDE.

---

## 🌐 Application URL

```text
http://localhost:8080
```

---

## 🔒 Security Features

* Spring Security Authentication
* Role-Based Authorization (Admin/User)
* Password Encryption
* Session Management
* Input Validation
* Secure Route Protection

---

## 💳 Razorpay Integration

The application supports secure online loan payment processing through Razorpay.

Features include:

* Secure Payment Gateway
* Transaction Tracking
* Payment History
* EMI Payment Support

---

## 📄 Core Modules

### User Module

* Registration
* Login
* Profile Management

### Loan Module

* Loan Application
* Loan Approval Workflow
* Loan Status Tracking

### Document Module

* Document Upload
* Verification Support

### Payment Module

* Online Payments
* Payment Records
* Transaction Management

### Admin Module

* User Management
* Loan Management
* Payment Monitoring
* Reports & Analytics

---

## 📱 Application Screens

### Login & Registration

* Secure Login
* New User Registration
* Role-Based Access

### User Dashboard

* Loan Overview
* EMI Details
* Payment Tracking
* Document Upload

### Admin Dashboard

* Loan Management
* User Management
* Payment Monitoring
* Reports & Statistics

---

## 🐛 Troubleshooting

### Database Connection Error

✔ Ensure MySQL Server is running

✔ Verify database credentials

✔ Check database name configuration

---

### Application Startup Error

✔ Verify Java 17 is installed

✔ Run:

```bash
mvn clean install
```

✔ Refresh Maven Dependencies

---

### Razorpay Integration Error

✔ Verify Razorpay Key ID

✔ Verify Razorpay Secret Key

✔ Check application.properties configuration

---

## 📚 Future Enhancements

* Email Notifications
* Loan Eligibility Prediction
* PDF Report Generation
* SMS Alerts
* Loan Recommendation System

---

## 👨‍💻 Author

**Harshavardhan Latkar**

**Ritesh Singh**

**Vishal Rawat**

**Abhishek Kumar Singh**


Built with ❤️ using Spring Boot, Spring Security, Thymeleaf, MySQL, Hibernate, and Razorpay.

🚀 Happy Coding!
