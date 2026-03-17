import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import {
  Home, CreditCard, ShieldCheck,
  MessageCircle, Bell, AlertTriangle, User, Settings, LogOut, LayoutDashboard
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();

  // 1. Auth State & User Data fetching from LocalStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Get stored user object
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  
  // 2. Role Determination
  const role = (storedUser.role || "").toLowerCase();
  const isAdmin = role === "admin";
  const isSecurity = role === "security";
  const isResident = role === "user" || role === "resident";

  // 3. Dynamic UI Data (Rahul Sharma ki jagah real data)
  const userData = {
    name: storedUser.name || "Guest User",
    // Agar resident hai toh Flat No dikhaye, varna Role (Admin/Security)
    subText: isResident ? (storedUser.flatNo || "Flat Not Set") : (role.toUpperCase()),
    profilePic: storedUser.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${storedUser.name || 'User'}`
  };

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  // --- LOGOUT LOGIC ---
  const handleConfirmLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    sessionStorage.clear();
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    navigate("/");
  };

  // --- DYNAMIC NAVIGATION HANDLER ---
  const handleProfileClick = () => {
    if (isAdmin) navigate("/admin/dashboard");
    else if (isSecurity) navigate("/security/dashboard");
    else navigate("/user/profile");
  };

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 transition-all">
        
        {/* --- LOGO --- */}
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
            E
          </div>
          <span className="text-xl font-black tracking-tighter text-gray-800 uppercase italic">Society</span>
        </div>

        {/* --- NAVIGATION CONTENT --- */}
        {isLoggedIn ? (
          <>
            {/* 1. Dashboard Links Based on Roles */}
            <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              
              {/* ADMIN VIEW */}
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <LayoutDashboard size={14} /> Overview
                  </Link>
                  <Link to="/admin/expense" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <CreditCard size={14} /> Expenses
                  </Link>
                  <Link to="/admin/complain" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <MessageCircle size={14} /> Complaints
                  </Link>
                </>
              )}

              {/* SECURITY VIEW */}
              {isSecurity && (
                <>
                  <Link to="/security/dashboard" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <ShieldCheck size={14} /> Check-In
                  </Link>
                  <Link to="/security/visitors" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <User size={14} /> Visitor Log
                  </Link>
                  <Link to="/security/emergency" className="flex items-center gap-2 hover:text-red-600 transition-colors text-red-500">
                    <AlertTriangle size={14} /> Emergency
                  </Link>
                </>
              )}

              {/* RESIDENT (USER) VIEW */}
              {isResident && (
                <>
                  <Link to="/user/dashboard" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <Home size={14} /> My Home
                  </Link>
                  <Link to="/user/bills" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <CreditCard size={14} /> Maintenance
                  </Link>
                  <Link to="/user/complaints" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <MessageCircle size={14} /> Help Desk
                  </Link>
                </>
              )}
            </div>

            {/* 2. User Actions & Profile */}
            <div className="flex items-center gap-4">
              <button className="relative text-gray-400 hover:text-blue-600 transition-colors mr-2">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold border-2 border-white">
                  2
                </span>
              </button>

              {/* User Capsule */}
              <div
                onClick={handleProfileClick}
                className="flex items-center gap-3 bg-gray-50 p-1 pr-4 rounded-full border border-gray-200 group cursor-pointer hover:border-blue-300 transition-all"
              >
                <img src={userData.profilePic} alt="User" className="w-8 h-8 rounded-full border border-white object-cover" />
                <div className="hidden sm:block">
                  <p className="text-[11px] font-bold text-gray-800 leading-none">{userData.name}</p>
                  <p className="text-[9px] text-blue-600 font-bold mt-0.5">{userData.subText}</p>
                </div>
              </div>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          /* --- LANDING PAGE VIEW (Not Logged In) --- */
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-8 mr-6 font-bold text-[10px] text-gray-500 uppercase tracking-widest">
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#contact" className="hover:text-blue-600 transition-colors">Support</a>
            </div>
            <button 
              onClick={() => navigate("/login")} 
              className="px-5 py-2 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition-all"
            >
              Login
            </button>
            <button 
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
            >
              Join <FaArrowRight size={10} />
            </button>
          </div>
        )}
      </nav>

      {/* --- LOGOUT MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-sm text-gray-500 mb-8">
                Are you sure you want to exit your session?
              </p>
              
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmLogout}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-lg shadow-red-100 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;