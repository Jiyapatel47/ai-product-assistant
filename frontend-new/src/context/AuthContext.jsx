import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const login = async (email, password) => {
    const data = await loginUser(email, password);

    const newToken = data.access_token || data.token;

    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }

    setUser(data.user || data);

    return data;
  };

  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}