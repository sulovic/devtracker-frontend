import React from "react";
import { Issue } from "../../../types/types";
import { format } from "date-fns";

const IssueCard: React.FC<{ issue: Issue }> = ({ issue }) => {
  return (
    <div className="mt-2">
      <h5>Opis zahteva: </h5>
      <div className=" bg-zinc-100 border-zinc-300 border-2 px-2 rounded-sm ">
        <div className="min-h-12">
          <p> {issue?.issueDesc}</p>
        </div>
        <div className="text-right">
          <p>
            {format(issue?.createdAt, "dd.MM.yyyy HH:mm ")} : {issue?.user?.firstName} {issue?.user?.lastName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
