import { useContext } from "react";
import { AuthContextType } from "../types/types";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify";

const useAuth: () => AuthContextType = () => {
  const context = useContext(AuthContext);

  if (!context) {
    toast.error(
      `Ups! Došlo je do greške. useAuth must be used within a AuthProvider`,
      {
        position: "top-center",
      },
    );
    throw new Error(" useAuth must be used within a AuthProvider");
  }

  return context;
};

export default useAuth;
