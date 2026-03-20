import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import ProtectedRoute from "../component/ProtectRoute";

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
import AdminComplaint from "../component/Admin/Complain";
import Society from "../component/Admin/Society";
import Facilities from "../component/Admin/Facilities";
import FacilityBooking from "../component/User/FacilityBooking";
import HomePage from "../component/User/HomePage";
import UserLayout from "../component/User/UserLayout";
import UserProfile from "../component/User/UserProfile";
import UserDashboard from "../component/User/UserDashboard";
import UserComplaint from "../component/User/Complain";
import UserVisitor from "../component/User/Visitor";
import UserMaintenance from "../component/User/Maintenance";
import FlatDetails from "../component/Admin/FlatDetails";
import GuardLayout from "../component/Guard/GuardLayout";
import GuardDashboard from "../component/Guard/GuardDashboard";


const router = createBrowserRouter([
  

  // public routes
  {
    path: "/login",
    element: <Login />
  },
    

  // admin dashboard routes
  {
    path: "/admin",
    element: <ProtectedRoute userRoles={["admin"]}><AdminLayout /></ProtectedRoute>,
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
        path: "facilities",
        element: <Facilities />
      },
        {
        path: "visitor",
        element: <Visitor />
      },
        {
        path: "complain",
        element: <AdminComplaint />
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
      <ProtectedRoute userRoles={["user"]}>
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
        element: <UserComplaint />
      },
      {
        path: "visitor",
        element: <UserVisitor />
      },
      {
        path: "facilities",
        element: <FacilityBooking />
      },
      {
        path: "maintenance",
        element: <UserMaintenance />
      }
    ]
  },

  // 3. GUARD / SECURITY ROUTES
  {
    path: "/security",
    element: (
      <ProtectedRoute userRoles={["guard"]}>
        <GuardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <GuardDashboard /> },
      { path: "dashboard", element: <GuardDashboard /> }
    ]
  },
  {
    path: "/guard",
    element: (
      <ProtectedRoute userRoles={["guard"]}>
        <GuardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <GuardDashboard /> },
      { path: "dashboard", element: <GuardDashboard /> }
    ]
  }

]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
