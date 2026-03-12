import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* --- NAVIGATION BAR --- */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">
            E
          </div>
          <span className="text-xl font-black tracking-tight text-gray-800 uppercase">Society</span>
        </div>
        
        <div className="hidden md:flex gap-8 font-bold text-sm text-gray-600 uppercase tracking-widest">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#about" className="hover:text-blue-600 transition">About</a>
          <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
        </div>

        <div className="flex gap-4">
          {/* LOGIN BUTTON */}
          <button 
            onClick={() => navigate("/login")} 
            className="px-6 py-2.5 rounded-full font-bold text-sm border-2 border-gray-100 hover:border-blue-600 hover:text-blue-600 transition-all active:scale-95"
          >
            Login
          </button>
          <button 
            onClick={() => navigate("/signup")} 
            className="hidden sm:block px-6 py-2.5 rounded-full font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
          >
            Join Now
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative px-6 pt-20 pb-32 md:px-12 flex flex-col items-center text-center overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 -left-20 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50 -z-10"></div>

        <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-6">
          The Future of Living
        </span>
        <h1 className="text-5xl md:text-7xl font-black leading-tight text-gray-900 max-w-4xl mb-8">
          Manage Your <span className="text-blue-600">Society</span> with Absolute Ease
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-medium leading-relaxed mb-10">
          Everything from maintenance payments to visitor logs, all in one smart digital platform designed for modern communities.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
           
            className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-2xl shadow-gray-200 active:scale-95"
          >
            Get Started Free
          </button>
          <button className="px-10 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all active:scale-95">
            Watch Demo
          </button>
        </div>

        {/* Mockup Preview */}
        <div className="mt-20 w-full max-w-5xl rounded-3xl border-8 border-gray-100 shadow-2xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200" 
            alt="Society Management" 
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-24 px-6 md:px-12 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-gray-500 font-medium">Simplify daily tasks with our comprehensive toolkit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              emoji="💳" 
              title="Online Maintenance" 
              desc="Pay your society bills instantly with zero paperwork and digital receipts." 
            />
            <FeatureCard 
              emoji="📢" 
              title="Digital Notices" 
              desc="Stay updated with instant push notifications for important society announcements." 
            />
            <FeatureCard 
              emoji="🛡️" 
              title="Gate Security" 
              desc="Real-time visitor logs and security alerts for a safer living environment." 
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
          © 2026 eSociety Platform. Built for Excellence.
        </p>
      </footer>
    </div>
  );
}

// Sub-Component for Features
function FeatureCard({ emoji, title, desc }) {
  return (
    <div className="p-8 bg-white rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all group">
      <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{emoji}</div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm font-medium">{desc}</p>
    </div>
  );
}