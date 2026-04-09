import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 🔥 сразу берем из localStorage (без useEffect)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // 🔥 login
  const login = (username, role, token) => {
    const userData = {
      username,
      role,
      token,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 🔥 logout
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🔥 удобный хук
export function useAuth() {
  return useContext(AuthContext);
}