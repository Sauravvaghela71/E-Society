import React from 'react';
import { 
  User, MapPin, Hash, Phone, Mail, 
  Info, ShieldCheck, CreditCard, Users, 
  Car, Calendar, Edit3 
} from 'lucide-react';

const FlatDetails = () => {
  const flatData = {
    flatNo: "A-104",
    wing: "Blue Diamond",
    floor: "1st Floor",
    type: "3 BHK",
    area: "1450 Sq.Ft",
    status: "Owned",
    owner: {
      name: "Rahul Sharma",
      phone: "+91 98765 43210",
      email: "rahul.sharma@example.com",
      members: 4
    },
    maintenanceStatus: "Paid",
    lastPaid: "05 March 2024"
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Flat Details</h1>
          <p className="text-slate-500 font-medium">Detailed information about your residence.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
          <Edit3 size={18} /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: FLAT OVERVIEW --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
              <Hash size={40} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black text-slate-800">{flatData.flatNo}</h2>
            <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mt-1">{flatData.wing} Wing</p>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-slate-400 text-[10px] font-bold uppercase">Floor</p>
                <p className="text-slate-700 font-bold">{flatData.floor}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-slate-400 text-[10px] font-bold uppercase">Type</p>
                <p className="text-slate-700 font-bold">{flatData.type}</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <CreditCard className="absolute -right-4 -bottom-4 opacity-10 w-32 h-32 rotate-12" />
            <p className="text-indigo-100 text-sm font-medium">Maintenance Status</p>
            <div className="flex items-center gap-2 mt-1">
              <ShieldCheck className="text-emerald-400" size={20} />
              <h3 className="text-2xl font-bold tracking-tight">{flatData.maintenanceStatus}</h3>
            </div>
            <p className="text-indigo-200 text-xs mt-4">Last Payment: {flatData.lastPaid}</p>
          </div>
        </div>

        {/* --- RIGHT COLUMN: DETAILED INFO --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Owner Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <User className="text-indigo-600" size={24} /> Primary Resident
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DetailItem icon={<User />} label="Full Name" value={flatData.owner.name} />
              <DetailItem icon={<Phone />} label="Phone Number" value={flatData.owner.phone} />
              <DetailItem icon={<Mail />} label="Email Address" value={flatData.owner.email} />
              <DetailItem icon={<Users />} label="Family Members" value={`${flatData.owner.members} Persons`} />
            </div>
          </div>

          {/* Property Specifications */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <Info className="text-indigo-600" size={24} /> Specifications
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DetailItem icon={<MapPin />} label="Area Size" value={flatData.area} />
              <DetailItem icon={<ShieldCheck />} label="Ownership" value={flatData.status} />
              <DetailItem icon={<Car />} label="Parking Slots" value="P-202, P-203" />
              <DetailItem icon={<Calendar />} label="Possession Date" value="12 Oct 2021" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Reusable Detail Component ---
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 group">
    <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className="text-slate-700 font-bold text-lg">{value}</p>
    </div>
  </div>
);

export default FlatDetails;