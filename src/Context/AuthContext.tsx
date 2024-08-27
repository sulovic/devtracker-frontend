import React, { createContext, useState, useContext, ReactNode } from "react";
import { ApiLoginConnector, ApiLogoutConnector, ApiRefreshConnector } from "../components/ApiAuthConnectors";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import type { AuthUser, AuthContextType, LoginData, AxiosLoginResponse } from "../types/types";
import { handleApiError } from "../services/errorHandlers";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin : AuthContextType["handleLogin"]   = async ({ type, email, password, credential }) => {
    // User / password login
    if (type === "password") {
      try {
        const loginResponse: AxiosLoginResponse | undefined = await ApiLoginConnector({ type, email, password });
        if (loginResponse) {
          const accessToken: string = loginResponse?.data?.accessToken;
          const decodedAccessToken: AuthUser = jwtDecode(accessToken);
          setAuthUser(decodedAccessToken);
          setAccessToken(accessToken);

          console.log(decodedAccessToken)
          toast.success(`Uspešno ste se prijavili`, {
            position: "top-center",
          });
        }
      } catch (error) {
        handleApiError(error);
      }

      // Google login
    } else if (type === "google") {
      try {
        const loginResponse: AxiosLoginResponse | undefined = await ApiLoginConnector({ type, credential });
        if (loginResponse) {
          const accessToken: string = loginResponse?.data?.accessToken;
          const decodedAccessToken: AuthUser = jwtDecode(accessToken);
          setAuthUser(decodedAccessToken);
          setAccessToken(accessToken);
          toast.success(`Uspešno ste se prijavili`, {
            position: "top-center",
          });
        }
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  const handleLogout : AuthContextType["handleLogout"] = async () => {
    try {
      await ApiLogoutConnector();
      setAuthUser(null);
      setAccessToken(null);
      navigate("/");
      toast.success(`Uspešno ste se odjavili`, {
        position: "top-center",
      });
      
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRefreshToken : AuthContextType["handleRefreshToken"]  = async () => {
    try {
      const refreshTokenResponse: AxiosLoginResponse | undefined = await ApiRefreshConnector();

      if (refreshTokenResponse) {
        const newAccessToken: string = refreshTokenResponse?.data?.accessToken;
        const decodedAccessToken: AuthUser = jwtDecode(newAccessToken);
        setAuthUser(decodedAccessToken);
        setAccessToken(newAccessToken);
        return newAccessToken;
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, accessToken, setAccessToken, handleLogin, handleLogout, handleRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

  export const useAuth : () => AuthContextType = () => {
  const context = useContext(AuthContext);
  if (context !== undefined) {
    return context;
  } else
    toast.error(`Ups! Došlo je do greške .`, {
      position: "top-center",
    });
  return {} as AuthContextType;
};
