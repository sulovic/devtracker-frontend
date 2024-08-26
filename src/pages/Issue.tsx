import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { Issue } from "../types/types";
import { format } from "date-fns";
import { DashboardLinks } from "../config/config";
import Navbar from "../components/Navbar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { handleApiError } from "../services/errorHandlers";
import Spinner from "../components/Spinner";
import { AxiosInstance } from "axios";
import ModalNewComment from "../components/PageComponents/Issues/ModalNewComment";
import Edit from "../components/PageComponents/Icons/Edit";
import ModalEditProductTypePriority from "../components/PageComponents/Issues/ModalEditProductTypePriority";

const Issue: React.FC = () => {
  const location = useLocation();
  const id: string = location.pathname.replace("/issue/", "");
  const [issue, setIssue] = useState<Issue | null>(null);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [showModalNewComment, setShowModalNewComment] = useState<boolean>(false);
  const [showModalEditProductTypePriority, setShowModalEditProductTypePriority] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();

  const fetchIssue: () => void = async () => {
    try {
      setShowSpinner(true);
      const response: { data: Issue } = await axiosPrivate.get(`/api/issues/${id}`);
      setIssue(response?.data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, []);


  return (
    <>
      <Navbar Links={DashboardLinks} />

      {issue !== null && (
        <div className="mx-2 md:mx-4">
          <h3 className="mt-4 text-center">
            Pregled zahteva {issue?.type?.typeName}-{issue?.issueId}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
            <div className="mt-4 text-center col-span-2 lg:col-start-2  bg-sky-200 border-sky-500 border-2 px-2 rounded-lg">
              <h3>{issue?.issueName}</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="min-h-24 bg-cyan-200 border-cyan-500 border-2 px-2 rounded-lg relative">
              <h3 className="text-cyan-500">Proizvod</h3>
              <h4 className="text-cyan-500">{issue?.product?.productName}</h4>
              <Edit IconClick={() => setShowModalEditProductTypePriority(true)} />
            </div>
            <div className="min-h-24 bg-cyan-200 border-cyan-500 border-2 px-2 rounded-lg relative">
              <h3 className="text-cyan-500">Tip</h3>
              <h4 className="text-cyan-500">{issue?.type?.typeName}</h4>
              <Edit IconClick={() => setShowModalEditProductTypePriority(true)} />
            </div>
            <div className="min-h-24 bg-cyan-200 border-cyan-500 border-2 px-2 rounded-lg relative">
              <h3 className="text-cyan-500">Prioritet</h3>
              <h4 className="text-cyan-500">{issue?.priority?.priorityName}</h4>
              <Edit IconClick={() => setShowModalEditProductTypePriority(true)} />
            </div>
            <div className="min-h-24 bg-cyan-200 border-cyan-500 border-2 px-2 rounded-lg relative">
              <h3 className="text-cyan-500">Status</h3>
              <h4 className="text-cyan-500">{issue?.status?.statusName}</h4>
            </div>
          </div>
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
      {showModalEditProductTypePriority && issue && (
        <ModalEditProductTypePriority setShowModalEditProductTypePriority={setShowModalEditProductTypePriority} fetchIssue={fetchIssue} issue={issue} />
      )}
    </>
  );
};

export default Issue;
