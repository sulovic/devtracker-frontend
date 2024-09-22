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
}> = ({
  issuesData,
  showSpinner,
  pagination,
  setPagination,
  filters,
  setFilters,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Filters
        filters={filters}
        setFilters={setFilters}
        pagination={pagination}
        setPagination={setPagination}
      />
      <div className="relative mb-2 overflow-x-auto shadow-lg sm:rounded-lg">
        <div className="table-responsive p-3">
          <table className="w-full text-sm text-zinc-500 rtl:text-right dark:text-zinc-400">
            <thead>
              <tr>
                <th></th>
                <th>Tip-ID</th>
                <th className="w-5/12">Naziv</th>
                <th>Proizvod</th>
                <th>Status</th>
                <th>Odgovornost</th>
                <th>Kreiran</th>
                <th>Prioritet</th>
              </tr>
            </thead>
            <tbody>
              {issuesData.length > 0
                ? issuesData?.map((issue, index) => (
                    <tr
                      key={issue?.issueId}
                      onClick={() => navigate(`/issue/${issue?.issueId}`)}
                    >
                      <td key={`index_${index}`}>{index + 1}</td>
                      <td className="uppercase" key={`issueId_${index}`}>
                        <p className="bg-zinc-100 text-zinc-600">
                          {issue?.type?.typeName}-{issue?.issueId}
                        </p>
                      </td>
                      <td key={`issueName_${index}`}>{issue?.issueName}</td>
                      <td key={`issueProduct_${index}`}>
                        {issue?.product?.productName}
                      </td>
                      <td key={`issueStatus_${index}`}>
                        {issue?.status?.statusName}
                      </td>
                      <td key={`issueRespRole_${index}`}>
                        {issue?.respRole?.roleName}
                      </td>
                      <td key={`issueCreatedAt_${index}`}>
                        {format(issue?.createdAt, "dd.MM.yyyy")}
                      </td>
                      <td key={`issuePriority_${index}`}>
                        <p
                          className={`${issue.priority.priorityName === "Low" ? "bg-green-100" : issue.priority.priorityName === "Medium" ? "bg-sky-100" : "bg-red-100"} text-zinc-600`}
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
