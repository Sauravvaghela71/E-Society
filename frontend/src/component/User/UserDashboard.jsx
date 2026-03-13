import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Settings, MessageCircle, CreditCard,
  Bell, ShieldCheck, FileText, Calendar
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "My Profile",
      description: "View and update your personal information",
      icon: <User className="text-blue-500" />,
      path: "/user/profile",
      color: "bg-blue-50 hover:bg-blue-100"
    },
    {
      title: "Settings",
      description: "Manage your account preferences",
      icon: <Settings className="text-gray-500" />,
      path: "/user/settings",
      color: "bg-gray-50 hover:bg-gray-100"
    },
    {
      title: "Complaints",
      description: "Submit and track your complaints",
      icon: <MessageCircle className="text-orange-500" />,
      path: "/user/complaints", // Assuming a route, or make it a placeholder
      color: "bg-orange-50 hover:bg-orange-100"
    },
    {
      title: "Maintenance Bills",
      description: "View and pay your maintenance fees",
      icon: <CreditCard className="text-green-500" />,
      path: "/payments", // Placeholder
      color: "bg-green-50 hover:bg-green-100"
    },
    {
      title: "Notices",
      description: "Read important society notices",
      icon: <Bell className="text-purple-500" />,
      path: "/notices", // Placeholder
      color: "bg-purple-50 hover:bg-purple-100"
    },
    {
      title: "Visitor Logs",
      description: "Check visitor entries and security",
      icon: <ShieldCheck className="text-indigo-500" />,
      path: "/visitors", // Placeholder
      color: "bg-indigo-50 hover:bg-indigo-100"
    },
    {
      title: "Documents",
      description: "Access society documents and bylaws",
      icon: <FileText className="text-teal-500" />,
      path: "/documents", // Placeholder
      color: "bg-teal-50 hover:bg-teal-100"
    },
    {
      title: "Events",
      description: "View upcoming society events",
      icon: <Calendar className="text-pink-500" />,
      path: "/events", // Placeholder
      color: "bg-pink-50 hover:bg-pink-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Welcome to E-Society
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your society activities, payments, and communications all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.path)}
              className={`p-6 rounded-[2rem] border border-gray-100 shadow-sm cursor-pointer transition-all duration-300 ${feature.color} group`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl mb-4 p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-16 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/user/profile")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Update Profile
            </button>
            <button
              onClick={() => navigate("/complaints")}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all"
            >
              New Complaint
            </button>
            <button
              onClick={() => navigate("/payments")}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
            >
              Pay Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;