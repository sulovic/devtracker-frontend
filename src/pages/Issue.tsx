import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, NavigateFunction } from "react-router-dom";
import type { Issue, Product, Priority, Type, Status, AuthContextType } from "../types/types";
import { format } from "date-fns";
import { DashboardLinks } from "../config/config";
import Navbar from "../components/Navbar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { handleApiError } from "../services/errorHandlers";
import Spinner from "../components/Spinner";
import { AxiosInstance } from "axios";
import ModalNewComment from "../components/PageComponents/Issues/ModalNewComment";
import Forward from "../components/PageComponents/Icons/Forward";
import Backward from "../components/PageComponents/Icons/Backward";
import { useAuth } from "../Context/AuthContext";
import ModalProcessIssue from "../components/PageComponents/Issues/ModalProcessIssue";

const Issue: React.FC = () => {
  const location = useLocation();
  const id: string = location.pathname.replace("/issue/", "");
  const [issue, setIssue] = useState<Issue | null>(null);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [showModalNewComment, setShowModalNewComment] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
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
              <button
                onClick={() => navigate(`/dashboard`)}
                className=" flex items-center justify-center gap-2 text-center bg-sky-100 border-sky-500 border-2  rounded-lg"
              >
                <Backward IconClick={() => {}} />
                <h3>Nazad</h3>
              </button>
              <div className=" text-center lg:col-span-2  bg-sky-100 border-sky-500 border-2 rounded-lg">
                <h3>{issue?.issueName}</h3>
              </div>
              <button
                type="submit"
                className=" flex items-center justify-center gap-2 text-center bg-sky-100 border-sky-500 border-2 rounded-lg"
                disabled={authUser ? !authUser?.roles.some((role) => role?.userRole?.roleId === issue?.respRole?.roleId) : true}
              >
                <h3>Obradi</h3>
                <Forward IconClick={() => {}} />
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="min-h-24 bg-sky-50 border-sky-400 border-2 px-2 rounded-lg relative">
                <h4 className="text-sky-500 font-medium">Proizvod</h4>
                <h5 className="text-sky-500 font-medium">{issue?.product?.productName}</h5>
              </div>
              <div className="min-h-24 bg-sky-50 border-sky-400 border-2 px-2 rounded-lg relative">
                <h4 className="text-sky-500 font-medium">Tip</h4>
                <h5 className="text-sky-500 font-medium">{issue?.type?.typeName}</h5>
              </div>
              <div className="min-h-24 bg-sky-50 border-sky-400 border-2 px-2 rounded-lg relative">
                <h4 className="text-sky-500 font-medium">Prioritet</h4>
                <h5 className="text-sky-500 font-medium">{issue?.priority?.priorityName}</h5>
              </div>
              <div className="min-h-24 bg-sky-50 border-sky-400 border-2 px-2 rounded-lg relative">
                <h4 className="text-sky-500 font-medium">Status</h4>
                <h5 className="text-sky-500 font-medium">{issue?.status?.statusName + " >> " + issue?.respRole?.roleName}</h5>
              </div>
            </div>
          </form>
          <div className=" bg-zinc-200 border-zinc-400 border-2 px-2 rounded-lg mt-4 ">
            <div className="min-h-12">
              <p>Opis zahteva: {issue?.issueDesc}</p>
            </div>
            <div className="text-right">
              <p>
                {format(issue?.createdAt, "dd.MM.yyyy HH:mm ")} : {issue?.user?.firstName} {issue?.user?.lastName}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1">
            {issue?.comments?.length > 0 ? (
              issue?.comments?.map((comment) => (
                <div key={`text-${comment?.commentId}`} className="bg-zinc-100 border-zinc-300 border-2 px-2 rounded-lg mt-4 grid grid-cols-2 lg:grid-cols-4 ">
                  <div className="min-h-12 lg:col-span-3">
                    <p>Komentar: {comment?.commentText}</p>
                  </div>
                  <div className="text-right">
                    <p>Dokumenta</p>
                    <p>
                      {format(comment?.createdAt, "dd.MM.yyyy HH:mm")} : {comment?.user?.firstName} {comment?.user?.lastName}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className=" bg-zinc-100 border-zinc-300 border-2 px-2 rounded-lg mt-4 ">
                <div className="min-h-12">
                  <p>Josš uvek nema komentara...</p>
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="flex justify-end py-4">
              <button type="button" className="button button-sky " aria-label="New User" onClick={() => setShowModalNewComment(true)}>
                Dodaj komentar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSpinner && <Spinner />}
      {showModalNewComment && issue && <ModalNewComment setShowModalNewComment={setShowModalNewComment} fetchIssue={fetchIssue} issue={issue} />}
      {showModalProcessIssue && issue && (
        <ModalProcessIssue setShowModalProcessIssue={setShowModalProcessIssue} fetchIssue={fetchIssue} issue={issue} />
      )}
    </>
  );
};

export default Issue;
