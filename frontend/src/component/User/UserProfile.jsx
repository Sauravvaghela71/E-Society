import React from 'react';
import { 
  Mail, Phone, MapPin, Calendar, ShieldCheck, 
  Edit3, Download, Camera, CreditCard 
} from 'lucide-react';

const UserProfile = () => {
  const user = {
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    flat: "A-104, Blue Diamond",
    memberSince: "January 2023",
    role: "Resident (Owner)",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/50 rounded-full -mr-20 -mt-20 z-0" />
        <div className="relative z-10">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-xl overflow-hidden">
            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <button className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-lg border-2 border-white">
            <Camera size={20} />
          </button>
        </div>
        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{user.name}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 font-semibold text-sm">
            <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl"><MapPin size={16} /> {user.flat}</span>
            <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl"><Calendar size={16} /> Joined {user.memberSince}</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg">
          <Edit3 size={18} /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoItem icon={Mail} label="Email" value={user.email} color="text-blue-500" bg="bg-blue-50" />
              <InfoItem icon={Phone} label="Phone" value={user.phone} color="text-emerald-500" bg="bg-emerald-50" />
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">Documents</h3>
            <div className="space-y-4">
              <DownloadCard title="Society Bylaws" size="2.4 MB" />
              <DownloadCard title="Possession Letter" size="1.1 MB" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, color, bg, label, value }) => (
  <div className="flex items-center gap-4">
    <div className={`p-4 ${bg} ${color} rounded-2xl`}><Icon size={24} /></div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-slate-700 font-bold">{value}</p>
    </div>
  </div>
);

const DownloadCard = ({ title, size }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm"><Download size={20} /></div>
      <div><p className="text-sm font-black text-slate-700">{title}</p><p className="text-[10px] text-slate-400 font-bold">{size}</p></div>
    </div>
  </div>
);

export default UserProfile;