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
import Society from "../component/Admin/Society";
import Signup from "../component/Admin/Signup";
import Home from "../component/User/HomePage";
import AdminSidebar from "../component/Admin/AdminSidebar";
import HomePage from "../component/User/HomePage";
import { UserNavbar } from "../component/Admin/UserNavbar";

const router = createBrowserRouter([
  
  // public routes
  {
    path: "/login",
    element: <Login />
  },

    {
      path: "/signup",
      element: <Signup />
    },
    

  // admin dashboard routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
       
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "resident",
        element: <Resident/>
      },
      {
        path: "maintainancesetting",
        element: <MaintainanceSetting />
      },
        {
        path: "visitor",
        element: <Visitor />
      },
        {
        path: "complain",
        element: <Complaint />
      },
        {
        path: "notice",
        element: <Notice />
      },
        {
        path: "emergency",
        element: <Emergency />
      },
        {
        path: "security",
        element: <Security />
      },
        {
        path: "totalexpense",
        element: <TotalExpense />
      },
       {
        path: "expense",
        element: <Expense />
      },
      {
        path: "society",
        element: <Society />
      },
      
      
    ]
  },

  // 2. USER ROUTES
  {
    path: "/user",
    element: <UserNavbar />,
    children: [
      { path: "home", element: <HomePage /> },
    ],
  },

]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;