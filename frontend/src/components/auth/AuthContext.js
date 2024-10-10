import React, { createContext, useContext, useState, useEffect } from "react";
import { checkAlreadyLoggedIn, getRole } from "../../lib/session";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: null,
    userRole: null,
  });

  const initializeAuth = async () => {
    const loggedIn = checkAlreadyLoggedIn();
    if (loggedIn) {
      const role = await getRole();
      setAuthState({ isAuthenticated: true, userRole: role });
    } else {
      setAuthState({ isAuthenticated: false, userRole: null });
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, initializeAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
