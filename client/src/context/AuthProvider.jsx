import {
  useMemo,
  useState,
} from "react";

import {
  AuthContext,
} from "./AuthContext";

export const AuthProvider = ({
  children,
}) => {
  // Persist user login state
  // even after page refresh
  const [userInfo, setUserInfo] =
    useState(() => {
      try {
        const storedUser =
          localStorage.getItem(
            "userInfo"
          );

        return storedUser
          ? JSON.parse(
              storedUser
            )
          : null;
      } catch (error) {
        console.log(error);

        // Remove corrupted data
        localStorage.removeItem(
          "userInfo"
        );

        return null;
      }
    });

  // Logout handler
  const logout = () => {
    localStorage.removeItem(
      "userInfo"
    );

    setUserInfo(null);
  };

  // Memoize context value
  // to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      userInfo,
      setUserInfo,
      logout,
    }),
    [userInfo]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};