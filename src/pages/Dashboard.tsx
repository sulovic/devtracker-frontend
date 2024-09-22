import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { DashboardLinks } from "../config/config";

const Dashboard: React.FC = () => {
  return (
    <>
      <Navbar Links={DashboardLinks} />
      <div className="mx-2 md:mx-4">
        <div className="mb-2 flex px-3">
          <h3>Dashboard</h3>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
