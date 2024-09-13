import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Spinner from "./Spinner";
import type { AuthContextType } from "../types/types";
import { handleApiError } from "../services/errorHandlers";

const PersistLogin: React.FC = () => {
  const { authUser, accessToken, handleRefreshToken }: AuthContextType = useAuth();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);

  useEffect(() => {
    const verifyRefreshToken: () => Promise<void> = async () => {
      try {
        await handleRefreshToken();
      } catch (err) {
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
