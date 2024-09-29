import { Issue } from "../types/types";
import { ChartDataType, IssuesStatisticsType } from "../types/types";

const prepareChartData = (
  issuesData: Issue[],
):  IssuesStatisticsType => {
  const data : IssuesStatisticsType  = { 
    issueStatusData: [],
    issuesRespRoleData: [],
    issuesProductData: [],
    issuesTypeData: [],
  };

  issuesData.forEach((issue) => {
    if (
      !data.issueStatusData.find(
        (data) => data?.key === issue?.status?.statusName,
      )
    ) {
      data.issueStatusData.push({ key: issue?.status?.statusName, value: 1 });
    } else {
      data.issueStatusData.find(
        (data) => data?.key === issue?.status?.statusName,
      )!.value += 1;
    }

    if (
      !data?.issuesRespRoleData.find((chart) => chart?.key === issue?.respRole?.roleName)
    ) {
      data.issuesRespRoleData.push({ key: issue?.respRole?.roleName, value: 1 });
    } else {
      data.issuesRespRoleData.find(
        (chart) => chart?.key === issue?.respRole?.roleName,
      )!.value += 1;
    }
  });

  issuesData.forEach((issue) => {
    if (
      !data.issuesProductData.find((chart) => chart?.key === issue?.product?.productName)
    ) {
      data.issuesProductData.push({ key: issue?.product?.productName || "Not set", value: 1 });
    } else {
      data.issuesProductData.find(
        (chart) => chart?.key === issue?.product?.productName,
      )!.value += 1;
    }
  });

  issuesData.forEach((issue) => {
    if (
      !data.issuesTypeData.find((chart) => chart?.key === issue?.type?.typeName)
    ) {
      data.issuesTypeData.push({ key: issue?.type?.typeName, value: 1 });
    } else {
      data.issuesTypeData.find(
        (chart) => chart?.key === issue?.type?.typeName,
      )!.value += 1;
    }
  });


  return data;
};


export default prepareChartData;
