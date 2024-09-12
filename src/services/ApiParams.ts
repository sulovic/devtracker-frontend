import type { AuthUser, FiltersType, PaginationType } from "../types/types";
const ApiParams: (authUser: AuthUser, filter: FiltersType, pagination: PaginationType) => string = (authUser, filter, pagination) => {
  let apiParams = `?userId=${authUser?.userId}&respRoleId=${authUser?.roles.map((role) => role.userRole.roleId)}&page=${pagination.page}&limit=${
    pagination.limit
  }`;

  console.log(filter);

  if (filter) {
    if (filter?.type?.typeId) {
      console.log("adding filter");
      apiParams += `&typeId=${filter?.type?.typeId}`;
    }
    if (filter?.priority?.priorityId) {
      apiParams += `&priorityId=${filter?.priority?.priorityId}`;
    }
    if (filter?.status?.statusId) {
      apiParams += `&statusId=${filter?.status?.statusId}`;
    }
    if (filter?.userRole?.roleId) {
      apiParams += `&userRoleId=${filter?.userRole?.roleId}`;
    }
    if (filter?.product?.productName) {
      apiParams += `&productId=${filter?.product?.productName}`;
    }
  }

  console.log(apiParams);

  return apiParams;
};

export default ApiParams;
