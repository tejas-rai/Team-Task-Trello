import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TeamsPage from "./pages/TeamsPage";
import CreateTaskPage from "./pages/CreateTaskPage";

import CreateTeamPage from "./pages/CreateTeamPage";
import TaskPage from "./pages/TaskPage";
import CommentPage from "./pages/CommentPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Authenticated routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/tasks/create" element={<CreateTaskPage />} />

          <Route path="/comments" element={<CommentPage />} />
        </Route>

        {/* Admin-only */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/teams/create" element={<CreateTeamPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
