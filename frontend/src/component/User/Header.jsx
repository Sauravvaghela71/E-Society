import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { 
  Home, CreditCard, ShieldCheck, Bell, 
  AlertTriangle, LogOut, LayoutDashboard 
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn") === "true";
    const data = JSON.parse(localStorage.getItem("user") || "{}");
    setIsLoggedIn(status);
    setUser(data);
  }, []);

  const role = (user.role || "").toLowerCase();
  const isAdmin = role === "admin";
  const isSecurity = role === "security" || role === "guard";
  const isUser = role === "user"; // Direct check for 'user' role

  const userData = {
    // 1. Name logic: firstName priority, then email, then Guest
    name: user.firstName ? `${user.firstName} ${user.lastName || ""}` : (user.email ? user.email.split('@')[0] : "Guest User"),
    
    // 2. Role text logic: 'user' role ko "User" dikhana hai
    subText: role === "user" ? "User" : (role.toUpperCase() || "VISITOR"),
    
    profilePic: user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName || 'User'}`
  };

  const handleConfirmLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsLoggedIn(false);
    setShowLogoutModal(false);
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
              {isUser && <Link to="/user/dashboard" className="flex items-center gap-2 hover:text-blue-600"><Home size={14} /> My Dashboard</Link>}
            </div>

            {/* Profile Capsule */}
            <div 
              onClick={() => isAdmin ? navigate("/admin/dashboard") : navigate("/user")}
              className="flex items-center gap-3 bg-gray-50 p-1 pr-4 rounded-full border border-gray-200 cursor-pointer hover:border-blue-300 transition-all"
            >
              <img src={userData.profilePic} alt="User" className="w-8 h-8 rounded-full border border-white object-cover" />
              <div className="hidden sm:block text-left">
                <p className="text-[11px] font-bold text-gray-800">{userData.name}</p>
                <p className="text-[9px] text-blue-600 font-bold mt-0.5">{userData.subText}</p>
              </div>
            </div>

            <button onClick={() => setShowLogoutModal(true)} className="p-2 text-gray-400 hover:text-red-500 transition-all">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/login")} className="px-5 py-2 font-bold text-sm text-gray-700">Login</button>
            <button className="px-6 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white shadow-lg flex items-center gap-2">Join <FaArrowRight size={10} /></button>
          </div>
        )}
      </nav>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4"><AlertTriangle size={32} /></div>
              <h3 className="text-xl font-bold mb-2">Logout?</h3>
              <p className="text-sm text-gray-500 mb-8">Are you sure you want to exit?</p>
              <div className="flex w-full gap-3">
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancel</button>
                <button onClick={handleConfirmLogout} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold">Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;