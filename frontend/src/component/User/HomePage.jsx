import React from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";

import { FaShieldAlt, FaFileInvoiceDollar, FaBullhorn, FaArrowRight } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-700">
      
        <Header/>

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

     <Footer/>
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