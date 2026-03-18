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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn") === "true";
    const data = JSON.parse(localStorage.getItem("user") || "{}");
    setIsLoggedIn(status);
    setUser(data);
  }, []);

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
    subText: role === "admin" ? "Admin" : role === "security" ? "Security" : "Resident",
    profilePic:
      user.profilePic ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName || user.email || "U"}`,
  };

  const dashboardPath = isAdmin
    ? "/admin/dashboard"
    : isSecurity
    ? "/security/dashboard"
    : "/user";

  const profilePath = isAdmin ? "/admin/dashboard" : "/user/profile";

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
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 transition-all">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">E</div>
          <span className="text-xl font-black tracking-tighter text-gray-800 uppercase italic">Society</span>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            {/* Role Based Navigation */}
            <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className="flex items-center gap-2 hover:text-blue-600"><LayoutDashboard size={14} /> Overview</Link>
                  <Link to="/admin/expense" className="flex items-center gap-2 hover:text-blue-600"><CreditCard size={14} /> Expenses</Link>
                </>
              )}
              {isSecurity && <Link to="/security/dashboard" className="flex items-center gap-2 hover:text-blue-600"><ShieldCheck size={14} /> Guard Desk</Link>}
              {isUser && (
                <>
                  <Link to="/user" className="flex items-center gap-2 hover:text-blue-600"><Home size={14} /> My Dashboard</Link>
                  <Link to="/user/facilities" className="flex items-center gap-2 hover:text-blue-600"><CreditCard size={14} /> Amenities</Link>
                </>
              )}
            </div>

            {/* Profile Capsule + Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center gap-3 bg-gray-50 p-1 pr-3 rounded-full border border-gray-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all"
              >
                <img src={userData.profilePic} alt="User" className="w-8 h-8 rounded-full border border-white object-cover" />
                <div className="hidden sm:block text-left">
                  <p className="text-[11px] font-bold text-gray-800">{userData.name}</p>
                  <p className="text-[9px] text-blue-600 font-bold mt-0.5">{userData.subText}</p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
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
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/login")} className="px-5 py-2 font-bold text-sm text-gray-700">Login</button>
            <button className="px-6 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white shadow-lg flex items-center gap-2">Join <FaArrowRight size={10} /></button>
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