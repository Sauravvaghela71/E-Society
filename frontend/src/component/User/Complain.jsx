import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Loader, Plus, MessageCircle, AlertCircle, Clock, CheckCircle2, ChevronRight, MessageSquare } from "lucide-react";

export default function UserComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Get current user details from local storage
  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  };

  const currentUser = getCurrentUser();
  const userId = currentUser._id;
  
  const residentName = currentUser.firstName 
    ? `${currentUser.firstName} ${currentUser.lastName || ''}` 
    : currentUser.email?.split('@')[0] || "Resident";

  const API_URL = "http://localhost:5100/api/complaint";

  const fetchComplaints = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/user/${userId}`);
      setComplaints(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [userId]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        userId: userId,
        name: residentName,
        mobile: currentUser.mobileNumber || "N/A",
        wing: currentUser.blockWing || "N/A",
        flat: currentUser.flatNumber || "N/A",
        status: "Pending",
        priority: "Medium"
      };

      await axios.post(API_URL, payload);
      alert("Complaint submitted successfully!");
      setShowForm(false);
      reset();
      fetchComplaints();
    } catch (err) {
      alert("Error submitting complaint.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "text-orange-600 bg-orange-100";
      case "In Progress": return "text-blue-600 bg-blue-100";
      case "Resolved": return "text-green-600 bg-green-100";
      case "Closed": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Clock size={16} />;
      case "In Progress": return <Loader size={16} className="animate-spin" />;
      case "Resolved": return <CheckCircle2 size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  if (loading) return <div className="p-8"><Loader className="animate-spin text-orange-500" /></div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <MessageCircle size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">My Complaints</h1>
              <p className="text-gray-500 text-sm mt-1">Track your requests and admin responses</p>
            </div>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <Plus size={18} /> Raise Complaint
            </button>
          )}
        </div>

        {/* CREATE COMPLAINT MODAL */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 mx-4">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                  <AlertCircle className="text-orange-500" /> New Complaint
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-800 text-2xl leading-none">&times;</button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Category</label>
                  <select {...register("category", { required: true })} className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-orange-500 outline-none">
                    <option value="">Select Category</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Cleaning">Cleaning / Hygiene</option>
                    <option value="Security">Security Issue</option>
                    <option value="Noise">Noise / Disturbance</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.category && <span className="text-red-500 text-xs mt-1">Required</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Location/Area (Optional)</label>
                  <input {...register("location")} placeholder="e.g. Lobby, Flat entrance" className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-orange-500 outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Detailed Description</label>
                  <textarea {...register("description", { required: true })} rows={4} placeholder="Describe the exact issue..." className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-orange-500 outline-none resize-none"></textarea>
                  {errors.description && <span className="text-red-500 text-xs mt-1">Required</span>}
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors">Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ALREADY CREATED COMPLAINTS */}
        {!showForm && complaints.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
             <MessageSquare size={48} className="text-gray-300 mb-4" />
             <h3 className="text-xl font-bold text-gray-800">No Complaints Found</h3>
             <p className="text-gray-500 mt-2 max-w-sm">You haven't raised any complaints yet. Things must be running smoothly!</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {complaints.map(c => (
              <div key={c._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {c.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${getStatusColor(c.status)}`}>
                    {getStatusIcon(c.status)} {c.status}
                  </span>
                </div>
                
                <p className="text-gray-800 font-medium mb-4 line-clamp-3">{c.description}</p>
                
                {c.location && (
                  <p className="text-xs font-semibold text-gray-500 mb-4 flex items-center gap-1">
                    <span className="text-orange-400 font-black">•</span> Location: {c.location}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">Admin Response</p>
                  
                  {c.adminResponse ? (
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded-r-lg">
                      <p className="text-sm font-semibold text-gray-800">{c.adminResponse}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold">
                      <Clock size={14} /> Waiting for admin review...
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-between text-[10px] uppercase font-bold text-gray-400">
                  <span>Logged on: {new Date(c.createdAt).toLocaleDateString()}</span>
                  {c.resolveAt && <span>Resolved on: {new Date(c.resolveAt).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}