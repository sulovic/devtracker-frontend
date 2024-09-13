import type { ApiPageParams, AuthUser, FiltersType, PaginationType } from "../types/types";
const ApiParams: (authUser: AuthUser, filter: FiltersType | undefined, pagination: PaginationType, apiPageParams: ApiPageParams) => string = (
  authUser,
  filter,
  pagination,
  apiPageParams
) => {
  let apiParams = `?page=${pagination.page}&limit=${pagination.limit}`;

  if (filter?.type?.typeId) {
    apiParams += `&typeId=${filter?.type?.typeId}`;
  }
  if (filter?.priority?.priorityId) {
    apiParams += `&priorityId=${filter?.priority?.priorityId}`;
  }
  if (filter?.status?.statusId) {
    apiParams += `&statusId=${filter?.status?.statusId}`;
  }
  if (filter?.product?.productName) {
    apiParams += `&productId=${filter?.product?.productName}`;
  }

  // &respRoleId=${authUser?.roles.map((role) => role?.userRole?.roleId)}


  switch (apiPageParams) {
    case "MyIssues":
      apiParams += `&userId=${authUser?.userId}`;
      break;

    case "Triage":
      apiParams += `&respRoleId=2001`;
      break;

    case "Resolve":
      apiParams += `&respRoleId=${authUser?.roles.map((role) => role?.userRole?.roleId).filter((role) => role > 3000 ? role : null)}`;
      break;

    case "Admin":
      break;
  }

  return apiParams;
};

export default ApiParams;
