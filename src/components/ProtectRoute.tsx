import React, { useEffect } from "react";
import { NavigateFunction, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import type { AuthContextType } from "../types/types";

const ProtectRoute: React.FC<{ authRoles: number[] }> = ({ authRoles = [5001] }) => {
  const { authUser }: AuthContextType = useAuth();
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    if (!authUser || !authUser.roles.some((role) => authRoles.includes(role?.userRole?.roleId))) {
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
  }, [authUser, authRoles, navigate]);

  if (authUser && authUser.roles.some((role) => authRoles.includes(role?.userRole?.roleId))) {
    return <Outlet />;
  }

  return null;
};

export default ProtectRoute;
