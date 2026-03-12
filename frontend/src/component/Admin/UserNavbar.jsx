import React from 'react';
import Header from '../User/Header';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';  
import { 
  User, Home, CreditCard, ShieldCheck, 
  MessageCircle, LogOut, Car, Bell, Settings
} from 'lucide-react';

const UserNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // DASHBOARD CHECK: Agar path exact '/user' hai tabhi dashboard cards dikhenge
  const isDashboard = location.pathname === '/user' || location.pathname === '/user/';

  // Mock User Data
  const userData = {
    name: "Rahul Sharma",
    flat: "A-104, Blue Diamond",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col hidden lg:flex">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/user')}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Home className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">e-Society</span>
          </div>

          <nav className="space-y-1">
            <SidebarLink 
              icon={<Home size={20}/>} 
              label="Overview" 
              active={isDashboard} 
              onClick={() => navigate('/user')} 
            />
            <SidebarLink 
              icon={<User size={20}/>} 
              label="My Profile" 
              active={location.pathname.includes('profile')} 
              onClick={() => navigate('/user/profile')} 
            />
            <SidebarLink icon={<CreditCard size={20}/>} label="Payments" />
            <SidebarLink icon={<Car size={20}/>} label="My Vehicles" />
            <SidebarLink icon={<MessageCircle size={20}/>} label="Complaints" />
            <SidebarLink icon={<ShieldCheck size={20}/>} label="Visitor Logs" />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
          <button className="flex items-center gap-3 text-red-500 font-medium hover:bg-red-50 w-full p-3 rounded-xl transition">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header /> 

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            
            {/* CONDITION 1: DASHBOARD CONTENT (Sirf tab dikhega jab path /user ho) */}
            {isDashboard ? (
              <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Welcome, {userData.name}</h2>
                    <p className="text-slate-500">Here is what's happening in your society.</p>
                  </div>
                </div>

                {/* Quick Actions Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <ActionCard title="Due Amount" value="₹2,450" subtitle="Next due: 05 Apr" btnText="Pay Now" variant="indigo" />
                  <ActionCard title="Active Complaints" value="01" subtitle="Status: In-Progress" btnText="View Detail" variant="amber" />
                  <ActionCard title="Vehicle Entries" value="04" subtitle="Today's movement" btnText="Check Logs" variant="emerald" />
                </div>
                
                {/* Dashboard Specific Extra Info */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <p className="text-slate-500 italic text-center">Select "My Profile" from sidebar to see your details.</p>
                </div>
              </div>
            ) : (
              /* CONDITION 2: PROFILE/OTHER PAGES (Yahan UserProfile render hoga) */
              <div className="animate-in slide-in-from-right-4 duration-500">
                <Outlet />
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

// --- SMALL HELPER COMPONENTS (Usi file mein niche) ---

const SidebarLink = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
      active ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
    }`}
  >
    <span className={`${active ? 'text-indigo-600' : 'group-hover:text-slate-800'}`}>{icon}</span>
    <span className="font-semibold text-sm">{label}</span>
  </div>
);

const ActionCard = ({ title, value, subtitle, btnText, variant }) => {
  const colors = {
    indigo: 'bg-indigo-600 text-white',
    amber: 'bg-amber-500 text-white',
    emerald: 'bg-emerald-600 text-white'
  };
  return (
    <div className={`${colors[variant]} p-6 rounded-2xl shadow-lg`}>
      <p className="text-white/80 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold mt-1 mb-2">{value}</h3>
      <p className="text-white/70 text-xs mb-4">{subtitle}</p>
      <button className="w-full py-2 bg-white/20 backdrop-blur-md rounded-lg text-sm font-bold hover:bg-white/30 transition">
        {btnText}
      </button>
    </div>
  );
};

export default UserNavbar;