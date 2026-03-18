import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../User/Header";

export default function GuardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}
