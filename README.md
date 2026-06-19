# Smart Resume Builder with AI Suggestions

An AI-powered full-stack resume builder that helps users create professional resumes with smart content suggestions, skill gap analysis, live preview, and one-click PDF export.

🔗 **Live Demo:** [resume-builder-lilac-mu.vercel.app](https://resume-builder-lilac-mu.vercel.app)

---

## Screenshots

| Sign In | Resume Form |
|--------|-------------|
| ![Sign In](https://github.com/upputurisuman54/Resume-builder/blob/main/Screenshot/Sign%20in.png?raw=true) | ![Form](https://github.com/upputurisuman54/Resume-builder/blob/main/Screenshot%20/ResumeForm.png?raw=true) |

| Live Preview | AI Suggestions |
|-------------|----------------|
| ![Preview](https://github.com/upputurisuman54/Resume-builder/blob/main/Screenshot%202026-05-23%20213222.png?raw=true) | ![AI](https://github.com/upputurisuman54/Resume-builder/blob/main/Screenshot%202026-05-23%20213043.png?raw=true) |

---

## Features

- JWT Authentication with Role-Based Access Control
- AI-Powered Resume Content Suggestions
- Skill Gap Analysis
- Resume Creation, Editing, and Management
- Live Resume Preview
- One-Click PDF Download
- Responsive React Frontend
- RESTful API Architecture

---

## Tech Stack

**Backend**
- Java 17
- Spring Boot 3
- Spring Security
- JWT Authentication
- Spring Data JPA / Hibernate
- MySQL
- Maven

**Frontend**
- React.js
- Axios
- HTML5 / CSS3 / JavaScript

**PDF Generation**
- OpenHTMLtoPDF

---

## Project Architecture

```
React Frontend
      ↓
REST APIs (Spring Boot)
      ↓
Service & Repository Layer
      ↓
MySQL Database
```

---

## Database Design

The application uses 7 relational tables:

| Table | Purpose |
|-------|---------|
| users | Stores user accounts |
| roles | Role definitions (USER, ADMIN) |
| resumes | Resume metadata per user |
| education | Education section entries |
| skills | Skills associated with resumes |
| experience | Work experience entries |
| projects | Project entries |

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js and npm
- MySQL

### 1. Clone the Repository

```bash
git clone https://github.com/upputurisuman54/Resume-builder.git
cd Resume-builder
```

### 2. Backend Setup

Configure your MySQL database in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/resume_builder
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Run the backend:

```bash
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and receive JWT |
| GET | /api/resume | Get user's resume |
| POST | /api/resume | Create a new resume |
| PUT | /api/resume/{id} | Update resume |
| DELETE | /api/resume/{id} | Delete resume |

---

## Planned Enhancements

- Multiple resume templates
- AI resume scoring
- ATS compatibility checker
- Cloud deployment (AWS / Railway)
- Shareable resume link
- Drag and drop resume sections

---

## Author

**Upputuri Suman** — Java Full Stack Developer

- 📧 [upputurisuman53@gmail.com](mailto:upputurisuman53@gmail.com)
- 💼 [linkedin.com/in/upputurisuman](https://www.linkedin.com/in/upputurisuman)
- 🐙 [github.com/upputurisuman54](https://github.com/upputurisuman54)
