import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authData, setAuthDataState] = useState(() => ({
    empNo: "",
    empAuth: "",
    empName: "",
    apiKey: "",
  }));

  // 建議統一用物件參數，比較好維護；也支援你現有的 setAuthData(empNo, empAuth, empName, apiKey)
  const setAuthData = (empNo, empAuth, empName = "", apiKey = "") => {
    setAuthDataState({
      empNo: empNo || "",
      empAuth: empAuth || "",
      empName: empName || "",
      apiKey: apiKey || "",
    });
  };

  const clearAuthData = () => {
    setAuthDataState({
      empNo: "",
      empAuth: "",
      empName: "",
      apiKey: "",
    });
  };

  const isAuthenticated = Boolean(authData.empNo && authData.empAuth && authData.apiKey);

  const value = useMemo(
    () => ({
      authData,
      empNo: authData.empNo,       // 兼容舊用法
      empAuth: authData.empAuth,   // 兼容舊用法
      isAuthenticated,
      setAuthData,
      clearAuthData,
    }),
    [authData, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
