import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, isCompany } from "../services/auth";

const RequireCompany = () => {
  const loggedIn = isAuthenticated();
  const company = isCompany();

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!company) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireCompany;
