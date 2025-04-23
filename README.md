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
# Edit .env: set MONGO_URI, JWT_SECRET, PORT
npm run dev

FRONTEND SETUP:
cd ../client
npm install
npm run dev


BROWSE:
Frontend: http://localhost:5173/login
Backend API: http://localhost:5000/api

PROJECT STRUCTURE:
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


🐞 Debugging Highlights
1. JWT Secret Undefined: dotenv loaded too late; repositioned dotenv configuration.

2. Jest Tests: Real MongoDB connections interfering; isolated and guarded connection logic.

3. ObjectId Error: Instantiated ObjectId correctly or directly used string IDs.

4. React Navigation: Ensured proper importing and usage of React Router's useNavigate.

5. Map on Undefined: Prevented errors by adding fallback empty arrays when mapping data.

6. UI Centering & Layout: Adopted CSS Modules with flex layouts for clean, responsive design.
