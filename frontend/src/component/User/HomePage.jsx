import React from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";

import { FaShieldAlt, FaFileInvoiceDollar, FaBullhorn, FaArrowRight } from "react-icons/fa";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-700">
      
      {/* --- NAVIGATION BAR --- */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 transition-all">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
            E
          </div>
          <span className="text-xl font-black tracking-tighter text-gray-800 uppercase italic">Society</span>
        </div>
        
        <div className="hidden md:flex gap-10 font-bold text-[11px] text-gray-500 uppercase tracking-[0.2em]">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#about" className="hover:text-blue-600 transition-colors">How it works</a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
        </div>

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
      </nav>

      {/* --- DYNAMIC CONTENT (OUTLET) --- */}
      
      <Outlet />

      {/* --- HERO SECTION --- */}
      <main>
        <section className="relative px-6 pt-24 pb-32 md:px-12 flex flex-col items-center text-center overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 -left-20 w-80 h-80 bg-blue-100 rounded-full blur-[120px] opacity-40 -z-10"></div>
          <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-100 rounded-full blur-[120px] opacity-40 -z-10"></div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-8 animate-bounce">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            The Future of Living is Here
          </div>

          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] text-gray-900 max-w-5xl mb-10 tracking-tighter">
            Smart Solutions for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Modern Societies.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-medium leading-relaxed mb-12">
            Automate maintenance, secure your gates, and stay connected with your community—all from one powerful dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <button 
              onClick={() => navigate("/signup")}
              className="px-12 py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-2xl shadow-gray-300 active:scale-95 flex items-center gap-3"
            >
              Get Started Free <FaArrowRight />
            </button>
            <button className="px-12 py-5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-blue-200 hover:bg-gray-50 transition-all active:scale-95 text-gray-700">
              Watch Video
            </button>
          </div>

          {/* Product Preview Image */}
          <div className="mt-24 relative w-full max-w-6xl rounded-[40px] border-[12px] border-white shadow-2xl shadow-blue-100 overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400" 
              alt="Society Management Dashboard" 
              className="w-full h-auto object-cover transform transition duration-1000 group-hover:scale-105"
            />
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section id="features" className="py-32 px-6 md:px-12 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Everything you need to manage.</h2>
                <p className="text-gray-500 font-medium text-lg leading-relaxed">No more paper notices or manual entry. Our toolkit covers every aspect of your society's daily operations.</p>
              </div>
              <button className="text-blue-600 font-bold border-b-2 border-blue-600 pb-1 hover:text-blue-700 transition">View all modules</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <FeatureCard 
                icon={<FaFileInvoiceDollar className="text-emerald-500" />}
                title="Maintenance Billing" 
                desc="Generate automated invoices and accept digital payments via UPI, Credit Card or Net Banking." 
              />
              <FeatureCard 
                icon={<FaBullhorn className="text-orange-500" />}
                title="Instant Notices" 
                desc="Send push notifications and emails for meetings, water cuts, or emergencies in one click." 
              />
              <FeatureCard 
                icon={<FaShieldAlt className="text-blue-600" />}
                title="Security Desk" 
                desc="Monitor visitor entry/exit with QR codes and real-time alerts to resident mobile phones." 
              />
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">E</div>
            <span className="text-lg font-black tracking-tight text-gray-900 uppercase">Society</span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">
            © 2026 eSociety Management System. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Sub-component
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-10 bg-white rounded-[32px] border border-gray-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300 group">
      <div className="text-3xl mb-8 p-4 bg-gray-50 rounded-2xl w-fit group-hover:bg-blue-50 group-hover:scale-110 transition-all">
        {icon}
      </div>
      <h3 className="text-2xl font-extrabold mb-4 text-gray-800 tracking-tight">{title}</h3>
      <p className="text-gray-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}