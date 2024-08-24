import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { DashboardLinks } from "../config/config";
import Spinner from "../components/Spinner";
import ModalNewIssue from "../components/PageComponents/Issues/ModalNewIssue";
import { Issue, AuthContextType } from "../types/types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useAuth } from "../Context/AuthContext";
import { AxiosInstance } from "axios";
import { handleApiError } from "../services/errorHandlers";
import { format } from "date-fns";

const Dashboard: React.FC = () => {
  const [showModalNewIssue, setShowModalNewIssue] = useState<boolean>(false);
  const [issuesData, setIssuesData] = useState<Issue[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const { authUser }: AuthContextType = useAuth();
  const tableHeaders: string[] = ["", "ID", "Naziv", "Status", "Kreirano", "Prioritet"];

  const fetchIssues: () => void = async () => {
    setShowSpinner(true);
    try {
      const response: { data: Issue[] } = await axiosPrivate.get("/api/issues");
      setIssuesData(response?.data);
      console.log(response?.data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <>
      <Navbar Links={DashboardLinks} />
      <div className="mx-2 md:mx-4">
        <h3>Dashboard - Pregled zahteva</h3>
        <div className="flex justify-end px-3">
          <button type="button" className="button button-sky " aria-label="New Issue" onClick={() => setShowModalNewIssue(true)}>
            Kreiraj zahtev
          </button>
        </div>
        <div className="relative my-4 overflow-x-auto shadow-lg sm:rounded-lg">
          <div className="table-responsive p-3">
            <table className="w-full text-center text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 ">
              <thead className=" bg-zinc-200 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                <tr>
                  {tableHeaders.map((tableKey, index) => (
                    <th className="px-6 py-3" key={index}>
                      {tableKey}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {issuesData.length > 0 ? (
                  issuesData?.map((issue, index) => (
                    <tr
                      key={issue?.issueId}
                      className="border-b bg-white hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 hover:cursor-pointer"
                      onClick={() => console.log(issue?.issueId)}
                    >
                      <td key={`index_${index}`}>{index + 1}</td>
                      <td className="uppercase" key={`issueId_${index}`}>
                        {issue?.types?.typeName}-{issue?.issueId}
                      </td>
                      <td key={`issueName_${index}`}>{issue?.issueName}</td>
                      <td key={`issueStatus_${index}`}>{issue?.statuses?.statusName}</td>
                      <td key={`issueCreatedAt_${index}`}>{format(issue?.createdAt, "dd.MM.yyyy")}</td>
                      <td key={`issuePriority_${index}`}>{issue?.priority?.priorityName}</td>
                    </tr>
                  ))
                ) : (
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
      </div>

      {showModalNewIssue && <ModalNewIssue setShowModalNewIssue={setShowModalNewIssue} fetchIssues={fetchIssues} />}
      {showSpinner && <Spinner />}
    </>
  );
};

export default Dashboard;
