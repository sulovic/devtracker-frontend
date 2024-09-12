import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { DashboardLinks } from "../config/config";
import Spinner from "../components/Spinner";
import ModalNewIssue from "../components/PageComponents/Issues/ModalNewIssue";
import { Issue, AuthContextType, FiltersType, PaginationType } from "../types/types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { AxiosInstance } from "axios";
import { handleApiError } from "../services/errorHandlers";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import Filters from "../components/Filters";
import ApiParams from "../services/ApiParams";

const Dashboard: React.FC = () => {
  const [showModalNewIssue, setShowModalNewIssue] = useState<boolean>(false);
  const [issuesData, setIssuesData] = useState<Issue[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const { authUser }: AuthContextType = useAuth();
  const [pagination, setPagination] = useState<PaginationType>({ page: 1, limit: 10, count: 0 });
  const [filters, setFilters] = useState<FiltersType | undefined>();
  const navigate = useNavigate();

  const fetchIssues: () => void = async () => {
    setShowSpinner(true);
    try {
      //Implement response according to user role
      let apiParams : string =""

      if (authUser && filters) {apiParams = ApiParams(authUser, filters, pagination);}

      const response: { data: { data: Issue[]; count: number } } = await axiosPrivate.get(
        `/api/issues${apiParams}`
      );
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
        <div className="flex px-3">
          <h3>Dashboard - Pregled zahteva</h3>
          <div className="flex flex-grow justify-end items-center">
            <button type="button" className="button button-sky h-fit" aria-label="New Issue" onClick={() => setShowModalNewIssue(true)}>
              Kreiraj zahtev
            </button>
          </div>
        </div>

        <Filters filters={filters} setFilters={setFilters} pagination={pagination} setPagination = {setPagination} />
        <div className="relative mb-2 overflow-x-auto shadow-lg sm:rounded-lg">
          <div className="table-responsive p-3">
            <table className="w-full text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 ">
              <thead className=" text-left bg-zinc-300 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-4 "></th>
                  <th className="px-4 py-4 ">Tip-ID</th>
                  <th className="px-4 py-4 w-6/12">Naziv</th>
                  <th className="px-4 py-4 ">Status</th>
                  <th className="px-4 py-4 ">Kreiran</th>
                  <th className="px-4 py-4 ">Prioritet</th>
                </tr>
              </thead>
              <tbody>
                {issuesData.length > 0
                  ? issuesData?.map((issue, index) => (
                      <tr
                        key={issue?.issueId}
                        className="border-b bg-white hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 hover:cursor-pointer"
                        onClick={() => navigate(`/issue/${issue?.issueId}`)}
                      >
                        <td key={`index_${index}`}>{index + 1}</td>
                        <td className="uppercase" key={`issueId_${index}`}>
                          <p className="bg-zinc-100">
                            {issue?.type?.typeName}-{issue?.issueId}
                          </p>
                        </td>
                        <td key={`issueName_${index}`}>{issue?.issueName}</td>
                        <td key={`issueStatus_${index}`}>{issue?.status?.statusName}</td>
                        <td key={`issueCreatedAt_${index}`}>{format(issue?.createdAt, "dd.MM.yyyy")}</td>
                        <td key={`issuePriority_${index}`}>
                          <p
                            className={
                              issue.priority.priorityName === "Low" ? "bg-green-100" : issue.priority.priorityName === "Medium" ? "bg-sky-100" : "bg-red-100"
                            }
                          >
                            {issue?.priority?.priorityName}
                          </p>
                        </td>
                      </tr>
                    ))
                  : !showSpinner && (
                      <tr>
                        <td colSpan={6} className="p-3">
                          Nema podataka o zahtevima...
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>
        </div>
        {<Pagination pagination={pagination} setPagination={setPagination} />}
      </div>

      {showModalNewIssue && <ModalNewIssue setShowModalNewIssue={setShowModalNewIssue} fetchIssues={fetchIssues} />}
      {showSpinner && <Spinner />}
    </>
  );
};

export default Dashboard;
