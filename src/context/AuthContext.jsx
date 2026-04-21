import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../Pages/Login/service";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
} from "../redux/sildes/loginSlice";

const AuthContext = createContext();
export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);

  const { user, error, isAuthenticated, loading } = useSelector(
    (state) => state.login,
  );

  const login = async (email, password) => {
    try {
      dispatch(loginStart());

      const data = await authService.login(email, password);

      if (data && data.success) {
        localStorage.setItem("auth", JSON.stringify(data));
        dispatch(loginSuccess(data));
        return true;
      }

      dispatch(loginFailure("Credenciales incorrectas"));
      return false;
    } catch (err) {
      dispatch(loginFailure("Credenciales inválidas o error de conexión"));
      return false;
    }
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");

    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        dispatch(loginSuccess(parsed));
      } catch {
        localStorage.removeItem("auth");
      }
    }

    setReady(true);
  }, [dispatch]);

  const logout = () => {
    localStorage.removeItem("auth");
    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        error,
        logout,
        isAuthenticated,
        isLoading: loading,
        ready,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
