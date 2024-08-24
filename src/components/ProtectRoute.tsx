import React from "react";
import { NavigateFunction, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";
import type { AuthContextType } from "../types/types";

const ProtectRoute : React.FC<{ minRole: number }> = ({ minRole = 5000 }) => {
  const { authUser } : AuthContextType = useAuth();
  const navigate: NavigateFunction = useNavigate();

  if (authUser && authUser?.roles.some((role) => role?.roleId > minRole)) {
    return <Outlet />;
  } else {
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

    return null;
  }
};

export default ProtectRoute;
