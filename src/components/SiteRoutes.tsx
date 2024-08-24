import React from "react";
import { Route, Routes } from "react-router-dom";
import Page404 from "../pages/Page404";
import PersistLogin from "./PersistLogin";
import ProtectRoute from "./ProtectRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import { Priviledges } from "../config/config";
import Products from "../pages/Products";

const SiteRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route index element={<Login />} />
        <Route element={<ProtectRoute minRole={Priviledges["/dashboard"]} />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<ProtectRoute minRole={Priviledges["/products"]} />}>
          <Route path="products" element={<Products />} />
        </Route>
        <Route element={<ProtectRoute minRole={Priviledges["/users"]} />}>
          <Route path="users" element={<Users />} />
        </Route>
      </Route>
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default SiteRoutes;
