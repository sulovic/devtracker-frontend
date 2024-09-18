import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, NavigateFunction } from "react-router-dom";
import type { Issue, AuthContextType } from "../types/types";
import { DashboardLinks } from "../config/config";
import Navbar from "../components/Navbar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { handleApiError } from "../services/errorHandlers";
import Spinner from "../components/Spinner";
import { AxiosInstance } from "axios";
import Forward from "../components/Icons/Forward";
import Backward from "../components/Icons/Backward";
import useAuth from "../hooks/useAuth";
import ModalProcessIssue from "../components/PageComponents/Issues/ModalProcessIssue";
import StatusCard from "../components/PageComponents/Issues/StatusCard";
import CommentsSection from "../components/PageComponents/Issues/CommentsSection";
import IssueSection from "../components/PageComponents/Issues/IssueSection";

const Issue: React.FC = () => {
  const location = useLocation();
  const id: string = location.pathname.replace("/issue/", "");
  const [issue, setIssue] = useState<Issue | null>(null);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [showModalProcessIssue, setShowModalProcessIssue] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const navigate: NavigateFunction = useNavigate();
  const { authUser }: AuthContextType = useAuth();

  const fetchIssue: () => void = async () => {
    try {
      setShowSpinner(true);
      const response: { data: Issue } = await axiosPrivate.get(`/api/issues/${id}`);
      if (response.data) {
        setIssue(response?.data);
      }
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, []);

  const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void = (e) => {
    e.preventDefault();
    setShowModalProcessIssue(true);
  };

  return (
    <>
      <Navbar Links={DashboardLinks} />

      {issue !== null && (
        <div className="mx-2 md:mx-4">
          <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
            <h3 className="mt-4 text-center">
              Pregled zahteva {issue?.type?.typeName}-{issue?.issueId}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 pb-4">
              <div className=" flex items-center justify-center gap-2 text-center bg-zinc-50 border-zinc-300 border-2  rounded-sm">
                <button type="button" onClick={() => navigate(-1)}>
                  <Backward IconClick={() => {}} />
                </button>
              </div>
              <div className=" flex items-center justify-center lg:col-span-2 bg-zinc-100 border-zinc-300 border-2 rounded-sm">
                <h4>{issue?.issueName}</h4>
              </div>
              <div className=" flex items-center justify-center gap-2 text-center bg-zinc-50 border-zinc-300 border-2  rounded-sm">
                {authUser && authUser?.roles.some((role) => role?.userRole?.roleId >= issue?.respRole?.roleId) && issue?.status?.statusName !== "Closed" && (
                  <button type="submit">
                    <Forward IconClick={() => {}} />
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <StatusCard title="Proizvod" desc={issue?.product?.productName} />
              <StatusCard title="Tip" desc={issue?.type?.typeName} />
              <StatusCard title="Prioritet" desc={issue?.priority?.priorityName} />
              <StatusCard title="Status" desc={`${issue?.status?.statusName} >> ${issue?.respRole?.roleName}`} />
            </div>
          </form>
          <IssueSection issue={issue} />
          <CommentsSection issue={issue} fetchIssue={fetchIssue} />
        </div>
      )}

      {showSpinner && <Spinner />}
      {showModalProcessIssue && issue && <ModalProcessIssue setShowModalProcessIssue={setShowModalProcessIssue} fetchIssue={fetchIssue} issue={issue} />}
    </>
  );
};

export default Issue;
