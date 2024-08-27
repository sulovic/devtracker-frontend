import { Issue } from "../types/types";

const nextStatusMatrix = {
  1: [
    { statusId: 2, statusName: "Invalid" },
    { statusId: 3, statusName: "Clarify" },
    { statusId: 4, statusName: "Resolving" },
  ],
  2: [{ statusId: 6, statusName: "Closed" }],
  3: [{ statusId: 1, statusName: "Triage" }],
  4: [
    { statusId: 1, statusName: "Triage" },
    { statusId: 3, statusName: "Clarify" },
    { statusId: 5, statusName: "Verify" },
  ],
  5: [
    { statusId: 6, statusName: "Closed" },
    { statusId: 1, statusName: "Triage" },
  ],
  6: [],
};

const nextRespGroupMatrix = {
  1: [{ roleId: 2001, roleName: "Triager" }],
  2: [{ roleId: 1001, roleName: "Reporter" }],
  3: [{ roleId: 1001, roleName: "Reporter" }],
  4: [
    { roleId: 3101, roleName: "Frontend" },
    { roleId: 3201, roleName: "Backend" },
    { roleId: 3301, roleName: "Database" },
    { roleId: 3401, roleName: "Devops" },
  ],
  5: [{ roleId: 1001, roleName: "Reporter" }],
  6: [{ roleId: 1001, roleName: "Reporter" }],
};

const nextStatus = (statusId: Issue["status"]["statusId"]) => {
  if ((statusId && statusId === 1) || statusId === 2 || statusId === 3 || statusId === 4 || statusId === 5 || statusId === 6) {
    return nextStatusMatrix[statusId];
  } else {
    return [];
  }
};

const nextRespRole = (statusId: Issue["status"]["statusId"]) => {
  if ((statusId && statusId === 1) || statusId === 2 || statusId === 3 || statusId === 4 || statusId === 5 || statusId === 6) {
    return nextRespGroupMatrix[statusId];
  } else {
    return [];
  }
};

export { nextStatus, nextRespRole };
