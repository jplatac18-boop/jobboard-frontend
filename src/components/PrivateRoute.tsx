import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../context/AuthContext";

type PrivateRouteProps = {
  allowedRoles?: Exclude<Role, null>[];
};

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const { user, token, loading } = useAuth();

  console.log("PrivateRoute =>", { token, user, allowedRoles });

  if (loading) {
    return (
      <div className="p-4 text-center text-neutral-300">
        Cargando...
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
