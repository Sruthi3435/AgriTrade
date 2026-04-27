
# 🌾 AgriTrade — Smart Agricultural Marketplace

![React](https://img.shields.io/badge/Frontend-React-blue)
![Spring Boot](https://img.shields.io/badge/Backend-SpringBoot-green)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)
![Docker](https://img.shields.io/badge/Deployment-Docker-blueviolet)
![License](https://img.shields.io/badge/License-MIT-yellow)

AgriTrade is a full-stack web application that connects farmers and retailers directly, eliminating intermediaries and enabling efficient, transparent agricultural trade.

---

## 🚀 Overview

AgriTrade provides a digital marketplace where:

- 👨‍🌾 Farmers can list and manage crops  
- 🛒 Retailers can browse and purchase products  
- 🛠️ Admin can monitor, verify, and control the system  

The platform focuses on security, scalability, and real-time insights.

---
Frontend-https://sruthi3435.github.io/AgriTrade/

## 🔑 Demo Credentials

| Role     | Email                   | Password   |
|----------|-------------------------|------------|
| Admin    | admin@agriconnect.com  | Admin@123  |
| Farmer   | farmer@test.com        | 1234       |
| Retailer | retailer@test.com      | 1234       |

---

## 🧠 Key Features

### 🔐 Authentication & Authorization
- Secure login system  
- Role-Based Access Control (RBAC)  
- Session-based authentication using cookies (`JSESSIONID`)  

### 👨‍🌾 Farmer Module
- Add and manage crops  
- Track orders  
- Update product details  

### 🛒 Retailer Module
- Browse products  
- Place orders  
- View transaction history  

### 🛠️ Admin Module
- Approve/reject users  
- Manage platform activities  
- Full system control  

### 💬 Communication System
- Complaint/ticket-based support  
- Admin-user messaging  

### 📊 Analytics Dashboard
- Interactive charts  
- User & transaction insights  

### 💳 Payment Integration
- Cashfree (Sandbox mode)  
- Simulated transactions  

### 📑 Report Generation
- Export reports using jsPDF & html2canvas  

---

## 🛠️ Tech Stack

### 🎨 Frontend
- React (Vite)  
- JavaScript  
- CSS  
- React Router  
- Recharts  

### ⚙️ Backend
- Java 17  
- Spring Boot  
- Spring Security  
- Hibernate + JPA  
- REST APIs  

### 🗄️ Database
- MySQL  

### 🚀 Deployment
- Docker  
- GitHub Pages (Frontend)  
- Render (Backend)  

---

## 🏗️ Architecture

```

Frontend (React)
↓
REST APIs (Spring Boot)
↓
MySQL Database

```

---

## 📂 Project Structure

```

AgriTrade/
│── farm-fresh-frontend/     # Frontend (React)
│── src/                     # Backend source code
│── assets/                  # Static files
│── dockerfile               # Docker setup
│── pom.xml                  # Backend dependencies
│── package.json             # Frontend dependencies
│── index.html               # Entry point

````

---

## ⚙️ Local Setup

### Prerequisites
- Node.js (v18+)  
- Java 17  
- MySQL  

### Run Backend
```bash
./mvnw spring-boot:run
````

### Run Frontend

```bash
npm install
npm run dev
```

---

## 🔐 Security

* Cookie-based authentication
* Secure session handling
* Role-based authorization



## 🚀 Future Enhancements

* AI-based crop price prediction
* Mobile application (React Native)
* Multi-language support
* Real-time tracking with maps

---

## 📜 License

This project is licensed under the MIT License.

---

## 👩‍💻 Author

**Sruthi Ram**
GitHub:(https://github.com/Sruthi3435)

---

## ⭐ Support

If you found this project useful, consider giving it a star ⭐


