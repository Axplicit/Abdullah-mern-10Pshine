#MERN Notes App 

##Full-Stack Notes Management System with Authentication, Testing & CI 

##Overview 

A production-structured full-stack Notes Application built using the MERN stack  
(MongoDB, Express, React, Node.js) with middleware architecture, automated testing,  
CI/CD integration, and SonarQube code quality analysis. 

##Tech Stack 

Backend: 
- Node.js 
- Express.js 
- MongoDB 
- Mongoose 
- JWT (jsonwebtoken) 
- bcrypt 
- Mocha 
- NYC (coverage) 
- Pino (structured logging) 
 
Frontend: 
- React 
- Vite 
- Axios 
- React Router 
- Vitest (testing) 
- Coverage reporting enabled 
 
##DevOps / Quality: 
- GitHub Actions 
- SonarQube 
- LCOV coverage reporting 

##Core Features 

- JWT Authentication with protected routes 
- Centralized error handling 
- Structured logging 
- Backend & Frontend unit testing 
- Code coverage reporting 
- CI pipeline integration 
- RESTful API architecture 

##Project Structure 

root/ 
├── backend/ 
│   ├── controllers/ 
│   ├── middlewares/ 
│   ├── models/ 
│   ├── routes/ 
│   ├── utils/ 
│   ├── tests/ 
│   └── server.js 
├── frontend/ 
│   ├── src/ 
│   ├── __tests__/ 
│   ├── vite.config.js 
│   └── main.jsx 
└── .github/ 
    └── workflows/ 
        └── build.yml 

##Running the Project 

Backend: 
cd backend 
npm install 
npm start 
 
Frontend: 
cd frontend 
npm install 
npm run dev 

##Running Tests 

Backend: 
cd backend 
npm test 
 
Frontend: 
cd frontend 
npm run test:coverage 

##Author 

Abdullah Mohammad Rashid
