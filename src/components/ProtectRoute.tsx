import React, { useEffect } from "react";
import { NavigateFunction, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import type { AuthContextType } from "../types/types";

const ProtectRoute: React.FC<{ minRole: number }> = ({ minRole = 5000 }) => {
  const { authUser }: AuthContextType = useAuth();
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    if (!authUser || !authUser.roles.some((role) => role?.userRole?.roleId > minRole)) {
      toast.warning(
        <div>
          UPS!!! Izgleda da niste autorizovani da posetite ovu lokaciju!
          <br /> Bićete preusmereni na početnu stranu...
        </div>,
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
      setTimeout(() => {
        navigate("/");
      }, 2500);
    }
  }, [authUser, minRole, navigate]);

  if (authUser && authUser.roles.some((role) => role?.userRole?.roleId > minRole)) {
    return <Outlet />;
  }

  return null;
};

export default ProtectRoute;
