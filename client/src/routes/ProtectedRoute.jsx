import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/useAuth";

const ProtectedRoute = ({
  children,
  adminOnly = false,
}) => {
  // Get authentication state
  const { userInfo } =
    useAuth();

  // Redirect if user is not logged in
  if (!userInfo) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Restrict route to admin only
  if (
    adminOnly &&
    userInfo?.user?.role !==
      "admin"
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;