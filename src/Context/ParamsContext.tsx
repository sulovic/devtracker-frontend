import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, Priority, Type, Status, UserRole, ParamsContextType, AuthContextType } from "../types/types";
import Spinner from "../components/Spinner";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { AxiosInstance } from "axios";
import { handleApiError } from "../services/errorHandlers";
import useAuth from "../hooks/useAuth";

export const ParamsContext: React.Context<ParamsContextType | null> = createContext<ParamsContextType | null>(null);

export const ParamsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allPriorities, setAllPriorities] = useState<Priority[]>([]);
  const [allTypes, setAllTypes] = useState<Type[]>([]);
  const [allStatuses, setAllStatuses] = useState<Status[]>([]);
  const [allUserRoles, setAllUserRoles] = useState<UserRole[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();

  const { authUser }: AuthContextType = useAuth();

  const fetchAllData: () => void = async () => {
    if (authUser) {
      try {
        setShowSpinner(true);
        const priority: { data: Priority[] } = await axiosPrivate.get("/api/priority");
        setAllPriorities(priority?.data);
        const products: { data: Product[] } = await axiosPrivate.get("/api/products");
        setAllProducts(products?.data);
        const types: { data: Type[] } = await axiosPrivate.get("/api/types");
        setAllTypes(types?.data);
        const status: { data: Status[] } = await axiosPrivate.get("/api/statuses");
        setAllStatuses(status?.data);
        const userRoles: { data: UserRole[] } = await axiosPrivate.get("/api/userRoles");
        setAllUserRoles(userRoles?.data);
      } catch (err: any) {
        handleApiError(err);
      } finally {
        setShowSpinner(false);
      }
    }
   
  };

  useEffect(() => {
    fetchAllData();
  }, [authUser]);

  return (
    <ParamsContext.Provider value={{ allProducts, allPriorities, allTypes, allStatuses, allUserRoles }}>
      {showSpinner ? <Spinner /> : children}
    </ParamsContext.Provider>
  );
};
