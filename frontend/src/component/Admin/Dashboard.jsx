import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5100/api";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    residents: 0,
    visitors: 0,
    complaints: 0,
    facilities: 0,
    maintenance: "₹0 Pending",
    security: 0,
    notice: 0,
    expense: 0,
    emergency: 0
  });

  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);

  useEffect(() => {
    // Fetch all related counts dynamically
    const fetchDashboardData = async () => {
      try {
        const [
          resResidents,
          resVisitors,
          resComplaints,
          resSecurity,
          resNotice,
          resExpense
        ] = await Promise.allSettled([
          axios.get(`${API}/residents`),
          axios.get(`${API}/visitor`),
          axios.get(`${API}/complaint`),
          axios.get(`${API}/security`),
          axios.get(`${API}/notice`),
          axios.get(`${API}/expense`)
        ]);

        const safeGetCount = (res) => {
          if (res.status === "fulfilled") {
            const d = res.value.data;
            if (Array.isArray(d)) return d.length;
            if (d?.data && Array.isArray(d.data)) return d.data.length;
            if (d?.notices) return d.notices.length;
          }
          return 0;
        };

        const safeGetData = (res) => {
          if (res.status === "fulfilled") {
            const d = res.value.data;
            if (Array.isArray(d)) return d;
            if (d?.data && Array.isArray(d.data)) return d.data;
          }
          return [];
        };

        const complaintsList = safeGetData(resComplaints);
        const visitorsList = safeGetData(resVisitors);

        setCounts({
          residents: safeGetCount(resResidents),
          visitors: safeGetCount(resVisitors),
          complaints: safeGetCount(resComplaints),
          facilities: 0, // Not fully implemented in backend yet
          maintenance: "₹0 Pending", // Needs maintenance API
          security: safeGetCount(resSecurity),
          notice: safeGetCount(resNotice),
          expense: safeGetCount(resExpense),
          emergency: 0 // Not fully implemented in backend yet
        });

        // Set recent 3 items
        setRecentComplaints(complaintsList.slice(-3).reverse());
        
        // Find recent visitors (taking the last 3 sorted by entryTime descending usually)
        setRecentVisitors(visitorsList.slice(0, 3));

      } catch (err) {
        console.error("Dashboard fetch error", err);
      }
    };
    fetchDashboardData();
  }, []);

  const modules = [
    { name: "Resident", count: counts.residents, path: "/admin/resident", color: "bg-blue-500" },
    { name: "Visitor", count: counts.visitors, path: "/admin/visitor", color: "bg-purple-500" },
    { name: "Complain", count: counts.complaints, path: "/admin/complain", color: "bg-red-500" },
    { name: "Facility Booking", count: counts.facilities, path: "/admin/facilities", color: "bg-green-500" },
    { name: "Maintenance Setting", count: counts.maintenance, path: "/admin/maintainancesetting", color: "bg-yellow-500" },
    { name: "Security Staff", count: counts.security, path: "/admin/security", color: "bg-indigo-500" },
    { name: "Notice", count: counts.notice, path: "/admin/notice", color: "bg-pink-500" },
    { name: "Expense", count: counts.expense, path: "/admin/expense", color: "bg-teal-500" },
    { name: "Emergency Alerts", count: counts.emergency, path: "/admin/emergency", color: "bg-orange-500" }
  ];

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Society Admin Dashboard
      </h1>

      {/* Module Cards */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">

        {modules.map((m,index)=>(
          <Link key={index} to={m.path}>

            <div className="bg-white shadow hover:shadow-lg transition rounded-xl p-6">

              <div className={`w-10 h-10 rounded-lg ${m.color} mb-3`} />

              <h3 className="text-gray-500 text-sm">
                {m.name}
              </h3>

              <p className="text-2xl font-bold">
                {m.count}
              </p>

            </div>

          </Link>
        ))}

      </div>

      {/* Lower Section */}

      <div className="grid md:grid-cols-2 gap-6">

        {/* Complaints */}

        <div className="bg-white shadow rounded-xl p-6">

          <h2 className="text-lg font-semibold mb-4">
            Recent Complaints
          </h2>

          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Flat</th>
                <th className="text-left">Issue</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {recentComplaints.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-4">No active complaints</td>
                </tr>
              ) : recentComplaints.map((c, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2 text-sm">{c.wing} - {c.unit}</td>
                  <td className="text-sm truncate max-w-[150px]">{c.complaintName}</td>
                  <td className="text-sm font-semibold">
                    <span className={
                      c.status?.toLowerCase() === "open" || c.status?.toLowerCase() === "pending"
                        ? "text-red-500"
                        : c.status?.toLowerCase() === "in progress"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }>
                      {c.status || "Open"}
                    </span>
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* Visitors */}

        <div className="bg-white shadow rounded-xl p-6">

          <h2 className="text-lg font-semibold mb-4">
            Visitors Today
          </h2>

          <ul className="space-y-3">

            {recentVisitors.length === 0 ? (
              <li className="text-gray-500 text-center py-4">No visitors logged today</li>
            ) : recentVisitors.map((v, i) => (
              <li key={i} className="flex justify-between border-b pb-2 items-center">
                <div className="flex flex-col text-sm">
                  <span className="font-bold text-gray-700">{v.visitorName}</span>
                  <span className="text-xs text-gray-400 capitalize">{v.purpose || "Visit"}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-600 font-semibold text-right">
                    W-{v.blockWing} / F-{v.flatNumber}
                  </span>
                  <span className="text-xs text-blue-500">
                    {new Date(v.entryTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </li>
            ))}

          </ul>

        </div>

      </div>

      {/* Payment Summary */}

      <div className="mt-8 bg-white shadow rounded-xl p-6">

        <h2 className="text-lg font-semibold mb-4">
          Maintenance Summary
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-green-100 p-4 rounded-lg">
            <p>Total Collected</p>
            <h3 className="text-xl font-bold">
              ₹1,80,000
            </h3>
          </div>

          <div className="bg-red-100 p-4 rounded-lg">
            <p>Pending Dues</p>
            <h3 className="text-xl font-bold">
              ₹48,000
            </h3>
          </div>

          <div className="bg-blue-100 p-4 rounded-lg">
            <p>Paid Residents</p>
            <h3 className="text-xl font-bold">
              180
            </h3>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;