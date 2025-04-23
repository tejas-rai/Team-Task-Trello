// client/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage       from "./pages/LoginPage";
import TeamsPage       from "./pages/TeamsPage";
import CreateTaskPage  from "./pages/CreateTaskPage";
import CreateTeamPage  from "./pages/CreateTeamPage";
import TaskPage        from "./pages/TaskPage";
import CommentPage     from "./pages/CommentPage";
import ProtectedRoute  from "./components/ProtectedRoute";
import AdminDashboard  from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import Header          from "./components/Header";

export default function App() {
  // A full‐screen flex container, centering its children
  const appContainer = {
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    justifyContent:"center",
    minHeight:     "100vh",
    width:         "100vw",
    padding:       "1rem",
    boxSizing:     "border-box",
  };

  // Constrain the content’s width and allow it to grow
  const contentWrapper = {
    width:    "100%",
    maxWidth: "900px",
    flex:     1,
  };

  return (
    <BrowserRouter>
      <div style={appContainer}>
        {/* Header at the top, full‐width up to maxWidth */}
        <div style={contentWrapper}>
          <Header />
        </div>

        {/* Routes also centered */}
        <div style={contentWrapper}>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard"       element={<MemberDashboard />} />
              <Route path="/teams"           element={<TeamsPage />} />
              <Route path="/tasks"           element={<TaskPage />} />
              <Route path="/tasks/create"    element={<CreateTaskPage />} />
              <Route path="/comments"        element={<CommentPage />} />
            </Route>

            {/* Admin‐only */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/teams/create"    element={<CreateTeamPage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
