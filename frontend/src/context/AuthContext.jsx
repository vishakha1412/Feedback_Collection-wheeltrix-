import React, { createContext, useState, useContext } from "react";

 
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem("userInfo");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (data) => {
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUserInfo(data);
  };

  // Used after a profile update so name/email stay in sync everywhere
  const updateUser = (data) => {
    const merged = { ...userInfo, ...data };
    localStorage.setItem("userInfo", JSON.stringify(merged));
    setUserInfo(merged);
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
