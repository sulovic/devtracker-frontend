import React, { useEffect, useState } from "react";
import { FiltersType, PaginationType } from "../types/types";
import useParams from "../hooks/useParams";
import { useLocation } from "react-router-dom";

const Filters: React.FC<{
  filters: FiltersType | undefined;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType | undefined>>;
  pagination: PaginationType;
  setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
}> = ({ filters, setFilters, pagination, setPagination }) => {
  const { allProducts, allPriorities, allTypes, allStatuses } = useParams();
  const [tempSearchString, setTempSearchString] = useState<string>("");
  const { pathname } = useLocation();

  useEffect(() => {
    setPagination({ ...pagination, page: 1 });
  }, [filters]);

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {/* Product filter */}
      <select
        name="product"
        area-label="Product"
        value={filters?.product?.productName}
        onChange={(e) => {
          setFilters({
            ...filters,
            product: allProducts?.find(
              (product) => product?.productName === e.target.value,
            ),
          });
        }}
      >
        <option value="">Svi proizvodi</option>
        {allProducts?.map((product) => (
          <option key={product?.productId} value={product?.productName}>
            {product?.productName}
          </option>
        ))}
      </select>
      {/* Type filter */}
      <select
        name="type"
        area-label="Type"
        value={filters?.type?.typeName}
        onChange={(e) => {
          setFilters({
            ...filters,
            type: allTypes?.find((type) => type?.typeName === e.target.value),
          });
        }}
      >
        <option value="">Svi tipovi</option>
        {allTypes?.map((type) => (
          <option key={type?.typeId} value={type?.typeName}>
            {type?.typeName}
          </option>
        ))}
      </select>
      {/* Priority filter */}
      <select
        name="priority"
        area-label="Priority"
        value={filters?.priority?.priorityName}
        onChange={(e) => {
          setFilters({
            ...filters,
            priority: allPriorities?.find(
              (priority) => priority?.priorityName === e.target.value,
            ),
          });
        }}
      >
        <option value="">Svi prioriteti</option>
        {allPriorities?.map((priority) => (
          <option key={priority?.priorityId} value={priority?.priorityName}>
            {priority?.priorityName}
          </option>
        ))}
      </select>
      {/* Status filter */}
      {(pathname === "/my-issues" || pathname === "/admin/all-issues") && (
        <select
          name="status"
          area-label="Status"
          value={filters?.status?.statusName}
          onChange={(e) => {
            setFilters({
              ...filters,
              status: allStatuses?.find(
                (status) => status?.statusName === e.target.value,
              ),
            });
          }}
        >
          <option value="">Aktivni statusi</option>
          {allStatuses?.map((status) => (
            <option key={status?.statusId} value={status?.statusName}>
              {status?.statusName}
            </option>
          ))}
        </select>
      )}

      {/* Priority filter */}
      <div className="flex gap-2">
        <div className="mx-2 my-0 hidden h-full w-0.5 bg-zinc-400 md:block"></div>

        <input
          className="w-40"
          name="search"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e?.key === "Enter") {
              setFilters({ ...filters, searchString: tempSearchString });
            }
          }}
          placeholder="Pretraga..."
          value={tempSearchString}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setTempSearchString(e?.target?.value);
          }}
        />
      </div>
    </div>
  );
};

export default Filters;
