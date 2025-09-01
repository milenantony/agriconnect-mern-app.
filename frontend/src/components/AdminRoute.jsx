import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  console.log("--- [AdminRoute Check] ---");
  console.log("Loading:", loading);
  console.log("User:", user);

  if (loading) {
    return <Spinner />; // or a simple loading text
  }

  if (user && user.role && user.role.toLowerCase() === "admin") {
    return children;
  }

  return <Navigate to="/" />;
};

export default AdminRoute;
