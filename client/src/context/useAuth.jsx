import {
  useContext,
} from "react";

import {
  AuthContext,
} from "./AuthContext";

export const useAuth = () => {
  // Access authentication context
  const context =
    useContext(AuthContext);

  // Prevent hook usage
  // outside AuthProvider
  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};