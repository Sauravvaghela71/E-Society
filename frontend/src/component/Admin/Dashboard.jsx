import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {

  const modules = [
    {
      name: "Resident",
      count: 240,
      path: "/dashboard/resident",
      color: "bg-blue-500"
    },
    {
      name: "Visitor",
      count: 34,
      path: "/dashboard/visitor",
      color: "bg-purple-500"
    },
    {
      name: "Complain",
      count: 12,
      path: "/dashboard/complain",
      color: "bg-red-500"
    },
    {
      name: "Facility Booking",
      count: 8,
      path: "/dashboard/facilities",
      color: "bg-green-500"
    },
    {
      name: "Maintenance Setting",
      count: "₹48k Pending",
      path: "/dashboard/payments",
      color: "bg-yellow-500"
    },
    {
      name: "Security Staff",
      count: 6,
      path: "/dashboard/security",
      color: "bg-indigo-500"
    },
    {
      name: "Notice",
      count: 5,
      path: "/dashboard/notice",
      color: "bg-pink-500"
    },
    {
      name: "expense",
      count: 5,
      path: "/dashboard/expense",
      color: "bg-pink-500"
    },
    {
      name: "Emergency Alerts",
      count: 2,
      path: "/dashboard/emergency",
      color: "bg-orange-500"
    }
  ];

  const recentComplaints = [
    { flat: "A101", issue: "Water Leakage", status: "Pending" },
    { flat: "B204", issue: "Lift Issue", status: "In Progress" },
    { flat: "C302", issue: "Parking Problem", status: "Resolved" }
  ];

  const visitors = [
    { name: "Amazon Delivery", flat: "A101", time: "10:30 AM" },
    { name: "Electrician", flat: "B204", time: "11:10 AM" },
    { name: "Guest", flat: "C302", time: "12:15 PM" }
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

              {recentComplaints.map((c,i)=>(
                <tr key={i} className="border-b">

                  <td className="py-2">{c.flat}</td>
                  <td>{c.issue}</td>

                  <td className={
                    c.status === "Pending"
                    ? "text-red-500"
                    : c.status === "In Progress"
                    ? "text-yellow-500"
                    : "text-green-500"
                  }>
                    {c.status}
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

            {visitors.map((v,i)=>(
              <li key={i} className="flex justify-between border-b pb-2">

                <span>{v.name}</span>

                <span className="text-gray-500">
                  {v.flat} • {v.time}
                </span>

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