# Memora - MERN Stack Notes Management Application
A production-structured full-stack application for creating, organizing, and managing notes with integrated authentication, automated testing, and CI/CD pipelines.

**Frontend Repo:** `./frontend`

**Backend Repo:** `./backend`

# 🚀 Overview
Memora is a professional notes management tool built with the MERN stack (MongoDB, Express, React, Node.js). It features a robust middleware architecture and focuses on high code quality through SonarQube analysis and comprehensive unit testing for both frontend and backend.

# ✨ Key Features
## Authentication & Security
- ✅ Secure Login: JWT-based authentication for protected API routes.

- ✅ Password Encryption: Industry-standard hashing using `bcrypt`.

- ✅ Session Management: Persistent user sessions and secure logout.

- ✅ Protected Routes: Frontend and backend guards to prevent unauthorized access.

## Notes Management
- ✅ Full CRUD Functionality: Create, Read, Update, and Delete notes seamlessly.

- ✅ RESTful API: Structured endpoints for efficient data handling.

- ✅ Organized Storage: Scalable MongoDB schemas for user-specific data.

- ✅ Search & Filter: Quickly locate specific notes within the database.

## DevOps & Quality Assurance
- ✅ Automated Testing: * Backend: Unit and integration tests using Mocha.

  - Frontend: Modern component testing with Vitest.

- ✅ Code Coverage: Full reporting enabled via NYC and LCOV.

- ✅ CI/CD Integration: GitHub Actions pipeline for automated builds.

- ✅ Code Quality: Integrated SonarQube analysis for static code checks.

- ✅ Structured Logging: Production-grade logging using Pino.

# 🛠 Tech Stack
## Frontend
- **Framework:** React with Vite

- **Routing:** React Router

- **State/API:** Axios

- **Testing:** Vitest

## Backend
- **Server:** Node.js & Express.js

- **Database:** MongoDB & Mongoose

- **Auth: JWT** (jsonwebtoken)

- **Logging:** Pino

# 📂 Project Structure
```
root/
├── backend/              # Express API & Middleware
│   ├── controllers/      # Route logic
│   ├── middlewares/      # Auth & Error handlers
│   ├── models/           # Mongoose schemas
│   └── tests/            # Mocha test suites
│
├── frontend/             # React Application
│   ├── src/              # Components & Logic
│   └── __tests__/        # Vitest suites
│
└── .github/              # CI/CD Workflows
```

# ⚙️ Running the Project
## Backend
1. `cd backend`

2. `npm install`

3. `npm start`

## Frontend
1. `cd frontend`

2. `npm install`

3. `npm run dev`

# 🧪 Testing & Quality Assurance
Comprehensive testing is integrated into both the frontend and backend to ensure application stability and code reliability.

## Backend Testing (Mocha & NYC)
- ✅ **Unit Testing:** Individual route handlers and controllers are tested using **Mocha** and **Chai**.

- ✅ **Integration Testing:** API endpoints are validated for correct status codes and data responses.

- ✅ **Coverage Reporting:** Detailed code coverage metrics are generated using **NYC**.

- ✅ **Execution:**

  1. `cd backend`
  2. `npm test`
 
## Frontend Testing (Vitest)
- ✅ **Component Testing:** UI components are tested in isolation using **Vitest**.

- ✅ **Logic Validation:** Utility functions and state transitions are verified for consistency.

- ✅ **Coverage Reporting:** Full coverage dashboards are enabled through Vitest's built-in reporter.

- ✅ **Execution:**

  1. `cd frontend`
  2. `npm run test:coverage`
 
## Code Quality & CI/CD
- ✅ **SonarQube Analysis:** Automated static code analysis to detect bugs, vulnerabilities, and code smells.

- ✅ **LCOV Reporting:** Test results are exported in LCOV format for seamless integration with quality gates.

- ✅ **GitHub Actions:** Every push triggers an automated build and test pipeline to ensure no regressions are introduced.

## Testing & DevOps Tools
- **Runner:** Mocha (Backend), Vitest (Frontend)

- **Coverage:** NYC, LCOV

- **Quality**: SonarQube

- **Pipeline:** GitHub Actions

- **Logging:** Pino (Structured Logging)

# 👤 Author
Abdullah Mohammad Rashid

[Visit My GitHub](https://github.com/Axplicit)

[My LinkedIn](https://www.linkedin.com/in/abdullah-m-rashid-816baa24a)

Last Updated: February 2026.


