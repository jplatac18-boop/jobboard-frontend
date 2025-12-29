import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

const RequireAuth = () => {
  const loggedIn = isAuthenticated();

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
