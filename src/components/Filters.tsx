import React, { useEffect } from "react";
import { FiltersType, PaginationType } from "../types/types";
import useParams from "../hooks/useParams";
import useAuth from "../hooks/useAuth";

const Filters: React.FC<{
  filters: FiltersType | undefined;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType | undefined>>;
  pagination: PaginationType;
  setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
}> = ({ filters, setFilters, pagination, setPagination }) => {
  const { allProducts, allPriorities, allTypes, allStatuses } = useParams();
  const {authUser} = useAuth();

  useEffect(() => {
    setPagination({ ...pagination, page: 1 });
  }, [filters]);

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {/* Product filter */}
      <select
        name="product"
        value={filters?.product?.productName}
        onChange={(e) => {
          setFilters({ ...filters, product: allProducts?.find((product) => product?.productName === e.target.value) });
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
        value={filters?.type?.typeName}
        onChange={(e) => {
          setFilters({ ...filters, type: allTypes?.find((type) => type?.typeName === e.target.value) });
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
        value={filters?.priority?.priorityName}
        onChange={(e) => {
          setFilters({ ...filters, priority: allPriorities?.find((priority) => priority?.priorityName === e.target.value) });
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
      <select
        name="status"
        value={filters?.status?.statusName}
        onChange={(e) => {
          setFilters({ ...filters, status: allStatuses?.find((status) => status?.statusName === e.target.value) });
        }}
      >
        <option value="">Svi statusi</option>
        {allStatuses?.map((status) => (
          <option key={status?.statusId} value={status?.statusName}>
            {status?.statusName}
          </option>
        ))}
      </select>
      {/* userRole filter */}
      <select
        name="userRole"
        value={filters?.userRole?.roleName}
        onChange={(e) => {
          setFilters({ ...filters, userRole: authUser?.roles.map((role) => role?.userRole).find((role) => role?.roleName === e.target.value) });
        }}
      >
        <option value="">Sve uloge</option>
        {authUser?.roles.map((role) => (
          <option key={role?.userRole?.roleId} value={role?.userRole?.roleName}>
            {role?.userRole?.roleName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filters;
