import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";

import Login from "../component/User/Login";
import Resident from "../component/Admin/Resident";
import MaintainanceSetting from "../component/Admin/Maintaince/MaintainanceSetting";

import AdminLayout from "../component/Admin/AdminLayout";
import Dashboard from "../component/Admin/Dashboard";
import Visitor from "../component/Admin/Visitor";
import Complain from "../component/Admin/Complain";
import Notice from "../component/Admin/Notice";
import Emergency from "../component/Admin/Emergency";
import Security from "../component/Admin/Security";
import TotalExpense from "../component/Admin/TotalExpense";
import Expense from "../component/Admin/Expense";
import Complaint from "../component/Admin/Complain";

const router = createBrowserRouter([
  
  // public routes
  {
    path: "/login",
    element: <Login />
  },

  // admin dashboard routes
  {
    path: "/",
    element: <AdminLayout />,
    children: [
        {index: true, element:<Dashboard/>},
      {
        path: "/dashboard/resident",
        element: <Resident/>
      },
      {
        path: "maintainancesetting",
        element: <MaintainanceSetting />
      },
        {
        path: "/dashboard/visitor",
        element: <Visitor />
      },
        {
        path: "/dashboard/complain",
        element: <Complaint />
      },
        {
        path: "/dashboard/notice",
        element: <Notice />
      },
        {
        path: "/dashboard/emergency",
        element: <Emergency />
      },
        {
        path: "/dashboard/security",
        element: <Security />
      },
        {
        path: "/dashboard/totalexpense",
        element: <TotalExpense />
      },
       {
        path: "/dashboard/expense",
        element: <Expense />
      },
    ]
  }

]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;