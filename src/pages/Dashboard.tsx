import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { DashboardLinks } from "../config/config";
import Spinner from "../components/Spinner";
// import ModalNewIssue from "../components/PageComponents/Issues/ModalNewIssue";
import { Issue, AuthContextType } from "../types/types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useAuth } from "../Context/AuthContext";
import { AxiosInstance } from "axios";
import { handleApiError } from "../services/errorHandlers";

const Dashboard: React.FC = () => {

  const [showModalNewIssue, setShowModalNewIssue] = useState<boolean>(false);
  const [issuesData, setIssuesData] = useState<Issue[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const { authUser }: AuthContextType = useAuth();

  const fetchIssues: () => void = async () => {
    setShowSpinner(true);
    try {
      const response: { data: Issue[] } = await axiosPrivate.get("/api/issues");
      setIssuesData(response?.data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
    }
  };



  return (
    <>
      <Navbar Links={DashboardLinks} />
      <h3>Dashboard</h3>
      <div>
        <div className="flex justify-end px-3">
          <button type="button" className="button button-sky " aria-label="EditUser" onClick={() => setShowModalNewIssue(true)}>
            Dodaj korisnika
          </button>
        </div>
      </div>
      {/* {showModalNewIssue && <ModalNewIssue setShowModalNewIssue={setShowModalNewIssue} fetchIssues={fetchIssues} />} */}
      {showSpinner && <Spinner />}
    </>
  );
};

export default Dashboard;
