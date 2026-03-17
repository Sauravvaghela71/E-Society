import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Calendar, Edit3, Download, Camera } from 'lucide-react';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 1. LocalStorage se user info aur token nikalna
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const token = localStorage.getItem("user_token");

        if (!storedUser._id) {
          console.error("No user found in localStorage");
          return;
        }

        // 2. Specific user ID ke sath API call karna
        const res = await axios.get(`http://localhost:5100/api/user/${storedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchUser();
  }, []);

  // 2. Profile Update handle karna
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const res = await axios.put(`http://localhost:5100/api/user/${user._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local storage as well so navbar stays synced
      localStorage.setItem("user", JSON.stringify(res.data));
      
      setUser(res.data);
      setIsEditing(false);
      alert("Profile Updated!");
    } catch (err) {
      alert("Update failed!");
    }
  };

  if (!user) return <div className="p-10 text-center font-bold">Loading...</div>;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-xl overflow-hidden">
            <img src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <button className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-lg border-2 border-white">
            <Camera size={20} />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          {isEditing ? (
            <input 
              className="text-3xl font-black border-b-2 border-blue-500 outline-none w-full"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          ) : (
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{user.name}</h1>
          )}
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 font-semibold text-sm mt-4">
            <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl"><MapPin size={16} /> {user.flat || user.role}</span>
            <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl"><Calendar size={16} /> Joined {user.memberSince || 'N/A'}</span>
          </div>
        </div>

        <button 
          onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold shadow-lg transition-all ${isEditing ? 'bg-emerald-500' : 'bg-slate-900'} text-white`}
        >
          <Edit3 size={18} /> {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <InfoItem icon={Mail} label="Email" value={user.email} color="text-blue-500" bg="bg-blue-50" />
                {isEditing && (
                   <input 
                    className="w-full p-2 border rounded-lg text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                   />
                )}
              </div>
              <div className="space-y-4">
                <InfoItem icon={Phone} label="Phone" value={user.phone} color="text-emerald-500" bg="bg-emerald-50" />
                {isEditing && (
                   <input 
                    className="w-full p-2 border rounded-lg text-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                   />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value, color, bg }) => (
  <div className={`flex items-center gap-4 p-4 rounded-xl ${bg}`}>
    <Icon size={20} className={color} />  
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-semibold text-slate-800">{value}</p>
    </div>
  </div>
);

export default UserProfile;