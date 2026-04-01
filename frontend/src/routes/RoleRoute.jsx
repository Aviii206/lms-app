import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RoleRoute = ({ allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user || user.role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default RoleRoute;