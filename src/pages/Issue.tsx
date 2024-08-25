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

const Issue: React.FC = () => {
  const location = useLocation();
  const id : string = location.pathname.replace("/issue/", "");
  const [issue, setIssue] = useState<Issue | null>(null);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate : AxiosInstance = useAxiosPrivate();

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
            Pregled zahteva {issue?.types?.typeName}-{issue?.issueId}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
            <div className="mt-4 text-center col-span-2 lg:col-start-2  bg-blue-200 border-blue-300 border-2 px-2 rounded-lg">
              <h4 className="text-blue-500">{issue?.issueName}</h4>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="min-h-24 bg-sky-200 border-sky-300 border-2 px-2 rounded-lg">
              <h3 className="text-sky-500">Proizvod</h3>
              <h4 className="text-sky-500">{issue?.products?.productName}</h4>
            </div>
            <div className="min-h-24 bg-rose-200 border-rose-300 border-2 px-2 rounded-lg">
              <h3 className="text-rose-500">Kreiran</h3>
              <h4 className="text-rose-500">{format(issue?.createdAt, "dd.MM.yyyy.")}</h4>
            </div>
            <div className="min-h-24 bg-teal-200 border-teal-300 border-2 px-2 rounded-lg">
              <h3 className="text-teal-500">Status</h3>
              <h4 className="text-teal-500">{issue?.statuses?.statusName}</h4>
            </div>
            <div className="min-h-24 bg-fuchsia-200 border-fuchsia-300 border-2 px-2 rounded-lg">
              <h3 className="text-fuchsia-500">Prioritet</h3>
              <h4 className="text-fuchsia-500">{issue?.priority?.priorityName}</h4>
            </div>
          </div>
          <div className=" bg-gray-200 border-gray-400 border-2 px-2 rounded-lg mt-4 ">
            <div className="min-h-12">
              <p>Opis zahteva: {issue?.issueDesc}</p>
            </div>
            <div className="text-right">
              <p>
                {issue?.users?.firstName} {issue?.users?.lastName}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1">
            {issue?.comments?.length > 0 ? (
              issue?.comments?.map((comment) => (
                <div key={`text-${comment?.commentId}`} className="bg-gray-100 border-gray-300 border-2 px-2 rounded-lg mt-4 ">
                  <div className="min-h-12">
                    <p>Komentar: {comment?.commentText}</p>
                  </div>
                  <div className="text-right">
                    <p>
                      {comment?.users?.firstName} {comment?.users?.lastName}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className=" bg-gray-100 border-gray-300 border-2 px-2 rounded-lg mt-4 ">
                <div className="min-h-12">
                  <p>Josš uvek nema komentara...</p>
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="flex justify-end py-4">
              <button type="button" className="button button-sky " aria-label="New User" onClick={() => console.log(true)}>
                Dodaj komentar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSpinner && <Spinner />}
    </>
  );
};

export default Issue;
