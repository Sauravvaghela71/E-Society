import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ReceiptText,
  Megaphone,
  ArrowRight,
  Lock,
  BellRing,
  UsersRound,
  CalendarCheck,
  Building2
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

export default function HomePage({ showHeader = true, showFooter = true }) {
  const navigate = useNavigate();

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const modules = [
    {
      icon: <ReceiptText className="text-emerald-500 w-8 h-8" />,
      title: "Maintenance Billing",
      desc: "Generate invoices and track payments for every flat in seconds.",
    },
    {
      icon: <Megaphone className="text-orange-500 w-8 h-8" />,
      title: "Instant Notices",
      desc: "Send meetings, water cuts, and announcements without delays.",
    },
    {
      icon: <ShieldCheck className="text-blue-600 w-8 h-8" />,
      title: "Security Desk",
      desc: "Handle visitor entry/exit and keep residents informed in real time.",
    },
    {
      icon: <UsersRound className="text-purple-600 w-8 h-8" />,
      title: "Visitor Management",
      desc: "Streamlined check-ins so guards can focus on safety and protocol.",
    },
    {
      icon: <CalendarCheck className="text-sky-600 w-8 h-8" />,
      title: "Facility Booking",
      desc: "Book amenities and keep requests cleanly organized for your society.",
    },
    {
      icon: <BellRing className="text-rose-600 w-8 h-8" />,
      title: "Emergency Alerts",
      desc: "Quick push updates for urgent situations so everyone acts accurately.",
    },
  ];

  return (
    <>
      {showHeader && <Header />}
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden relative">
        
        {/* Premium Background Layers */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-multiply"></div>
          <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[150px] mix-blend-multiply animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] mix-blend-multiply"></div>
        </div>

        <main>
          {/* --- HERO SECTION --- */}
          <section className="relative px-6 pt-32 pb-24 md:px-12 flex flex-col items-center text-center z-10">
            
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/60 border border-white/40 text-indigo-900 text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-xl shadow-indigo-900/5 backdrop-blur-xl hover:scale-105 transition-transform cursor-default">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              Next-Gen Community OS
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[1.05] text-slate-900 max-w-5xl mb-8 tracking-tighter drop-shadow-sm">
              The premium protocol for {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 block mt-2 pb-2">
                modern societies.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl font-medium leading-relaxed mb-14 drop-shadow-sm">
              Elevate your community living. Unify administration, payments, and security in one seamless, architecturally stunning interface.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 relative z-20">
              <button
                onClick={() => navigate("/login")}
                className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-3xl font-black text-xl hover:from-indigo-500 hover:to-blue-500 transition-all shadow-[0_8px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-4 group"
              >
                Enter Platform 
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => scrollToId("features")}
                className="px-10 py-5 bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-3xl font-black text-xl text-slate-700 shadow-xl shadow-slate-200/20 hover:bg-white hover:border-indigo-100 hover:text-indigo-600 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Discover Features
              </button>
            </div>

            {/* Product Preview Image */}
            <div className="mt-28 relative w-full max-w-6xl rounded-[2.5rem] border border-white shadow-[0_20px_80px_rgba(30,58,138,0.15)] overflow-hidden group bg-white/40 p-3 backdrop-blur-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/20 pointer-events-none hidden md:block z-0 blur-xl"></div>
              <div className="rounded-[2rem] overflow-hidden relative z-10 border border-slate-100 shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20"></div>
                
                {/* Simulated Glass Browser Header */}
                <div className="h-12 bg-slate-900/90 backdrop-blur-md w-full flex items-center px-6 gap-2 border-b border-indigo-500/20">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <div className="ml-4 px-4 py-1.5 rounded-lg bg-black/40 text-[10px] font-mono text-slate-400 border border-slate-700/50 flex flex-1 max-w-md mx-auto items-center justify-center">
                    <Lock size={10} className="mr-2 text-emerald-400" /> platform.esociety.com
                  </div>
                </div>

                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
                  alt="Modern Building Infrastructure"
                  className="w-full h-auto object-cover transform transition-transform duration-[3000ms] group-hover:scale-105"
                />
              </div>
            </div>
          </section>

          {/* --- TRUST STATS --- */}
          <section className="px-6 md:px-12 -mt-12 relative z-20">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  value="Faster"
                  label="Maintenance tracking"
                  hint="Zero friction payment gateways."
                />
                <StatCard
                  value="Smarter"
                  label="Security protocols"
                  hint="Digital approvals in milliseconds."
                />
                <StatCard
                  value="Clearer"
                  label="Resident engagement"
                  hint="Instant broadcast notifications."
                />
              </div>
            </div>
          </section>

          {/* --- MODULES / FEATURES SECTION --- */}
          <section id="features" className="py-32 px-6 md:px-12 bg-gray-50/50 mt-20 border-y border-gray-100">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100/50 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-200/50">
                    <Building2 size={14} /> Ecosystem
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                    The absolute standard in society management.
                  </h2>
                </div>
                <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-md">
                  We eliminated the friction of old-school ledgers and WhatsApp groups. Everything your committee needs is strictly organized here.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {modules.map((m) => (
                  <FeatureCard key={m.title} icon={m.icon} title={m.title} desc={m.desc} />
                ))}
              </div>
            </div>
          </section>

          {/* --- HOW IT WORKS --- */}
          <section className="py-32 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="mb-16 text-center max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
                  Engineered for simplicity.
                </h2>
                <p className="text-gray-500 font-medium text-lg leading-relaxed">
                  Three distinct dashboards specifically tailored for the daily routines of Residents, Admins, and Security Guards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StepCard
                  number="01"
                  title="Assign Roles"
                  desc="Users log into their secure, dedicated interfaces without seeing irrelevant data."
                />
                <StepCard
                  number="02"
                  title="Utilize Modules"
                  desc="Pay dues, approve guests, or dispatch notices with less than 3 clicks."
                />
                <StepCard
                  number="03"
                  title="Automate Work"
                  desc="Let the platform handle the syncing, alerting, and logging accurately 24/7."
                />
              </div>
            </div>
          </section>

          {/* --- FINAL CTA --- */}
          <section id="cta" className="py-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[40px] bg-gray-900 border border-gray-800 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-blue-600/10 to-transparent pointer-events-none"></div>
              
              <div className="relative p-12 md:p-20 text-center z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center font-black text-white text-3xl shadow-lg border border-white/10 mb-8 backdrop-blur-md">
                  E
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
                  Initiate the<br className="md:hidden" /> Protocol.
                </h2>
                <p className="text-gray-400 font-medium text-lg max-w-xl mx-auto leading-relaxed mb-12">
                  Stop managing your society via messy chat groups and outdated ledgers. Step into the future of automated community infrastructure.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-auto">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-10 py-4 bg-white text-gray-900 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all shadow-lg shadow-white/10 active:scale-95 flex items-center justify-center gap-3 w-full sm:w-auto"
                  >
                    Enter Dashboard
                  </button>
                  <button
                    onClick={() => scrollToId("features")}
                    className="px-10 py-4 bg-gray-800 border border-gray-700 text-white rounded-2xl font-bold text-lg hover:bg-gray-700 transition-all active:scale-95 w-full sm:w-auto"
                  >
                    Review Software
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {showFooter && <Footer />}
      </div>
    </>
  );
}

// Sub-components
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 bg-white rounded-3xl border border-gray-100 hover:border-indigo-100/50 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 group">
      <div className="mb-6 p-4 bg-gray-50 border border-gray-100 rounded-2xl w-fit group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-3 text-gray-900 tracking-tight">{title}</h3>
      <p className="text-gray-500 leading-relaxed font-medium text-sm">{desc}</p>
    </div>
  );
}

function StatCard({ value, label, hint }) {
  return (
    <div className="relative p-10 bg-white/60 backdrop-blur-2xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(79,70,229,0.1)] transition-all overflow-hidden w-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/10 transition-colors"></div>
      <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-700 to-blue-500 tracking-tighter mb-4">{value}</div>
      <div className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-3">{label}</div>
      <div className="text-slate-500 font-medium leading-relaxed mt-2 text-sm">{hint}</div>
    </div>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div className="p-8 bg-white rounded-3xl border border-gray-100 hover:border-gray-200 transition-all shadow-sm group">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-400 font-black tracking-widest uppercase mb-6 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-colors">
        {number}
      </div>
      <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-3">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}