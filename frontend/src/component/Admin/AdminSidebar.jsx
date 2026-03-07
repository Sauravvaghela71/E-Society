import React from "react";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed">

      <h1 className="text-2xl font-bold mb-10">
        E-Society Admin
      </h1>

      <ul className="space-y-6">

        <li>
          <Link to="/" className="hover:text-blue-400">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/dashboard/resident" className="hover:text-blue-400">
            Residents
          </Link>
        </li>

        <li>
          <Link to="/dashboard/maintainancesetting" className="hover:text-blue-400">
            Maintenance
          </Link>
        </li>

        <li>
          <Link to="/dashboard/security" className="hover:text-blue-400">
            Security
          </Link>
        </li>

        <li>
          <Link to="/dashboard/visitor" className="hover:text-blue-400">
            Visitor
          </Link>
        </li>

        <li>
          <Link to="/dashboard/complain" className="hover:text-blue-400">
            Complain
          </Link>
        </li>

        <li>
          <Link to="/dashboard/Expense" className="hover:text-blue-400">
            Expense
          </Link>
        </li>

        <li>
          <Link to="/dashboard/totalExpense" className="hover:text-blue-400">
            Total Expense
          </Link>
        </li>

      </ul>
    </div>
  );
}