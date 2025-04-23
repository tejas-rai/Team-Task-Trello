import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ requiredRole }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    // Logged in but wrong role
    return <Navigate to="/" replace />;
  }
  // Authorized
  return <Outlet />;
}
