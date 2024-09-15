import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { DashboardLinks } from "../config/config";
import ModalNewIssue from "../components/PageComponents/Issues/ModalNewIssue";
import { Issue, AuthContextType, FiltersType, PaginationType, ApiPageParams } from "../types/types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { AxiosInstance } from "axios";
import { handleApiError } from "../services/errorHandlers";
import ApiParams from "../services/ApiParams";
import IssuesTable from "../components/IssuesTable";
import useParams from "../hooks/useParams";

const MyIssues: React.FC = () => {
  const [showModalNewIssue, setShowModalNewIssue] = useState<boolean>(false);
  const [issuesData, setIssuesData] = useState<Issue[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const { authUser }: AuthContextType = useAuth();
  const [pagination, setPagination] = useState<PaginationType>({ page: 1, limit: 10, count: 0 });
  const [filters, setFilters] = useState<FiltersType | undefined>();
  const { allStatuses } = useParams();

  const fetchIssues: () => void = async () => {
    setShowSpinner(true);
    try {
      //Implement response according to user role
      let apiParams: string = "";

      if (authUser) {
        const apiPageParams: ApiPageParams = "MyIssues"
        apiParams = ApiParams({authUser, filters, pagination, allStatuses, apiPageParams});
      }

      const response: { data: { data: Issue[]; count: number } } = await axiosPrivate.get(`/api/issues${apiParams}`);
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
        <div className="flex px-3 mb-2">
          <h3>Moji zahtevi - Pregled unetih zahteva</h3>
          <div className="flex flex-grow justify-end items-center">
            <button type="button" className="button button-sky h-fit" aria-label="New Issue" onClick={() => setShowModalNewIssue(true)}>
              Kreiraj zahtev
            </button>
          </div>
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

      {showModalNewIssue && <ModalNewIssue setShowModalNewIssue={setShowModalNewIssue} fetchIssues={fetchIssues} />}
    </>
  );
};

export default MyIssues;
