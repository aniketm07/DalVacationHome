import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loader from "../Loader";

const ProtectedRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (isAuthenticated === null) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
