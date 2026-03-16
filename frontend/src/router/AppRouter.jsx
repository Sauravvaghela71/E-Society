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
import HomePage from "../component/User/HomePage";
import UserLayout from "../component/User/UserLayout";
import UserProfile from "../component/User/UserProfile";
import UserDashboard from "../component/User/UserDashboard";
import FlatDetails from "../component/Admin/FlatDetails";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  
  if (!isAuthenticated) {
    // If not authenticated, send user to login page
    return <Navigate to="/login" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  

  // public routes
  {
    path: "/login",
    element: <Login />
  },
    

  // admin dashboard routes
  {
    path: "/admin",
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
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
      {
        path: "notice",
        element: <Notice /> 
      },
      {
        path:"flatdetails",
        element:<FlatDetails/>
      }
      
      
    ]
  },

 
   // 2. USER ROUTES
  // home page (public landing)
  {
    path: "/",
    element: <HomePage />
  },

  // authenticated user dashboard with navbar
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <UserDashboard />
      },
      {
        path: "settings",
        element: <div>User Settings Page</div>
      },
      {
        path: "profile",
        element: <UserProfile />
      },
      {
        path:"complaint",
        element:<Complaint/>
      }

    ]
  }

]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;