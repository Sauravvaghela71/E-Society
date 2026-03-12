import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaCog, FaHome } from "react-icons/fa";

export const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Logout Logic
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload(); 
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- NAVBAR START --- */}
      <nav className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">e</div>
            <h1 className="text-xl font-black text-gray-800 tracking-tight italic">
              E-Society
            </h1>
          </div>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex gap-8 items-center font-bold text-sm text-gray-600 uppercase tracking-wider">
            <li>
              <Link to="/user/home" className="hover:text-blue-600 flex items-center gap-1 transition">
                <FaHome /> Home
              </Link>
            </li>
            <li>
              <Link to="/user/settings" className="hover:text-blue-600 flex items-center gap-1 transition">
                <FaCog /> Settings
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all duration-300 font-bold border border-red-100"
              >
                <FaSignOutAlt /> LOGOUT
              </button>
            </li>
          </ul>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-50">
            <ul className="flex flex-col gap-4 font-bold text-gray-700 py-4 uppercase text-xs tracking-widest">
              <li><Link to="/user/home" onClick={() => setIsOpen(false)}>Home</Link></li>
              <li><Link to="/user/settings" onClick={() => setIsOpen(false)}>Settings</Link></li>
              <li>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left text-red-600 py-2"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* --- CONTENT AREA (OUTLET) --- */}
     
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <Outlet /> 
      </main>
    </div>
  );
};