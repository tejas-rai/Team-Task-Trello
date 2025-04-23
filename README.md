# QuickTasks (Team Task Tracker)

A simplified project-management tool that lets admins create teams, assign users, and manage tasks with comments. Built end-to-end with Node.js, Express, MongoDB on the backend, and React + Redux Toolkit on the frontend—complete with JWT auth, role-based access, and a polished, responsive UI.

---

## 🚀 Features

- **User roles**:  
  - **Admin**: manage teams & users, create/update tasks  
  - **Member**: view assigned tasks, update status, add comments  
- **Authentication**: register & login with JSON-Web-Tokens  
- **Team Management** (admin only):  
  - Create teams  
  - Add users to teams  
  - List teams & their members  
- **Task Management**:  
  - Create tasks with title, description, due date, priority, assignment, status  
  - List & filter tasks per team & user  
  - Update task status (To Do > In Progress > Done)  
  - Add comments to tasks  
- **Responsive UI**:  
  - React + Redux Toolkit + React Router  
  - react-hook-form for form state & validation  
  - CSS Modules for scoped, maintainable styles  
- **Error handling**: clean messages on invalid actions or inputs  

---

## 🛠️ Tech Stack

- **Backend**  
  - Node.js & Express  
  - MongoDB + Mongoose  
  - JWT authentication (`jsonwebtoken`)  
  - express-validator for request validation  
  - dotenv for environment variables  

- **Frontend**  
  - React (Vite)  
  - Redux Toolkit + React-Redux  
  - React Router v6  
  - react-hook-form  
  - Axios for API calls  
  - CSS Modules for styling  

- **Dev Tools**  
  - VS Code, Postman, Nodemon  
  - Git & GitHub  

---

## 📦 Getting Started

1. **Clone the repo**  
   ```bash
   git clone https://github.com/tejas-rai/Team-Task-Trello.git
   cd Team-Task-Trello

BACKEND SETUP:
cd server
npm install
cp .env.example .env
// Edit .env: set MONGO_URI, JWT_SECRET, PORT
npm run dev

FRONTEND SETUP:
cd ../client
npm install
npm run dev


BROWSE:
Frontend: http://localhost:5173/login
Backend API: http://localhost:5000/api

# PROJECT STRUCTURE:
/
├─ server/                   # Express backend
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ server.js
│  └─ .env
└─ client/                   # React frontend (Vite)
   ├─ src/
   │  ├─ components/        # Header, Card, Button, FormControls, Layout
   │  ├─ features/          # Redux slices (auth, teams, tasks, comments)
   │  ├─ pages/             # LoginPage, TeamsPage, TaskPage, etc.
   │  ├─ App.jsx
   │  └─ index.css
   └─ vite.config.js


# Test Coverage report: 
![image](https://github.com/user-attachments/assets/0a3ac627-53b9-4f17-b0d1-675d886e9a0b)
File | Statements | Branches | Functions | Lines
All files | 80.86% | 50% | 73.68% | 82.51%
server/server.js | 78.26% | 16.66% | 0% | 78.26%
server/controllers | 74.79% | 59.37% | 90% | 77.11%
- auth.controller.js | 80.76% | 50% | 100% | 91.3%
- comments.controller.js | 78.26% | 75% | 100% | 80.95%
- tasks.controller.js | 73.68% | 66.66% | 100% | 73.68%
- teams.controller.js | 69.44% | 50% | 66.66% | 69.44%
server/middleware | 72% | 37.5% | 66.66% | 75%
- auth.middleware.js | 72% | 37.5% | 66.66% | 75%
server/models | 100% ✅ | 100% ✅ | 100% ✅ | 100% ✅
- Comment.js | 100% ✅ | 100% ✅ | 100% ✅ | 100% ✅
- Task.js | 100% ✅ | 100% ✅ | 100% ✅ | 100% ✅
- Team.js | 100% ✅ | 100% ✅ | 100% ✅ | 100% ✅
- User.js | 100% ✅ | 100% ✅ | 100% ✅ | 100% ✅
server/routes | 100% ✅ | 100% ✅ | 100% ✅ | 100% ✅
- auth.routes.js | 100% ✅ | 100% ✅ | 100% ✅ | 100% ✅
- comments.routes.js | 100% ✅ | 100% ✅ | 100% ✅ | 100% ✅
- tasks.routes.js | 100% ✅ | 100% ✅ | 100% ✅ | 100% ✅
- teams.routes.js | 100% ✅ | 100% ✅ | 100% ✅ | 100% ✅
server/tests | 93.33% | 50% | 100% ✅ | 92.85%
- db.js | 93.33% | 50% | 100% ✅ | 92.85%




🐞 Debugging Highlights
1. JWT Secret Undefined: dotenv loaded too late; repositioned dotenv configuration.

2. Jest Tests: Real MongoDB connections interfering; isolated and guarded connection logic.

3. ObjectId Error: Instantiated ObjectId correctly or directly used string IDs.

4. React Navigation: Ensured proper importing and usage of React Router's useNavigate.

5. Map on Undefined: Prevented errors by adding fallback empty arrays when mapping data.

6. UI Centering & Layout: Adopted CSS Modules with flex layouts for clean, responsive design.
