import React, { use, useEffect } from "react";
import { useSelector } from "react-redux";
import { replace, useNavigate, useLocation } from "react-router-dom";
import Loader from "../layout/Loader";

const ProtectedRoute = ({ admin, children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return <Loader />;

  if (!isAuthenticated) {
    navigate("/login", { state: { from: location }, replace: true });
  }
  if (!isAuthenticated) {
    return null;
  }
  return children;
};

export default ProtectedRoute;
