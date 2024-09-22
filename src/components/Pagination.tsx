import React from "react";
import { PaginationType } from "../types/types";

const Pagination: React.FC<{
  pagination: PaginationType;
  setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
}> = ({ pagination, setPagination }) => {
  return (
    <div className="mt-4 flex justify-end">
      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="button button-sky"
          aria-label="Previous Page"
          disabled={pagination?.page === 1}
          onClick={() =>
            setPagination({ ...pagination, page: pagination?.page - 1 })
          }
        >
          Prethodna
        </button>
        <h5 className="flex items-center justify-center">
          {pagination?.count > 0
            ? `Strana: ${pagination?.page} od ${Math.ceil(pagination?.count / pagination?.limit)}`
            : `Nema podataka`}
        </h5>
        <button
          type="button"
          className="button button-sky"
          aria-label="Next Page"
          disabled={
            pagination?.page ===
              Math.ceil(pagination?.count / pagination?.limit) ||
            pagination?.count === 0
          }
          onClick={() =>
            setPagination({ ...pagination, page: pagination?.page + 1 })
          }
        >
          Sledeća
        </button>
      </div>
    </div>
  );
};

export default Pagination;
