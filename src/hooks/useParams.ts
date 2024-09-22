import { ParamsContextType } from "../types/types";
import { useContext } from "react";
import { ParamsContext } from "../Context/ParamsContext";
import { toast } from "react-toastify";

const useParams: () => ParamsContextType = () => {
  const context = useContext(ParamsContext);

  if (!context) {
    toast.error(
      `Ups! Došlo je do greške. useParams must be used within a ParamsProvider`,
      {
        position: "top-center",
      },
    );
    throw new Error("useParams must be used within a ParamsProvider");
  }

  return context;
};

export default useParams;
