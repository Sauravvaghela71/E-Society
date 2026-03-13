import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import {
  Home, CreditCard, ShieldCheck,
  MessageCircle, Bell, AlertTriangle
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();

  // Determine login state from localStorage so that header renders correctly on refresh / redirect
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  // State for logout confirmation modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Mock User Data
  const userData = {
    name: "Rahul Sharma",
    flat: "A-104",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
  };

  // Determine the current user role (useful for generating correct links)
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}") || {};
  const role = (storedUser.role || "").toLowerCase();
  const isAdmin = role === "admin";
  const isUser = role === "user";

  // Keep isLoggedIn in sync when localStorage changes (e.g., after login)
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  // --- LOGOUT LOGIC ---
  const handleConfirmLogout = () => {
    // 1. Clear auth data from storage
    localStorage.removeItem("user_token"); // Agar aap token use kar rahe hain
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    sessionStorage.clear();

    // 2. Auth state update karein
    setIsLoggedIn(false);
    setShowLogoutModal(false);

    // 3. Homepage par redirect karein
    navigate("/");
  };

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 transition-all">
        
        {/* --- LOGO SECTION --- */}
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
            E
          </div>
          <span className="text-xl font-black tracking-tighter text-gray-800 uppercase italic">Society</span>
        </div>

        {/* --- CONDITIONAL CONTENT --- */}
        {isLoggedIn ? (
          <>
            {/* 1. Dashboard Links */}
            <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <Home size={14} /> Overview
                  </Link>
                  <Link to="/admin/expense" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <CreditCard size={14} /> Payments
                  </Link>
                  <Link to="/admin/complain" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <MessageCircle size={14} /> Complaints
                  </Link>
                  <Link to="/admin/visitor" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <ShieldCheck size={14} /> Security
                  </Link>
                </>
              )}

              {isUser && (
                <>
                  <Link to="/user" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <Home size={14} /> Home
                  </Link>
                  <Link to="/user/profile" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <CreditCard size={14} /> Profile
                  </Link>
                  <Link to="/user/settings" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <MessageCircle size={14} /> Settings
                  </Link>
                </>
              )}

              {!isAdmin && !isUser && (
                <Link to="/" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <Home size={14} /> Home
                </Link>
              )}
            </div>

            {/* 2. User Profile & Notifications */}
            <div className="flex items-center gap-6">
              <button className="relative text-gray-400 hover:text-blue-600 transition-colors">
                <Bell size={22} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-white">
                  3
                </span>
              </button>

              {/* User Capsule */}
              <div
                onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/user/profile")}
                className="flex items-center gap-3 bg-gray-50 p-1 pr-4 rounded-full border border-gray-200 group cursor-pointer hover:border-blue-300 transition-all"
              >
                <img src={userData.profilePic} alt="User" className="w-8 h-8 rounded-full border border-white" />
                <div className="hidden sm:block">
                  <p className="text-[12px] font-bold text-gray-800 leading-none">{userData.name}</p>
                  <p className="text-[10px] text-blue-600 font-bold mt-0.5">{userData.flat}</p>
                </div>
              </div>

              <button
                onClick={() => {setShowLogoutModal(true)}}
                className="px-4 py-2 text-[12px] font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all uppercase tracking-wider"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Landing Page Links */}
            <div className="hidden md:flex gap-10 font-bold text-[11px] text-gray-500 uppercase tracking-[0.2em]">
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#about" className="hover:text-blue-600 transition-colors">How it works</a>
              <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>

            {/* Login/Join Buttons */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/login")} 
                className="px-6 py-2.5 rounded-2xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition-all active:scale-95 border border-transparent hover:border-gray-200"
              >
                Login
              </button>
              <button 
                
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
              >
                Join Now <FaArrowRight className="text-[10px]" />
              </button>
            </div>
          </>
        )}
      </nav>

      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Are you sure?</h3>
              <p className="text-gray-500 font-medium mb-8">
                Are you sure you want to logout? 
              </p>
              
              <div className="flex w-full gap-4">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-4 px-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                >
                  No, Stay
                </button>
                <button 
                  onClick={handleConfirmLogout}
                  className="flex-1 py-4 px-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95"
                >
                  Yes, Logout
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