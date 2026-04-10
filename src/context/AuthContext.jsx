import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const CREDENTIALS = {
  username: "admin",
  password: "1234",
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("auth") === "true",
  );
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [error, setError] = useState(null);

  const login = (username, password) => {
    if (
      username === CREDENTIALS.username &&
      password === CREDENTIALS.password
    ) {
      const userData = { name: "Ana García", role: "Admin", initials: "AG" };
      setIsAuthenticated(true);
      setUser(userData);
      setError(null);
      localStorage.setItem("auth", "true");
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    }
    setError("Usuario o contraseña incorrectos");
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
