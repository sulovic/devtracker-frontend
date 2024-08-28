import { useEffect } from "react";
import axios, { AxiosInstance } from "axios";
import useAuth from "../hooks/useAuth";
import type { AuthContextType } from "../types/types";

const axiosPrivate = axios.create({
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

const useAxiosPrivateFiles : () => AxiosInstance = () => {
  const { accessToken, handleRefreshToken } : AuthContextType = useAuth();

  useEffect(() => {
    // Request interceptor to add Authorization header
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor to handle token refresh
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await handleRefreshToken();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );

    // Cleanup interceptors on unmount
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [handleRefreshToken, accessToken]);

  return axiosPrivate;
};

export default useAxiosPrivateFiles;
