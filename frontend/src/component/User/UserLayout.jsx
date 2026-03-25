import React from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";

export default function UserLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <UserSidebar />
      
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
