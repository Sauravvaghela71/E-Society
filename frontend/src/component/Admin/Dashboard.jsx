import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  Users, UserCheck, MessageCircle, CalendarDays, 
  Wrench, ShieldAlert, BellRing, IndianRupee,
  ChevronRight, Activity, CalendarClock, Wallet, Building2, Home
} from "lucide-react";

const API = "http://localhost:5100/api";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    residents: 0,
    visitors: 0,
    complaints: 0,
    facilities: 0,
    maintenance: 0,
    security: 0,
    notice: 0,
    expense: 0,
    society: 0,
    flats: 0
  });

  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get Admin Name (if available)
  const adminName = JSON.parse(localStorage.getItem("user") || "{}").firstName || "Admin";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          resResidents,
          resVisitors,
          resComplaints,
          resSecurity,
          resNotice,
          resExpense,
          resFacilities,
          resMaintenance,
          resSociety,
          resFlats
        ] = await Promise.allSettled([
          axios.get(`${API}/residents`),
          axios.get(`${API}/visitor`),
          axios.get(`${API}/complaint`),
          axios.get(`${API}/security`),
          axios.get(`${API}/notice/all`).catch(() => axios.get(`${API}/notice`)),
          axios.get(`${API}/expense/all`),
          axios.get(`${API}/facilities/bookings`),
          axios.get(`${API}/maintenance`),
          axios.get(`${API}/society/society`).catch(() => axios.get(`${API}/society`)),
          axios.get(`${API}/flats`)
        ]);

        const safeGetCount = (res) => {
          if (res.status === "fulfilled") {
            const d = res.value.data;
            if (Array.isArray(d)) return d.length;
            if (d?.data && Array.isArray(d.data)) return d.data.length;
            if (d?.notices && Array.isArray(d.notices)) return d.notices.length;
            if (d?.societies && Array.isArray(d.societies)) return d.societies.length;
            if (typeof d === 'object' && d !== null && !Array.isArray(d)) return 1;
          }
          return 0;
        };

        const safeGetData = (res) => {
          if (res.status === "fulfilled") {
            const d = res.value.data;
            if (Array.isArray(d)) return d;
            if (d?.data && Array.isArray(d.data)) return d.data;
            if (d?.notices && Array.isArray(d.notices)) return d.notices;
            if (d?.societies && Array.isArray(d.societies)) return d.societies;
            if (typeof d === 'object') return [d];
          }
          return [];
        };

        const complaintsList = safeGetData(resComplaints);
        const visitorsList = safeGetData(resVisitors);
        const expensesList = safeGetData(resExpense);
        const noticesList = safeGetData(resNotice);
        const bookingsList = safeGetData(resFacilities);

        setCounts({
          residents: safeGetCount(resResidents),
          visitors: safeGetCount(resVisitors),
          complaints: safeGetCount(resComplaints),
          facilities: safeGetCount(resFacilities),
          maintenance: safeGetCount(resMaintenance),
          security: safeGetCount(resSecurity),
          notice: safeGetCount(resNotice),
          expense: safeGetCount(resExpense),
          society: safeGetCount(resSociety),
          flats: safeGetCount(resFlats)
        });

        setRecentComplaints(complaintsList.slice(-4).reverse());
        setRecentVisitors(visitorsList.slice(-4).reverse()); // Fixed this to show recent
        setRecentExpenses(expensesList.slice(0, 4));
        setRecentNotices(noticesList.slice(0, 4));
        setRecentBookings(bookingsList.slice(0, 4));

      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const modules = [
    { name: "Residents", count: counts.residents, path: "/admin/resident", icon: <Users size={24}/>, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { name: "Visitors", count: counts.visitors, path: "/admin/visitor", icon: <UserCheck size={24}/>, color: "text-purple-600 bg-purple-50 border-purple-100" },
    { name: "Complaints", count: counts.complaints, path: "/admin/complain", icon: <MessageCircle size={24}/>, color: "text-orange-600 bg-orange-50 border-orange-100" },
    { name: "Facilities", count: counts.facilities, path: "/admin/facilities", icon: <CalendarDays size={24}/>, color: "text-green-600 bg-green-50 border-green-100" },
    { name: "Maintenance", count: counts.maintenance, path: "/admin/maintainancesetting", icon: <Wrench size={24}/>, color: "text-yellow-600 bg-yellow-50 border-yellow-100" },
    { name: "Security Staff", count: counts.security, path: "/admin/security", icon: <ShieldAlert size={24}/>, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { name: "Notices", count: counts.notice, path: "/admin/notice", icon: <BellRing size={24}/>, color: "text-pink-600 bg-pink-50 border-pink-100" },
    { name: "Expenses", count: counts.expense, path: "/admin/expense", icon: <IndianRupee size={24}/>, color: "text-teal-600 bg-teal-50 border-teal-100" },
    { name: "Society Info", count: counts.society, path: "/admin/society", icon: <Building2 size={24}/>, color: "text-sky-600 bg-sky-50 border-sky-100" },
    { name: "Flat Details", count: counts.flats, path: "/admin/flatdetails", icon: <Home size={24}/>, color: "text-emerald-600 bg-emerald-50 border-emerald-100" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Activity size={40} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome Header (Matches UserDashboard Style) */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">
              Welcome back, {adminName}! 👑
            </h1>
            <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl">
              Here is what is happening in your society today. You have full control over the ecosystem.
            </p>
          </div>
        </div>

        {/* Quick Insights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {modules.map((m, index) => (
            <Link key={index} to={m.path} className="group">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all h-full flex flex-col justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${m.color}`}>
                  {m.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-500 text-sm tracking-wide uppercase">{m.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-3xl font-black text-gray-800">{m.count}</p>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Live Feeds Section */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Recent Complaints */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <MessageCircle className="text-orange-500" /> Recent Complaints
              </h2>
              <Link to="/admin/complain" className="text-sm font-bold text-blue-600 hover:text-blue-800">View All</Link>
            </div>
            
            <div className="space-y-4">
              {recentComplaints.length === 0 ? (
                <p className="text-gray-400 text-center py-4 text-sm font-medium">No active complaints</p>
              ) : recentComplaints.map((c, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors">
                  <div>
                    <p className="font-bold text-gray-800">{c.name || c.complaintName || "Resident"}</p>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">Flat {c.unit || c.flat}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      c.status?.toLowerCase() === "pending" || c.status?.toLowerCase() === "open"
                        ? "bg-red-100 text-red-700"
                        : c.status?.toLowerCase() === "in progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {c.status || "Open"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Visitors */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <UserCheck className="text-purple-500" /> Today's Visitors
              </h2>
              <Link to="/admin/visitor" className="text-sm font-bold text-blue-600 hover:text-blue-800">View All</Link>
            </div>

            <div className="space-y-4">
              {recentVisitors.length === 0 ? (
                <p className="text-gray-400 text-center py-4 text-sm font-medium">No visitors logged today</p>
              ) : recentVisitors.map((v, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-purple-200 transition-colors">
                  <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-lg">
                    {v.visitorName?.[0] || 'V'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{v.visitorName}</p>
                    <p className="text-xs text-gray-500 font-semibold">{v.purpose || "Visit"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-600 bg-gray-200 px-2 py-0.5 rounded-md inline-block mb-1">
                      W-{v.blockWing} / F-{v.flatNumber}
                    </p>
                    <p className="text-[10px] text-gray-500 flex items-center justify-end gap-1 font-bold uppercase">
                      <CalendarClock size={10}/>
                      {v.entryTime ? new Date(v.entryTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : '—'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Additional Feeds Section (Expenses, Notices, Bookings) */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Recent Expenses */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <IndianRupee className="text-teal-500" /> Recent Expenses
              </h2>
              <Link to="/admin/expense" className="text-sm font-bold text-blue-600 hover:text-blue-800">View All</Link>
            </div>
            <div className="space-y-4">
              {recentExpenses.length === 0 ? (
                <p className="text-gray-400 text-center py-4 text-sm font-medium">No recent expenses</p>
              ) : recentExpenses.map((e, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-teal-200 transition-colors">
                  <div>
                    <p className="font-bold text-gray-800">{e.title}</p>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">{new Date(e.expenseDate || e.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-red-500 text-sm">
                      -₹{Number(e.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notices */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <BellRing className="text-pink-500" /> Recent Notices
              </h2>
              <Link to="/admin/notice" className="text-sm font-bold text-blue-600 hover:text-blue-800">View All</Link>
            </div>
            <div className="space-y-4">
              {recentNotices.length === 0 ? (
                <p className="text-gray-400 text-center py-4 text-sm font-medium">No active notices</p>
              ) : recentNotices.map((n, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-pink-200 transition-colors">
                  <div>
                    <p className="font-bold text-gray-800 truncate max-w-[200px]">{n.title}</p>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">{new Date(n.date || n.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-100 text-pink-700">
                      View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <CalendarDays className="text-green-500" /> Facility Bookings
              </h2>
              <Link to="/admin/facilities" className="text-sm font-bold text-blue-600 hover:text-blue-800">View All</Link>
            </div>
            <div className="space-y-4">
              {recentBookings.length === 0 ? (
                <p className="text-gray-400 text-center py-4 text-sm font-medium">No recent bookings</p>
              ) : recentBookings.map((b, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-green-200 transition-colors">
                  <div>
                    <p className="font-bold text-gray-800">{b.facilityName}</p>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">By: {b.userName || "Resident"}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      b.status === "Approved" ? "bg-green-100 text-green-700" :
                      b.status === "Rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {b.status || "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;