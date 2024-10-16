import React from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { Issue } from "../../../types/types";

const IssuesKanbanTable: React.FC<{ issuesData: Issue[] }> = ({
  issuesData,
}) => {
  const navigate: NavigateFunction = useNavigate();
  const activeStatuses: string[] = [
    "Triage",
    "Clarify",
    "Resolving",
    "Verify",
    "Invalid",
  ];

  return (
    <>
      <h4 className="text-center">Pregled statusa aktivnih zahteva</h4>
      <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
        <div className="table-responsive py-4">
          <table className="w-full text-sm text-zinc-500 rtl:text-right dark:text-zinc-400">
            <thead>
              <tr>
                {activeStatuses.map((status) => (
                  <th key={status}>{status}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issuesData.length > 0 ? (
                issuesData?.map(
                  (issue, index) =>
                    issue?.status?.statusName !== "Closed" && (
                      <tr key={issue?.issueId}>
                        {activeStatuses.map((status) => (
                          <td
                            key={status}
                            onClick={() => navigate(`/issue/${issue?.issueId}`)}
                          >
                            {issue?.status?.statusName === status &&
                              issue?.issueName}
                          </td>
                        ))}
                      </tr>
                    ),
                )
              ) : (
                <td colSpan={5}>Nemate aktivnih zahteva</td>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default IssuesKanbanTable;
