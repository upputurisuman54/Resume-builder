Smart Resume Builder with AI Suggestions 

An AI-powered full-stack resume builder application that helps users create professional resumes with smart content suggestions, skill gap analysis, live preview, and one-click PDF export.

Sign in page:

![signin page](https://github.com/upputurisuman54/Resume-builder/blob/main/Screenshot%202026-05-23%20213145.png?raw=true)

Form page:

![form page](https://github.com/upputurisuman54/Resume-builder/blob/main/Screenshot%202026-05-23%20212957.png?raw=true)

Preview page:

![preview page](https://github.com/upputurisuman54/Resume-builder/blob/main/Screenshot%202026-05-23%20213222.png?raw=true)

AI Suggestions page:

![Ai suggestions](https://github.com/upputurisuman54/Resume-builder/blob/main/Screenshot%202026-05-23%20213043.png?raw=true)

 Features:
- JWT Authentication & Role-Based Authorization
- AI-Powered Resume Content Suggestions
- Skill Gap Analysis
- Resume Creation & Management
- Live Resume Preview
- One-Click PDF Download
- Responsive React Frontend
- RESTful API Architecture
- MySQL Relational Database Integration
- Spring Security Configuration
- Tech Stack
Backend:
Java
Spring Boot
Spring Security
JWT Authentication
REST APIs
Maven
MySQL
Frontend:
React.js
Axios
HTML5
CSS3
JavaScript
PDF Generation
iText PDF
 Project Architecture
Frontend (React)
       ↓
REST APIs
       ↓
Spring Boot Backend
       ↓
MySQL Database

 Database Design :

The project uses 7 relational tables for managing:

-Users
-Roles
-Resumes
-Education
-Skills
-Experience
-Projects

 Major Functionalities :

-Authentication & Security
-User Registration & Login
-JWT Token-Based Authentication
-Role-Based Access Control
-Secure API Endpoints
-Resume Builder
-Add/Edit/Delete Resume Sections
-Dynamic Resume Templates
-Real-Time Preview
-PDF Resume Export
-AI Features
-Resume Content Suggestions
-Skill Recommendations
-Skill Gap Analysis

 Installation & Setup

1) Clone Repository
git clone https://github.com/upputurisuman54/Resume-builder.git
2️) Backend Setup
Navigate to backend folder
cd backend

Configure MySQL Database

Update application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/resume_builder
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
Run Spring Boot Application
mvn spring-boot:run

Backend runs on:

http://localhost:8080
3️) Frontend Setup

Navigate to frontend folder

cd frontend

Install Dependencies:

npm install

Start React Application:

npm start

Frontend runs on:

http://localhost:3000

 REST API Endpoints
 
Method	Endpoint	Description

POST	/api/auth/register	Register User

POST	/api/auth/login	Login User

GET	/api/resume	Get Resume

POST	/api/resume	Create Resume

PUT	/api/resume/{id}	Update Resume

DELETE	/api/resume/{id}	Delete Resume

 Future Enhancements:
 
Multiple Resume Templates

AI Resume Scoring

ATS Compatibility Checker

Cloud Deployment

Resume Sharing Link

Drag & Drop Resume Sections

Author:

Suman Upputuri
Gmail:upputurisuman53@gmail.com
LinkedIn:www.linkedin.com/in/upputurisuman





