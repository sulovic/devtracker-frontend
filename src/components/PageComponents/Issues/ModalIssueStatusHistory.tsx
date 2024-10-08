import React from "react";
import { Issue, StatusHistory } from "../../../types/types";
import { format } from "date-fns";

const ModalIssueStatusHistory: React.FC<{
  issue: Issue;
  setShowModalIssueStatusHistory: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ issue, setShowModalIssueStatusHistory }) => {
  return (
    <>
      <div className="relative z-20">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75">
          <div className="fixed inset-0 z-30 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <div className="relative w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl sm:p-8 dark:bg-gray-800">
                <div className="w-full sm:mt-0">
                  {/* Modal Head */}
                  <div className="text-left">
                    <h4>Pregled istorije statusa</h4>
                  </div>

                  <div className="my-4 h-0.5 w-full bg-zinc-400"> </div>

                  <div className="grid grid-cols-1">
                    {issue?.statusHistory.length > 0 ? (
                      <>
                        {issue?.statusHistory.map((status: StatusHistory) => (
                          <div className="flex gap-4">
                            <div className="flex items-center justify-start">
                              <p>
                                {format(status?.createdAt, "dd.MM.yyyy HH:mm ")}
                              </p>
                            </div>
                            <div className="flex grow items-center justify-start">
                              <p>
                                {status?.user?.firstName}{" "}
                                {status?.user?.lastName}
                              </p>
                            </div>
                            <div className="flex items-center justify-start">
                              <p>
                                {" "}
                                {`${status?.status?.statusName} >> ${status?.respRole?.roleName}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="text-center">Istorija statusa je prazna</p>
                    )}
                  </div>
                  <div className="my-4 h-0.5 w-full bg-zinc-400"></div>
                </div>

                {/* Modal Buttons */}
                <div className="flex flex-row-reverse gap-2">
                  <button
                    onClick={() => setShowModalIssueStatusHistory(false)}
                    className="button button-sky"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalIssueStatusHistory;
