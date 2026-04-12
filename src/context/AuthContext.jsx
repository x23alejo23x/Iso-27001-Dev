import { createContext, useContext } from "react";
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

  // Leemos el estado directamente de Redux para mantener todo en un solo sitio
  const { user, error, isAuthenticated, loading } = useSelector(
    (state) => state.login,
  );

  const login = async (email, password) => {
    try {
      dispatch(loginStart());

      const data = await authService.login(email, password);

      // Verificamos que la API responda con éxito
      if (data && data.success) {
        dispatch(loginSuccess(data));
        return true;
      }

      dispatch(loginFailure("Credenciales incorrectas"));
      return false;
    } catch (err) {
      const errorMessage = "Credenciales inválidas o error de conexión";
      dispatch(loginFailure(errorMessage));
      return false;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider
      value={{
        user, // Viene de Redux
        login,
        error, // Viene de Redux
        logout,
        isAuthenticated, // Viene de Redux
        isLoading: loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
