import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { DashboardLinks } from "../config/config";
import Spinner from "../components/Spinner";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import type { Issue, ApiPageParams, AuthContextType } from "../types/types";
import { AxiosInstance } from "axios";
import useAuth from "../hooks/useAuth";
import ApiParams from "../services/ApiParams";
import { handleApiError } from "../services/errorHandlers";
import prepareChartData from "../services/prepareChartData";
import PieChartComponent from "../components/Charts/PieChartComponent";
import { IssuesStatisticsType } from "../types/types";
import IssuesKanbanTable from "../components/PageComponents/Dashboard/IssuesKanbanTable";

const Dashboard: React.FC = () => {
  const [chartData, setChartData] = useState<IssuesStatisticsType | null>(null);
  const [issuesData, setIssuesData] = useState<Issue[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const axiosPrivate: AxiosInstance = useAxiosPrivate();
  const { authUser }: AuthContextType = useAuth();

  const fetchIssues: () => void = async () => {
    setShowSpinner(true);
    try {
      //Implement response according to user role
      let apiParams: string = "";

      if (authUser) {
        const apiPageParams: ApiPageParams = "Dashboard";
        apiParams = ApiParams({
          authUser,
          apiPageParams,
        });
      }

      const response: { data: { data: Issue[]; count: number } } =
        await axiosPrivate.get(`/api/issues${apiParams}`);
      setChartData(prepareChartData(response?.data?.data));
      setIssuesData(response?.data?.data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <>
      <Navbar Links={DashboardLinks} />
      <div className="mx-2 md:mx-4">
        <div className="mb-2">
          <h3>Dashboard</h3>
          <div>
            <IssuesKanbanTable issuesData={issuesData} />
          </div>
          <h4 className="my-4 text-center">Statistika aktivnih zahteva</h4>
          <div className="grid grid-cols-1 items-center justify-center sm:grid-cols-2 lg:grid-cols-4">
            {chartData && (
              <PieChartComponent
                name="Statusi"
                chartData={chartData?.issueStatusData}
              />
            )}
            {chartData && (
              <PieChartComponent
                name="Odgovornost"
                chartData={chartData?.issuesRespRoleData}
              />
            )}
            {chartData && (
              <PieChartComponent
                name="Proizvodi"
                chartData={chartData?.issuesProductData}
              />
            )}
            {chartData && (
              <PieChartComponent
                name="Tipovi"
                chartData={chartData?.issuesTypeData}
              />
            )}
          </div>
        </div>
      </div>
      {showSpinner && <Spinner />}
    </>
  );
};

export default Dashboard;
