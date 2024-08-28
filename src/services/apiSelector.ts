import type { AuthUser } from "../types/types";
const apiSelector: (authUser: AuthUser) => string = (authUser) => {
  if (authUser?.roles.some((role) => role.userRole.roleId > 5000)) {
    return "";
  } else if (authUser?.roles.some((role) => (role.userRole.roleId = 3001))) {
    return `userId=${authUser?.userId}&`;
  }

  return "APiUrl";
};

export default apiSelector;
