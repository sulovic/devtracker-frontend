import React, { useState } from "react";
import { Issue } from "../../../types/types";
import { format } from "date-fns";
import ModalIssueStatusHistory from "./ModalIssueStatusHistory";

const IssueSection: React.FC<{ issue: Issue }> = ({ issue }) => {
  const [showModalIssueStatusHistory, setShowModalIssueStatusHistory] = useState<boolean>(false);
  return (
    <>
      <div className="mt-2">
        <h5>Opis zahteva: </h5>
        <div className=" bg-zinc-100 border-zinc-300 border-2 px-2 rounded-sm grid grid-cols-2 lg:grid-cols-4  ">
          <div className="min-h-12 lg:col-span-3">
            <p> {issue?.issueDesc}</p>
          </div>
          <div className="text-right">
            <div className="flex gap-4 py-2 justify-end">
              <div>
                <button
                  onClick={() => {
                    setShowModalIssueStatusHistory(true);
                  }}
                  className="button button-sky"
                >
                  Istorija statusa : {issue?.statusHistory?.length}
                </button>
              </div>
            </div>
            <p>
              {format(issue?.createdAt, "dd.MM.yyyy HH:mm ")} : {issue?.user?.firstName} {issue?.user?.lastName}
            </p>
          </div>
        </div>
      </div>
      {showModalIssueStatusHistory && <ModalIssueStatusHistory issue={issue} setShowModalIssueStatusHistory={setShowModalIssueStatusHistory} />}
    </>
  );
};

export default IssueSection;
