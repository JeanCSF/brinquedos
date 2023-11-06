import { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { api, createSession } from "../services/api";

interface AuthContextType {
  authenticated: boolean;
  authUser: string | null;
  userImg: string | null;
  isAdm: string | null;
  loading: boolean;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<string | null>(null);
  const [userImg, setUserImg] = useState<string | null>(null);
  const [isAdm, setIsAdm] = useState<string | null>("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = localStorage.getItem("user");
    const restoreImg = localStorage.getItem("userImg");
    const restoreIsAdm = localStorage.getItem("isAdm");

    if (restoreSession) {
      setAuthUser(JSON.parse(restoreSession) as string);
      setIsAdm(restoreIsAdm);
      setUserImg(restoreImg);
    }

    setLoading(false);
  }, []);

  const login = async (userName: string, password: string) => {
    try {
      const response = await createSession(userName, password);
      const { userName: loggedUser, token, userImg, isAdm } = response.data
      localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("userImg", JSON.stringify(userImg));
      localStorage.setItem("isAdm", isAdm);
      localStorage.setItem("token", token);

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setAuthUser(loggedUser);
      setIsAdm(isAdm);
      setUserImg(userImg);
      navigate("/");
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  const logout = () => {
    console.log("logout");
    localStorage.removeItem("user");
    localStorage.removeItem("userImg");
    localStorage.removeItem("isAdm");
    localStorage.removeItem("token");
    api.defaults.headers.Authorization = null;
    setAuthUser(null);
    setUserImg(null);
    setIsAdm(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated: !!authUser,
        authUser,
        isAdm,
        userImg,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
