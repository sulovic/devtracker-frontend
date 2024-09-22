import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { DashboardLinks } from "../config/config";
import {
  Issue,
  AuthContextType,
  FiltersType,
  PaginationType,
  ApiPageParams,
} from "../types/types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { AxiosInstance } from "axios";
import { handleApiError } from "../services/errorHandlers";
import ApiParams from "../services/ApiParams";
import IssuesTable from "../components/PageComponents/Issues/IssuesTable";

const Resolve: React.FC = () => {
  const [issuesData, setIssuesData] = useState<Issue[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const { authUser }: AuthContextType = useAuth();
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
    count: 0,
  });
  const [filters, setFilters] = useState<FiltersType | undefined>();

  const fetchIssues: () => void = async () => {
    setShowSpinner(true);
    try {
      //Implement response according to user role
      let apiParams: string = "";

      if (authUser) {
        const apiPageParams: ApiPageParams = "Resolve";
        apiParams = ApiParams({ authUser, filters, pagination, apiPageParams });
      }

      const response: { data: { data: Issue[]; count: number } } =
        await axiosPrivate.get(`/api/issues${apiParams}`);
      setIssuesData(response?.data?.data);
      setPagination({ ...pagination, count: response?.data?.count });
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [pagination.page, pagination.limit, filters]);

  return (
    <>
      <Navbar Links={DashboardLinks} />
      <div className="mx-2 md:mx-4">
        <div className="mb-2 flex px-3">
          <h3>Rešavanje zahteva</h3>
        </div>
        <IssuesTable
          issuesData={issuesData}
          pagination={pagination}
          setPagination={setPagination}
          filters={filters}
          setFilters={setFilters}
          showSpinner={showSpinner}
        />
      </div>
    </>
  );
};

export default Resolve;
