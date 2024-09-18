import React from "react";
import { Route, Routes } from "react-router-dom";
import Page404 from "../pages/Page404";
import PersistLogin from "./PersistLogin";
import ProtectRoute from "./ProtectRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Admin/Users";
import { Priviledges } from "../config/config";
import Products from "../pages/Admin/Products";
import Issue from "../pages/Issue";
import MyIssues from "../pages/MyIssues";
import Triage from "../pages/Triage";
import Resolve from "../pages/Resolve";
import AllIssues from "../pages/Admin/AllIssues";

const SiteRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route index element={<Login />} />
        <Route element={<ProtectRoute authRoles={Priviledges["/dashboard"]} />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<ProtectRoute authRoles={Priviledges["/my-issues"]} />}>
          <Route path="my-issues" element={<MyIssues />} />
        </Route>
        <Route element={<ProtectRoute authRoles={Priviledges["/triage"]} />}>
          <Route path="triage" element={<Triage />} />
        </Route>
        <Route element={<ProtectRoute authRoles={Priviledges["/resolve"]} />}>
          <Route path="resolve" element={<Resolve />} />
        </Route>
        <Route element={<ProtectRoute authRoles={Priviledges["/issue"]} />}>
          <Route path="issue/:id" element={<Issue />} />
        </Route>
        <Route element={<ProtectRoute authRoles={Priviledges["/admin/all-issues"]} />}>
          <Route path="admin/all-issues" element={<AllIssues />} />
        </Route>
        <Route element={<ProtectRoute authRoles={Priviledges["/admin/products"]} />}>
          <Route path="admin/products" element={<Products />} />
        </Route>
        <Route element={<ProtectRoute authRoles={Priviledges["/admin/users"]} />}>
          <Route path="admin/users" element={<Users />} />
        </Route>
      </Route>
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default SiteRoutes;
