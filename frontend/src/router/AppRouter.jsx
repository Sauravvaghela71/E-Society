import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import React from "react";
import ProtectedRoute from "../component/ProtectRoute";

import Login from "../component/User/Login";
import HomePage from "../component/User/HomePage";

// Admin
import AdminLayout from "../component/Admin/AdminLayout";
import Dashboard from "../component/Admin/Dashboard";
import Resident from "../component/Admin/Resident";
import MaintainanceSetting from "../component/Admin/Maintaince/MaintainanceSetting";
import Facilities from "../component/Admin/Facilities";
import Visitor from "../component/Admin/Visitor";
import AdminComplaint from "../component/Admin/Complain";
import Notice from "../component/Admin/Notice";
import Emergency from "../component/Admin/Emergency";
import Security from "../component/Admin/Security";
import TotalExpense from "../component/Admin/TotalExpense";
import Expense from "../component/Admin/Expense";
import Society from "../component/Admin/Society";
import FlatDetails from "../component/Admin/FlatDetails";

// User
import UserLayout from "../component/User/UserLayout";
import UserDashboard from "../component/User/UserDashboard";
import UserProfile from "../component/User/UserProfile";
import UserComplaint from "../component/User/Complain";
import UserVisitor from "../component/User/Visitor";
import FacilityBooking from "../component/User/FacilityBooking";
import UserMaintenance from "../component/User/Maintenance";

// Guard
import GuardLayout from "../component/Guard/GuardLayout";
import GuardDashboard from "../component/Guard/GuardDashboard";

const router = createBrowserRouter([

  // ✅ Public Routes
  { path: "/login", element: <Login /> },
  { path: "/", element: <HomePage /> },

  // ✅ Admin Routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute userRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "resident", element: <Resident /> },
      { path: "maintainancesetting", element: <MaintainanceSetting /> },
      { path: "facilities", element: <Facilities /> },
      { path: "visitor", element: <Visitor /> },
      { path: "complain", element: <AdminComplaint /> },
      { path: "notice", element: <Notice /> }, // ✅ fixed duplicate
      { path: "emergency", element: <Emergency /> },
      { path: "security", element: <Security /> },
      { path: "totalexpense", element: <TotalExpense /> },
      { path: "expense", element: <Expense /> },
      { path: "society", element: <Society /> },
      { path: "flatdetails", element: <FlatDetails /> },
    ],
  },

  // ✅ User Routes
  {
    path: "/user",
    element: (
      <ProtectedRoute userRoles={["user"]}>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <UserDashboard /> },
      { path: "profile", element: <UserProfile /> },
      { path: "complaint", element: <UserComplaint /> },
      { path: "visitor", element: <UserVisitor /> },
      { path: "facilities", element: <FacilityBooking /> },
      { path: "maintenance", element: <UserMaintenance /> },
    ],
  },

  // ✅ Guard Routes
  {
    path: "/security",
    element: (
      <ProtectedRoute userRoles={["guard"]}>
        <GuardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <GuardDashboard /> },
      { path: "dashboard", element: <GuardDashboard /> },
    ],
  },

  // ✅ Catch-all (VERY IMPORTANT)
  {
    path: "*",
    element: <Navigate to="/login" />,
  },

]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;