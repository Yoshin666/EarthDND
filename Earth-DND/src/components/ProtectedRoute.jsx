import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const userEmail = localStorage.getItem("userEmail");

  if (!userEmail) {
    return <Navigate to="/signup" replace />;
  }

  return children;
}
