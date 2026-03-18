import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader, Users, Calendar, MapPin, Phone, History, Clock } from "lucide-react";

export default function Visitor() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const API_URL = "http://localhost:5100/api/visitor";

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const res = await axios.get(API_URL);
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setVisitors(data);
      } catch (err) {
        console.error("Failed to fetch visitors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisitors();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "inside":
        return "bg-green-100 text-green-700 border-green-200";
      case "Exited":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEmoji = (purpose) => {
    const emojis = { Delivery: "📦", Guest: "👤", Service: "🔧", Cab: "🚕", Courier: "📬" };
    return emojis[purpose] || "🙂";
  };

  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch = 
      (v.visitorName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.mobileNumber || "").includes(searchQuery) ||
      (v.purpose || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "All") return matchesSearch;
    return matchesSearch && v.status === statusFilter;
  });

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Users size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">Visitor Logs</h1>
              <p className="text-gray-500 text-sm mt-1">Real-time tracking of all society visitors</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search name, mobile, purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-sm"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white shadow-sm font-semibold text-gray-700"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">⏳ Pending Approval</option>
              <option value="inside">🟢 Inside Premises</option>
              <option value="Exited">🔴 Exited</option>
            </select>
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Records", count: visitors.length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Inside Now", count: visitors.filter(v => v.status === "inside").length, color: "text-green-600", bg: "bg-green-50" },
            { label: "Pending Approval", count: visitors.filter(v => v.status === "Pending").length, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Already Exited", count: visitors.filter(v => v.status === "Exited").length, color: "text-gray-600", bg: "bg-gray-100" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TABLE SECTION */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader size={30} className="animate-spin text-purple-500 mb-4" />
            <p className="font-semibold text-lg">Fetching live visitor logs...</p>
          </div>
        ) : filteredVisitors.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <History size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700">No visitors found</h3>
            <p className="text-gray-500 mt-2 max-w-sm">No visitor records match your current search and filter criteria.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="py-4 px-6 text-xs text-gray-500 font-bold uppercase tracking-wider">Visitor</th>
                    <th className="py-4 px-6 text-xs text-gray-500 font-bold uppercase tracking-wider">Destination</th>
                    <th className="py-4 px-6 text-xs text-gray-500 font-bold uppercase tracking-wider">Purpose</th>
                    <th className="py-4 px-6 text-xs text-gray-500 font-bold uppercase tracking-wider">Timing Info</th>
                    <th className="py-4 px-6 text-xs text-gray-500 font-bold uppercase tracking-wider text-right">Live Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredVisitors.map((v) => (
                    <tr key={v._id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl shadow-inner border border-gray-200">
                            {getEmoji(v.purpose)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{v.visitorName || "Unnamed"}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Phone size={10} /> {v.mobileNumber || "No Number"}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="text-purple-400 mt-0.5" />
                          <div>
                            <p className="font-bold text-gray-700">Flat {v.flatNumber}</p>
                            <p className="text-xs text-gray-500">Wing {v.blockWing}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg text-sm">
                          {v.purpose || "Visit"}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1.5">
                          <div className="text-sm flex items-center gap-1.5 text-gray-700 font-medium">
                            <Clock size={13} className="text-green-500" />
                            {v.entryTime ? new Date(v.entryTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"}
                            <span className="text-[10px] text-gray-400 ml-1">
                              {v.entryTime ? new Date(v.entryTime).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' }) : ""}
                            </span>
                          </div>
                          {v.exitTime && (
                            <div className="text-sm flex items-center gap-1.5 text-gray-500">
                              <Clock size={13} className="text-red-400" />
                              {new Date(v.exitTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusBadge(v.status)} flex items-center gap-1.5 w-fit`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {v.status === "inside" ? "Inside" : v.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}