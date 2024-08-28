import React from "react";
import { Issue } from "../../../types/types";
import { format } from "date-fns";

const IssueCard: React.FC<{ issue: Issue }> = ({ issue }) => {
  return (
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
  );
};

export default IssueCard;
