import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [empNo, setEmpNo] = useState(() => sessionStorage.getItem('empNo') || '');
  const [empAuth, setEmpAuth] = useState(() => sessionStorage.getItem('empAuth') || '');

  const setAuthData = (empNo, empAuth) => {
    sessionStorage.setItem('empNo', empNo);
    sessionStorage.setItem('empAuth', empAuth);
    setEmpNo(empNo);
    setEmpAuth(empAuth);
  };

  const clearAuthData = () => {
    sessionStorage.clear();
    setEmpNo('');
    setEmpAuth('');
  };

  const isAuthenticated = Boolean(empNo && empAuth && sessionStorage.getItem('X-API-KEY'));

  return (
    <AuthContext.Provider value={{ empNo, empAuth, isAuthenticated, setAuthData, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
