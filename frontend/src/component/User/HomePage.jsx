import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaFileInvoiceDollar,
  FaBullhorn,
  FaArrowRight,
  FaLock,
  FaBell,
  FaUsers,
  FaClipboardList,
} from "react-icons/fa";
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
      icon: <FaFileInvoiceDollar className="text-emerald-500" />,
      title: "Maintenance Billing",
      desc: "Generate invoices and track payments for every flat in seconds.",
    },
    {
      icon: <FaBullhorn className="text-orange-500" />,
      title: "Instant Notices",
      desc: "Send meetings, water cuts, and announcements without delays.",
    },
    {
      icon: <FaShieldAlt className="text-blue-600" />,
      title: "Security Desk",
      desc: "Handle visitor entry/exit and keep residents informed in real time.",
    },
    {
      icon: <FaUsers className="text-purple-600" />,
      title: "Visitor Management",
      desc: "Streamlined check-ins so guards can focus on safety.",
    },
    {
      icon: <FaClipboardList className="text-sky-600" />,
      title: "Facility Booking",
      desc: "Book amenities and keep requests organized for your society.",
    },
    {
      icon: <FaBell className="text-rose-600" />,
      title: "Emergency Alerts",
      desc: "Quick updates for urgent situations so everyone acts faster.",
    },
  ];

  return (
    <>
      {showHeader && <Header />}
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-700">
        <main>
          {/* --- HERO SECTION --- */}
          <section className="relative px-6 pt-24 pb-24 md:px-12 flex flex-col items-center text-center overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 -left-20 w-80 h-80 bg-blue-100 rounded-full blur-[120px] opacity-40 -z-10"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-100 rounded-full blur-[120px] opacity-40 -z-10"></div>

            {/* #1 Watermark */}
            <div className="absolute inset-x-0 top-14 flex justify-center -z-10 pointer-events-none">
              <div className="text-[140px] md:text-[220px] font-black leading-none text-gray-100/80 select-none">
                #1
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-8 animate-bounce">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Ranked #1 for Society Management
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[0.95] text-gray-900 max-w-5xl mb-8 tracking-tighter">
              Be{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                #1
              </span>{" "}
              in maintenance, security & community updates.
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-medium leading-relaxed mb-10">
              E-Society helps residents, admins, and security guards work from one dashboard
              so notices are instant, payments are smoother, and issues get resolved faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={() => navigate("/login")}
                className="px-12 py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-2xl shadow-gray-300 active:scale-95 flex items-center gap-3"
              >
                Get Started <FaArrowRight />
              </button>

              <button
                onClick={() => scrollToId("features")}
                className="px-12 py-5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-blue-200 hover:bg-gray-50 transition-all active:scale-95 text-gray-700"
              >
                View Modules
              </button>
            </div>

            {/* Product Preview Image */}
            <div className="mt-20 relative w-full max-w-6xl rounded-[40px] border-[12px] border-white shadow-2xl shadow-blue-100 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400"
                alt="Society management dashboard preview"
                className="w-full h-auto object-cover transform transition duration-1000 group-hover:scale-105"
              />
            </div>
          </section>

          {/* --- TRUST STATS --- */}
          <section className="px-6 md:px-12 -mt-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  value="Faster"
                  label="Maintenance resolution"
                  hint="Residents report issues instantly."
                />
                <StatCard
                  value="Smarter"
                  label="Security workflows"
                  hint="Guards get real-time visitor details."
                />
                <StatCard
                  value="Clearer"
                  label="Community communication"
                  hint="Notices reach everyone without delays."
                />
              </div>
            </div>
          </section>

          {/* --- MODULES / FEATURES SECTION --- */}
          <section id="features" className="py-20 px-6 md:px-12 bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <div className="max-w-xl">
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                    Everything you need to run like #1.
                  </h2>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed">
                    No more paper notices or manual follow-ups. Manage maintenance, billing, security, visitors, and facilities from one place.
                  </p>
                </div>
                <button
                  onClick={() => scrollToId("cta")}
                  className="text-blue-600 font-bold border-b-2 border-blue-600 pb-1 hover:text-blue-700 transition"
                >
                  Start as a #1 Society
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {modules.map((m) => (
                  <FeatureCard key={m.title} icon={m.icon} title={m.title} desc={m.desc} />
                ))}
              </div>
            </div>
          </section>

          {/* --- HOW IT WORKS --- */}
          <section className="py-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                  How it works (for a #1 community)
                </h2>
                <p className="text-gray-500 font-medium text-lg leading-relaxed mt-4">
                  Simple flows for residents, admins, and security so work gets done quickly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StepCard
                  number="01"
                  title="Sign in and choose your role"
                  desc="Residents, admins, and guards access the right dashboard instantly."
                />
                <StepCard
                  number="02"
                  title="Use modules to stay on top"
                  desc="Maintenance, notices, visitors, and bookings are all in one place."
                />
                <StepCard
                  number="03"
                  title="Track progress and communicate"
                  desc="Everyone sees updates, so issues resolve faster and fewer things get missed."
                />
              </div>
            </div>
          </section>

          {/* --- TESTIMONIALS --- */}
          <section className="py-20 px-6 md:px-12 bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                  Built for societies that want to lead
                </h2>
                <p className="text-gray-500 font-medium text-lg leading-relaxed mt-4">
                  A modern system that makes daily society operations feel effortless.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <QuoteCard
                  quote="We stopped chasing updates. Maintenance requests, notices, and security info are all in one dashboard."
                  name="Neha R."
                  role="Resident"
                />
                <QuoteCard
                  quote="The modules are clean and practical. Our committee spends less time on manual work."
                  name="Vikram S."
                  role="Society Admin"
                />
                <QuoteCard
                  quote="Visitor handling is faster now. Alerts reach everyone quickly during urgent situations."
                  name="Arjun P."
                  role="Security Guard"
                />
              </div>
            </div>
          </section>

          {/* --- FINAL CTA --- */}
          <section id="cta" className="py-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[40px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
              <div className="absolute -top-16 -right-20 w-80 h-80 bg-blue-200/40 rounded-full blur-[100px]"></div>
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-[120px]"></div>

              <div className="relative p-8 md:p-14 text-center">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
                  Ready to be #1?
                </h2>
                <p className="text-gray-600 font-medium text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
                  Start with the dashboard today and make your society's day-to-day operations faster and clearer.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-5 mt-10">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-12 py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-2xl shadow-gray-300 active:scale-95 flex items-center justify-center gap-3 mx-auto"
                  >
                    Login to Dashboard <FaArrowRight />
                  </button>
                  <button
                    onClick={() => scrollToId("features")}
                    className="px-12 py-5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-blue-200 hover:bg-gray-50 transition-all active:scale-95 text-gray-700 mx-auto"
                  >
                    See Modules
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

function StatCard({ value, label, hint }) {
  return (
    <div className="p-8 bg-white rounded-[30px] border border-gray-100 shadow-sm">
      <div className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{value}</div>
      <div className="text-lg font-extrabold text-gray-800 mt-3">{label}</div>
      <div className="text-gray-500 font-medium leading-relaxed mt-2 text-sm md:text-base">{hint}</div>
    </div>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div className="p-8 bg-white rounded-[32px] border border-gray-100 hover:border-blue-100 transition-all shadow-sm">
      <div className="w-fit px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-black text-[11px] tracking-widest uppercase">
        {number}
      </div>
      <h3 className="text-2xl font-extrabold text-gray-900 mt-5 tracking-tight">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed mt-3">{desc}</p>
    </div>
  );
}

function QuoteCard({ quote, name, role }) {
  return (
    <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm">
      <div className="text-3xl text-blue-600 font-black leading-none">"</div>
      <p className="text-gray-700 font-medium leading-relaxed mt-3">{quote}</p>
      <div className="flex items-center gap-3 mt-6">
        <div className="w-10 h-10 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center font-black text-gray-700">
          <FaLock size={16} />
        </div>
        <div className="text-left">
          <div className="font-extrabold text-gray-900">{name}</div>
          <div className="text-sm text-gray-500 font-semibold">{role}</div>
        </div>
      </div>
    </div>
  );
}