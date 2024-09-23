import type {
  ApiPageParams,
  AuthUser,
  FiltersType,
  PaginationType,
  Status,
} from "../types/types";

const ApiParams = ({
  authUser,
  filters,
  pagination,
  allStatuses,
  apiPageParams,
}: {
  authUser: AuthUser;
  filters: FiltersType | undefined;
  pagination: PaginationType;
  allStatuses?: Status[];
  apiPageParams: ApiPageParams;
}): string => {
  let apiParams: string = `?page=${pagination.page}&limit=${pagination.limit}`;

  if (filters?.type?.typeId) {
    apiParams += `&typeId=${filters?.type?.typeId}`;
  }
  if (filters?.priority?.priorityId) {
    apiParams += `&priorityId=${filters?.priority?.priorityId}`;
  }
  if (filters?.status?.statusId) {
    apiParams += `&statusId=${filters?.status?.statusId}`;
  }
  if (filters?.product?.productName) {
    apiParams += `&productId=${filters?.product?.productName}`;
  }
  if (filters?.searchString) {
    apiParams += `&search=${filters?.searchString}`;
  }

  switch (apiPageParams) {
    case "MyIssues":
      apiParams += `&userId=${authUser?.userId}`;
      if (allStatuses && filters?.status === undefined) {
        let activeStatuses: number[] = [];
        allStatuses.map((status) => {
          if (status?.statusId && status?.statusName !== "Closed") {
            activeStatuses.push(status?.statusId);
          }
        });
        apiParams += `&statusId=${activeStatuses.join(",")}`;
      }

      break;

    case "Triage":
      apiParams += `&respRoleId=2001`;
      break;

    case "Resolve":
      apiParams += `&respRoleId=${authUser?.roles.map((role) => role?.userRole?.roleId).filter((role) => (role > 3000 ? role : null))}`;
      break;

    case "Admin":
      if (allStatuses && filters?.status === undefined) {
        let activeStatuses: number[] = [];
        allStatuses.map((status) => {
          if (status?.statusId && status?.statusName !== "Closed") {
            activeStatuses.push(status?.statusId);
          }
        });
        apiParams += `&statusId=${activeStatuses.join(",")}`;
      }

      break;
  }

  return apiParams;
};

export default ApiParams;
