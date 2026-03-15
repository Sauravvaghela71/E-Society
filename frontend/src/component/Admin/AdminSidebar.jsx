import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaSignOutAlt, FaTachometerAlt, FaUsers, FaTools, 
  FaShieldAlt, FaUserClock, FaExclamationCircle, 
  FaRupeeSign, FaBuilding, FaWallet 
} from "react-icons/fa";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Logout Handler
  const handleLogout = () => {
    
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    
    navigate("/login");
    
    
    window.location.reload();
  };

  
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-6 fixed flex flex-col justify-between shadow-2xl border-r border-gray-800">
      
      {/* TOP SECTION: LOGO & NAV */}
      <div>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">
            E
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter uppercase italic leading-none">Society</h1>
            <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">Admin Panel</span>
          </div>
        </div>

        <nav className="custom-scrollbar overflow-y-auto max-h-[calc(100vh-250px)]">
          <ul className="space-y-1">
            {/* <SidebarLink 
              to="/admin" 
              icon={<FaTachometerAlt />} 
              label="Dashboard" 
              active={isActive("/admin")} 
            /> */}
            <SidebarLink 
              to="/admin/dashboard" 
              icon={<FaTachometerAlt />}
              label="Dashboard"
              active={isActive("/admin/dashboard")}
            />
            <SidebarLink 
              to="/admin/resident" 
              icon={<FaUsers />} 
              label="Residents" 
              active={isActive("/admin/resident")} 
            />
            <SidebarLink 
              to="/admin/maintainancesetting" 
              icon={<FaTools />} 
              label="Maintenance" 
              active={isActive("/admin/maintainancesetting")} 
            />
            <SidebarLink 
              to="/admin/security" 
              icon={<FaShieldAlt />} 
              label="Security Staff" 
              active={isActive("/admin/security")} 
            />
            <SidebarLink 
              to="/admin/visitor" 
              icon={<FaUserClock />} 
              label="Visitor Logs" 
              active={isActive("/admin/visitor")} 
            />
            <SidebarLink 
              to="/admin/complain" 
              icon={<FaExclamationCircle />} 
              label="Complaints" 
              active={isActive("/admin/complain")} 
            />
            <SidebarLink 
              to="/admin/expense" 
              icon={<FaRupeeSign />} 
              label="Add Expense" 
              active={isActive("/admin/expense")} 
            />
            <SidebarLink 
              to="/admin/totalExpense" 
              icon={<FaWallet />} 
              label="Total Expense" 
              active={isActive("/admin/totalExpense")} 
            />
            <SidebarLink 
              to="/admin/society" 
              icon={<FaBuilding />} 
              label="Society Info" 
              active={isActive("/admin/society")} 
            />
            <SidebarLink 
              to="/admin/flatdetails" 
              icon={<FaBuilding />} 
              label="Flat Details" 
              active={isActive("/admin/flatdetails")} 
            />

          </ul>
        </nav>
      </div>

      {/* BOTTOM SECTION: LOGOUT */}
      <div className="pt-6 border-t border-gray-800">
        <button 
          onClick={handleLogout}
          className="group flex items-center justify-center gap-3 w-full bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white py-3.5 px-4 rounded-2xl border border-red-500/20 transition-all duration-300 font-bold shadow-lg shadow-red-900/10 active:scale-95"
        >
          <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
          <span>Logout Session</span>
        </button>
      </div>
    </div>
  );
}

// Reusable Component for Nav Links
function SidebarLink({ to, icon, label, active }) {
  return (
    <li>
      <Link 
        to={to} 
        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-semibold text-sm group ${
          active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
          : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <span className={`${active ? "text-white" : "text-gray-500 group-hover:text-blue-400"} transition-colors text-lg`}>
          {icon}
        </span>
        {label}
      </Link>
    </li>
  );
}