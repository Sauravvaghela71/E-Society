import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { 
  User, Home, CreditCard, ShieldCheck, 
  MessageCircle, Bell, LogOut,
} from 'lucide-react';
import UserProfile from './UserProfile';

const Header = () => {
  const navigate = useNavigate();
  
  // Abhi ke liye manually toggle karein check karne ke liye (Baad me ise Global State/Auth se replace karein)
  const [isLoggedIn, setIsLoggedIn] = useState(true); 

  // Mock User Data
  const userData = {
    name: "Rahul Sharma",
    flat: "A-104",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
  };

  const handleLogout = () => {
    // Sirf state change karenge, redirect nahi karenge
    setIsLoggedIn(false); 
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 md:px-12 bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 transition-all">
      
      {/* --- LOGO SECTION (Dono ke liye Same) --- */}
      <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
          E
        </div>
        <span className="text-xl font-black tracking-tighter text-gray-800 uppercase italic">Society</span>
      </div>

      {/* --- CONDITIONAL CONTENT --- */}
      {isLoggedIn ? (
        <>
          {/* 1. Dashboard Links (Sirf Login ke baad dikhenge) */}
          <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            <Link to="/dashboard" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
               <Home size={14} /> Overview
            </Link>
            <Link to="/maintenance" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
               <CreditCard size={14} /> Payments
            </Link>
            <Link to="/complaints" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
               <MessageCircle size={14} /> Complaints
            </Link>
            <Link to="/visitors" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
               <ShieldCheck size={14} /> Security
            </Link>
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
            <div onClick={()=> navigate("/user/profile")} className="flex items-center gap-3 bg-gray-50 p-1 pr-4 rounded-full border border-gray-200 group cursor-pointer hover:border-blue-300 transition-all" >
              <img src={userData.profilePic} alt="User" className="w-8 h-8 rounded-full border border-white" />
              <div className="hidden sm:block">
                <p className="text-[12px] font-bold text-gray-800 leading-none">{userData.name}</p>
                <p className="text-[10px] text-blue-600 font-bold mt-0.5">{userData.flat}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout} 
              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Landing Page Links (Sirf tab jab login na ho) */}
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
              onClick={() => navigate("/signup")} 
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
            >
              Join Now <FaArrowRight className="text-[10px]" />
            </button>
          </div>
        </>
      )}
    </nav>
  );
};

export default Header;