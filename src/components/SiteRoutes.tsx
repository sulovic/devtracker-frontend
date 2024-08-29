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
import Issue from "../pages/Issue";


const SiteRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route index element={<Login />} />
        <Route element={<ProtectRoute minRole={Priviledges["/dashboard"]} />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<ProtectRoute minRole={Priviledges["/issue"]} />}>
          <Route path="issue/:id" element={<Issue />} />
        </Route>
        <Route element={<ProtectRoute minRole={Priviledges["/admin/products"]} />}>
          <Route path="admin/products" element={<Products />} />
        </Route>
        <Route element={<ProtectRoute minRole={Priviledges["/admin/users"]} />}>
          <Route path="admin/users" element={<Users />} />
        </Route>
      </Route>
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default SiteRoutes;
