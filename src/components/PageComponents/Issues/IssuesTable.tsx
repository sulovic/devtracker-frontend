import React from "react";
import Filters from "../../Filters";
import Pagination from "../../Pagination";
import { FiltersType, Issue, PaginationType } from "../../../types/types";
import { useNavigate } from "react-router-dom";
import Spinner from "../../Spinner";
import { format } from "date-fns";

const IssuesTable: React.FC<{
  issuesData: Issue[];
  showSpinner: boolean;
  pagination: PaginationType;
  setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
  filters: FiltersType | undefined;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType | undefined>>;
}> = ({ issuesData, showSpinner, pagination, setPagination, filters, setFilters }) => {
  const navigate = useNavigate();

  return (
    <>
      <Filters filters={filters} setFilters={setFilters} pagination={pagination} setPagination={setPagination} />
      <div className="relative mb-2 overflow-x-auto shadow-lg sm:rounded-lg">
        <div className="table-responsive p-3">
          <table className="w-full text-sm text-zinc-500 rtl:text-right dark:text-zinc-400 ">
            <thead className=" text-left bg-zinc-300 uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-4 "></th>
                <th className="px-4 py-4 ">Tip-ID</th>
                <th className="px-4 py-4 w-5/12">Naziv</th>
                <th className="px-4 py-4 ">Proizvod</th>
                <th className="px-4 py-4 ">Status</th>
                <th className="px-4 py-4 ">Odgovornost</th>
                <th className="px-4 py-4 ">Kreiran</th>
                <th className="px-4 py-4 ">Prioritet</th>
              </tr>
            </thead>
            <tbody>
              {issuesData.length > 0
                ? issuesData?.map((issue, index) => (
                    <tr
                      key={issue?.issueId}
                      className="border-b bg-white hover:!bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 hover:cursor-pointer"
                      onClick={() => navigate(`/issue/${issue?.issueId}`)}
                    >
                      <td key={`index_${index}`}>{index + 1}</td>
                      <td className="uppercase" key={`issueId_${index}`}>
                        <p className="bg-zinc-100">
                          {issue?.type?.typeName}-{issue?.issueId}
                        </p>
                      </td>
                      <td key={`issueName_${index}`}>{issue?.issueName}</td>
                      <td key={`issueProduct_${index}`}>{issue?.product?.productName}</td>
                      <td key={`issueStatus_${index}`}>{issue?.status?.statusName}</td>
                      <td key={`issueRespRole_${index}`}>{issue?.respRole?.roleName}</td>
                      <td key={`issueCreatedAt_${index}`}>{format(issue?.createdAt, "dd.MM.yyyy")}</td>
                      <td key={`issuePriority_${index}`}>
                        <p
                          className={
                            issue.priority.priorityName === "Low" ? "bg-green-100" : issue.priority.priorityName === "Medium" ? "bg-sky-100" : "bg-red-100"
                          }
                        >
                          {issue?.priority?.priorityName}
                        </p>
                      </td>
                    </tr>
                  ))
                : !showSpinner && (
                    <tr>
                      <td colSpan={6} className="p-3">
                        Nema podataka o zahtevima...
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      </div>
      {<Pagination pagination={pagination} setPagination={setPagination} />}
      {showSpinner && <Spinner />}
    </>
  );
};

export default IssuesTable;
