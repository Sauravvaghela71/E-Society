import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Calendar, Edit3, Camera, MessageSquare, Clock, CheckCircle, AlertCircle, Loader, Users } from 'lucide-react';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(true);
  const [visitors, setVisitors] = useState([]);
  const [visitorsLoading, setVisitorsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser && storedUser._id) {
      setUser(storedUser);
      setFormData(storedUser);
      fetchComplaints(storedUser._id);
      fetchVisitors(storedUser._id);
    }
  }, []);

  const fetchComplaints = async (userId) => {
    try {
      setComplaintsLoading(true);
      const res = await axios.get(`http://localhost:5100/api/complaint/user/${userId}`);
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setComplaintsLoading(false);
    }
  };

  const fetchVisitors = async (userId) => {
    try {
      setVisitorsLoading(true);
      const res = await axios.get(`http://localhost:5100/api/visitor/resident/${userId}`);
      setVisitors(res.data.data || []);
    } catch (err) {
      console.error("Error fetching visitors:", err);
    } finally {
      setVisitorsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:5100/api/user/${user._id}`, formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setIsEditing(false);
      alert("Profile Updated!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed!");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview instantly (optimistic UI)
    const localPreview = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, profilePic: localPreview }));

    const formDataUpload = new FormData();
    formDataUpload.append("profilePic", file);

    try {
      setUploading(true);
      const res = await axios.post(
        `http://localhost:5100/api/user/${user._id}/upload-photo`,
        formDataUpload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const newPicUrl = res.data.profilePic;

      // Update user state with the permanent Cloudinary URL
      const updatedUser = { ...user, profilePic: newPicUrl };
      setUser(updatedUser);

      // Sync localStorage so Header avatar also updates
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...storedUser, profilePic: newPicUrl }));

      alert("Profile photo updated successfully!");
    } catch (err) {
      console.error("Photo upload error:", err);
      alert(err.response?.data?.message || "Photo upload failed. Please try again.");
      // Revert preview on failure
      setUser((prev) => ({ ...prev, profilePic: user.profilePic }));
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
      case "Closed":
        return <CheckCircle size={16} className="text-green-500" />;
      case "In Progress":
        return <Clock size={16} className="text-blue-500" />;
      default:
        return <AlertCircle size={16} className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
      case "Closed":
        return "bg-green-100 text-green-700 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  if (!user) return <div className="p-10 text-center font-bold text-gray-500">Loading Profile...</div>;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header / Profile Card */}
      <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-xl overflow-hidden">
            <img
              src={user.profilePic || user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName || user.name || "U"}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />

          {/* Camera button triggers file picker */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            title="Change profile photo"
            className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-lg border-2 border-white hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {uploading ? <Loader size={20} className="animate-spin" /> : <Camera size={20} />}
          </button>
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          {isEditing ? (
            <input
              className="text-3xl font-black border-b-2 border-blue-500 outline-none w-full bg-transparent"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          ) : (
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{user.name || user.email || "Resident"}</h1>
          )}

          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 font-semibold text-sm mt-4">
            <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl">
              <MapPin size={16} /> {user.flat || user.role || "Resident"}
            </span>
            <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl">
              <Calendar size={16} /> {user.email}
            </span>
          </div>
        </div>

        <button
          onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold shadow-lg transition-all ${isEditing ? 'bg-emerald-500' : 'bg-slate-900'} text-white`}
        >
          <Edit3 size={18} /> {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* MY COMPLAINTS SECTION */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <MessageSquare size={22} className="text-blue-600" />
          <h2 className="text-xl font-bold text-slate-800">My Complaints</h2>
          <span className="ml-auto text-sm font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
            {complaints.length} Total
          </span>
        </div>

        {complaintsLoading ? (
          <p className="text-center text-gray-400 py-6">Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No complaints submitted yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((comp) => (
              <div
                key={comp._id}
                className="border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all bg-slate-50/50"
              >
                {/* Top Row */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-bold text-slate-800 text-base">{comp.category || "Complaint"}</p>
                    <p className="text-slate-500 text-sm mt-0.5">
                      {comp.wing && `Wing ${comp.wing}`} {comp.flat && `• Flat ${comp.flat}`}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(comp.status)}`}>
                    {getStatusIcon(comp.status)} {comp.status || "Pending"}
                  </span>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">{comp.description}</p>

                {/* Date */}
                <p className="text-xs text-slate-400 mt-2">
                  Submitted: {comp.createdAt ? new Date(comp.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "N/A"}
                </p>

                {/* Admin Response */}
                {comp.adminResponse ? (
                  <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                    <p className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1.5">
                      <MessageSquare size={13} /> Admin Response
                      {comp.respondedAt && (
                        <span className="font-normal text-blue-400 ml-1">
                          — {new Date(comp.respondedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      )}
                    </p>
                    <p className="text-blue-800 text-sm">{comp.adminResponse}</p>
                  </div>
                ) : (
                  <div className="mt-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-400 font-medium">Awaiting admin response...</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MY VISITORS SECTION */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100 mt-6">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <Users size={22} className="text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-800">My Visitors</h2>
          <span className="ml-auto text-sm font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
            {visitors.length} Total
          </span>
        </div>

        {visitorsLoading ? (
          <p className="text-center text-gray-400 py-6">Loading visitors...</p>
        ) : visitors.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No visitors recorded yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {visitors.map((visitor) => (
              <div
                key={visitor._id}
                className="border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-black text-slate-800 text-lg">{visitor.visitorName}</p>
                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-widest ${visitor.status === 'inside' ? 'bg-orange-100 text-orange-600' : visitor.status === 'Exited' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-600'}`}>
                      {visitor.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm font-semibold mb-3 flex items-center gap-2">
                    <Phone size={14} className="text-emerald-500"/> {visitor.mobileNumber}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    <span className="font-bold">Purpose:</span> {visitor.purpose}
                  </p>
                </div>
                
                <div className="pt-3 border-t border-slate-200 flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <span>Entry: {new Date(visitor.entryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <span>{new Date(visitor.entryTime).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default UserProfile;