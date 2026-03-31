import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { 
  Home, CreditCard, ShieldCheck, Bell, 
  AlertTriangle, LogOut, LayoutDashboard,
  User, ChevronDown, X
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const role = (user.role || "").toLowerCase();
  const isAdmin = role === "admin";
  const isSecurity = role === "security" || role === "guard";
  const isUser = !isAdmin && !isSecurity;

  const userData = {
    name: user.firstName
      ? `${user.firstName} ${user.lastName || ""}`
      : user.email
      ? user.email.split("@")[0]
      : "Guest User",
    subText: isAdmin ? "Admin" : isSecurity ? "Security Guard" : "Resident",
    profilePic:
      user.profilePic ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName || user.email || "U"}`,
  };

  const dashboardPath = isAdmin
    ? "/admin/dashboard"
    : isSecurity
    ? "/security/dashboard"
    : "/user";

  const profilePath = isAdmin ? "/admin/dashboard" : isSecurity ? "/security/dashboard" : "/user/profile";

  const handleConfirmLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    setShowDropdown(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 bg-white/70 backdrop-blur-2xl sticky top-0 z-50 border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
        
        {/* PREMIUM LOGO */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-xl blur shadow-indigo-500/30 group-hover:scale-110 transition-transform"></div>
            <div className="relative w-full h-full bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg border border-white/20">
              E
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xl font-black tracking-tighter text-slate-800 leading-none group-hover:text-indigo-600 transition-colors">Society<span className="text-indigo-600">.OS</span></span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-tight mt-0.5">Management Protocol</span>
          </div>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            {/* Transparent Glass Navigation */}
            <div className="hidden lg:flex items-center gap-1 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-200/50 backdrop-blur-md">
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-[11px] font-black text-slate-600 hover:text-indigo-600 hover:bg-white rounded-xl transition-all uppercase tracking-widest shadow-sm"><LayoutDashboard size={14} /> Dashboard</Link>
                  <Link to="/admin/expense" className="flex items-center gap-2 px-4 py-2 text-[11px] font-black text-slate-600 hover:text-indigo-600 hover:bg-white rounded-xl transition-all uppercase tracking-widest"><CreditCard size={14} /> Expenses</Link>
                </>
              )}
              {isSecurity && <Link to="/security/dashboard" className="flex items-center gap-2 px-4 py-2 text-[11px] font-black text-slate-600 hover:text-indigo-600 hover:bg-white rounded-xl transition-all uppercase tracking-widest shadow-sm"><ShieldCheck size={14} /> Guard Desk</Link>}
              {isUser && (
                <>
                  <Link to="/user" className="flex items-center gap-2 px-4 py-2 text-[11px] font-black text-slate-600 hover:text-indigo-600 hover:bg-white rounded-xl transition-all uppercase tracking-widest shadow-sm"><Home size={14} /> My Dashboard</Link>
                  <Link to="/user/facilities" className="flex items-center gap-2 px-4 py-2 text-[11px] font-black text-slate-600 hover:text-indigo-600 hover:bg-white rounded-xl transition-all uppercase tracking-widest"><CreditCard size={14} /> Amenities</Link>
                </>
              )}
            </div>

            {/* Premium Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center gap-3 bg-white pl-2 pr-4 py-1.5 rounded-full border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer hover:border-indigo-300 hover:shadow-[0_4px_15px_rgba(79,70,229,0.1)] transition-all group"
              >
                <img src={userData.profilePic} alt="User" className="w-8 h-8 rounded-full border-2 border-indigo-100 object-cover group-hover:scale-105 transition-transform" />
                <div className="hidden sm:block text-left">
                  <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider">{userData.name}</p>
                  <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">{userData.subText}</p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img src={userData.profilePic} alt="User" className="w-10 h-10 rounded-xl object-cover border border-gray-200" />
                      <div>
                        <p className="text-sm font-bold text-gray-800 truncate max-w-[130px]">{userData.name}</p>
                        <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wide">{userData.subText}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => { navigate(profilePath); setShowDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      <User size={16} className="text-gray-400" />
                      View Profile
                    </button>

                    <button
                      onClick={() => { navigate(dashboardPath); setShowDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      <LayoutDashboard size={16} className="text-gray-400" />
                      Dashboard
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => { setShowDropdown(false); setShowLogoutModal(true); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 z-50 relative">
            <button onClick={() => navigate("/login")} className="px-8 py-2.5 rounded-2xl font-black text-sm bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-[0_4px_14px_rgba(79,70,229,0.4)] flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(79,70,229,0.3)] transition-all active:translate-y-0 text-[13px] tracking-wide uppercase">Login <FaArrowRight size={12} /></button>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Logout?</h3>
              <p className="text-sm text-gray-500 mb-8">Are you sure you want to exit your session?</p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
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
