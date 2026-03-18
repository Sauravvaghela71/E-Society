import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  User, Bell, ShieldCheck, MessageCircle,
  Calendar, CreditCard, Clock, Activity, Wallet
} from "lucide-react";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Real-time data states
  const [notices, setNotices] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [myVisitors, setMyVisitors] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);

  // Get current user details from local storage
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user");
      }
    }
  }, []);

  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!currentUser || hasFetched) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const profileId = currentUser.profileid || currentUser._id;

        // Fetch all relevant data concurrently
        const [noticeRes, bookingRes, visitorRes, complaintRes, profileRes] = await Promise.allSettled([
          axios.get("http://localhost:5100/api/notice"),
          axios.get("http://localhost:5100/api/facilities/bookings"),
          axios.get("http://localhost:5100/api/visitor"),
          axios.get("http://localhost:5100/api/complaint"),
          axios.get(`http://localhost:5100/api/residents/${profileId}`)
        ]);

        // Merge fetched profile data with currentUser
        let activeUser = { ...currentUser };
        if (profileRes.status === "fulfilled" && profileRes.value.data) {
           const residentData = profileRes.value.data;
           activeUser = {
               ...activeUser,
               firstName: residentData.firstName || residentData.Name || activeUser.email?.split('@')[0],
               lastName: residentData.lastName || "",
               blockWing: residentData.blockWing || "",
               flatNumber: residentData.flatNumber || ""
           };
           setCurrentUser(activeUser); // Updates screen state immediately
        }
        setHasFetched(true);

        // Process Notices (Only active)
        if (noticeRes.status === "fulfilled") {
          const allNotices = Array.isArray(noticeRes.value.data) ? noticeRes.value.data : noticeRes.value.data?.data || [];
          setNotices(allNotices.filter(n => n.status === "Active").slice(0, 3));
        }

        // Process Bookings (Filter for current user)
        if (bookingRes.status === "fulfilled") {
          const allBookings = Array.isArray(bookingRes.value.data) ? bookingRes.value.data : bookingRes.value.data?.data || [];
          setMyBookings(allBookings.filter(b => b.resident?._id === profileId || b.resident === profileId).slice(0, 3));
        }

        // Process Visitors (Filter by exact wing/flat)
        // Note: visitor API might not link directly to profileId in all cases, so checking wing/flat as well
        if (visitorRes.status === "fulfilled") {
          const allVisitors = Array.isArray(visitorRes.value.data) ? visitorRes.value.data : visitorRes.value.data?.data || [];
          // If the visitor's wing/flat matches the resident's wing/flat
          setMyVisitors(allVisitors.filter(v =>
             (v.blockWing === currentUser.blockWing && String(v.flatNumber) === String(currentUser.flatNumber)) ||
             v.visitingResident === profileId
          ).slice(0, 3));
        }

        // Process Complaints (Filter by user)
        if (complaintRes.status === "fulfilled") {
           const allComplaints = Array.isArray(complaintRes.value.data) ? complaintRes.value.data : complaintRes.value.data?.data || [];
           setMyComplaints(allComplaints.filter(c => c.complainer?._id === profileId || c.complainer === profileId).slice(0, 3));
        }

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, hasFetched]);

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Activity size={40} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  // Generate Quick Links dynamically
  const features = [
    { title: "My Profile", icon: <User size={24}/>, path: "/user/profile", color: "text-blue-600 bg-blue-50", count: null },
    { title: "Amenities", icon: <Calendar size={24}/>, path: "/user/facilities", color: "text-green-600 bg-green-50", count: myBookings.length },
    { title: "My Complaints", icon: <MessageCircle size={24}/>, path: "/user/complaint", color: "text-orange-600 bg-orange-50", count: myComplaints.length },
    { title: "Visitor Logs", icon: <ShieldCheck size={24}/>, path: "/user/visitor", color: "text-indigo-600 bg-indigo-50", count: myVisitors.length },
    { title: "Maintenance Bills", icon: <Wallet size={24}/>, path: "/user/maintenance", color: "text-emerald-600 bg-emerald-50", count: null }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight line-clamp-1">
              Hello, {currentUser.firstName} {currentUser.lastName}! 👋
            </h1>
            <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl">
              Welcome to your real-time E-Society hub for Wing {currentUser.blockWing || "N/A"}, Flat {currentUser.flatNumber || "N/A"}.
            </p>
          </div>
        </div>

        {/* Quick Links / Counters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, idx) => (
            <Link
              key={idx}
              to={feature.path}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:-translate-y-1 transition-all group flex flex-col justify-between"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{feature.title}</h3>
                {feature.count !== null && (
                  <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wider">
                    {feature.count} Recent Records
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Live Data Sections Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Active Notices Feed */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <Bell className="text-purple-500" /> Society Notices
              </h2>
            </div>
            <div className="space-y-4 flex-1">
              {notices.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4 font-medium">No active notices.</p>
              ) : notices.map(notice => (
                <div key={notice._id} className="border-l-4 border-purple-500 pl-4 py-2 opacity-90 hover:opacity-100 transition-opacity">
                  <h3 className="font-bold text-gray-800 line-clamp-1">{notice.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{notice.description}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">
                    {new Date(notice.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full text-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors p-2 bg-blue-50 rounded-lg">View All Notices</button>
          </div>

          {/* Visitors Feed */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <ShieldCheck className="text-indigo-500" /> Recent Visitors
              </h2>
            </div>
            <div className="space-y-4 flex-1">
              {myVisitors.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4 font-medium">No recent visitors to your flat.</p>
              ) : myVisitors.map(v => (
                <div key={v._id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                    {v.visitorName?.[0] || 'V'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{v.visitorName}</p>
                    <p className="text-xs text-gray-500">{v.purpose}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full ${v.status === 'inside' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                      {v.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bookings Feed */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <Calendar className="text-green-500" /> My Bookings
              </h2>
            </div>
            <div className="space-y-4 flex-1">
              {myBookings.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4 font-medium">You haven't booked any amenities.</p>
              ) : myBookings.map(b => (
                <div key={b._id} className="relative bg-gray-50 p-3 rounded-xl border border-gray-100 overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${b.status === 'Confirmed' ? 'bg-green-500' : b.status === "Pending" ? 'bg-orange-400' : 'bg-red-500'}`}></div>
                  <div className="ml-2">
                    <p className="font-bold text-gray-800 text-sm">{b.facility?.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={12} className="text-gray-400"/>
                      <span className="text-xs text-gray-500 font-medium">{b.timeSlot}</span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs font-black text-gray-700">{new Date(b.bookingDate).toLocaleDateString()}</span>
                      <span className="text-[9px] bg-white border px-1.5 py-0.5 rounded text-gray-600 font-bold uppercase">{b.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/user/facilities')} className="mt-4 w-full text-center text-sm font-bold text-green-600 hover:text-green-800 transition-colors p-2 bg-green-50 rounded-lg">New Booking</button>
          </div>

        </div>
      </div>
    </div>
  );
}