import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Spinner from "./Spinner";
import type { AuthContextType } from "../types/types";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { handleApiError } from "../services/errorHandlers";

const PersistLogin: React.FC = () => {
  const { authUser, accessToken, handleRefreshToken }: AuthContextType =
    useAuth();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const navigate : NavigateFunction = useNavigate();


  useEffect(() => {
    const verifyRefreshToken: () => Promise<void> = async () => {
      try {
        await handleRefreshToken();
      } catch (err: any) {
        if (err.response?.status === 401)
         {setTimeout(() => {
          navigate("/");
        }, 2500);}
        handleApiError(err);
      } finally {
        setShowSpinner(false);
      }
    };

    !accessToken || !authUser ? verifyRefreshToken() : setShowSpinner(false);
  }, []);

  return showSpinner ? <Spinner /> : <Outlet />;
};

export default PersistLogin;
