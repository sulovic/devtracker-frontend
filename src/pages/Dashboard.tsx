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

const Dashboard: React.FC = () => {
  const [data, setData] = useState<IssuesStatisticsType | null>(null);
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
      setData(prepareChartData(response?.data?.data));
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center items-center">
            {data && <PieChartComponent name="Statusi" data={data?.issueStatusData} />}
            {data && <PieChartComponent name="Odgovornost" data={data?.issuesRespRoleData} />}
            {data && <PieChartComponent name="Proizvodi" data={data?.issuesProductData} />}
            {data && <PieChartComponent name="Tipovi" data={data?.issuesTypeData} />}
          </div>
        </div>
      </div>
      {showSpinner && <Spinner />}
    </>
  );
};

export default Dashboard;
