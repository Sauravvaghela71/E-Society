import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FileText, Plus, Trash2, Edit3, Loader, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function Notice() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5100/api/notice";

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setNotices(data);
    } catch (err) {
      console.error("Failed to fetch notices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
      } else {
        await axios.post(API_URL, data);
      }
      fetchNotices();
      closeForm();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error saving record.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setNotices(notices.filter((n) => n._id !== id));
    } catch (err) {
      alert("Error deleting record.");
    }
  };

  const handleEdit = (notice) => {
    setEditingId(notice._id);
    const editData = { ...notice };
    if (editData.noticeDate) {
      editData.noticeDate = new Date(editData.noticeDate).toISOString().split("T")[0];
    }
    reset(editData);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    reset({});
  };

  const getPriorityStyle = (priority) => {
    if (priority === "High") return "bg-red-100 text-red-700 border-red-200";
    if (priority === "medium") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const isNew = (dateString) => {
    const noticeDate = new Date(dateString);
    const today = new Date();
    return noticeDate.toDateString() === today.toDateString();
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">Notice Board</h1>
              <p className="text-gray-500 text-sm mt-1">Manage and publish real-time society notices</p>
            </div>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus size={18} /> Publish Notice
            </button>
          )}
        </div>

        {/* FORM */}
        {showForm && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h2 className="text-xl font-black text-gray-800">
                {editingId ? "Update Existing Notice" : "Draft New Notice"}
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Notice Title *</label>
                  <input
                    type="text"
                    {...register("title", { required: true })}
                    className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.title ? "border-red-500" : "border-gray-200"}`}
                    placeholder="E.g., Water Supply Interruption"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Notice Date</label>
                  <input
                    type="date"
                    {...register("noticeDate")}
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Description *</label>
                <textarea
                  {...register("description", { required: true })}
                  rows="4"
                  className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none ${errors.description ? "border-red-500" : "border-gray-200"}`}
                  placeholder="Detailed explanation of the notice..."
                ></textarea>
              </div>

              <div className="grid md:grid-cols-2 gap-6 p-5 bg-gray-50 rounded-xl">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Priority Level</label>
                  <select {...register("priority")} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium">
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Publish Status</label>
                  <select {...register("status")} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium">
                    <option value="Active">Active (Visible)</option>
                    <option value="inActive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all">
                  {editingId ? "Update Notice" : "Broadcast Notice"}
                </button>
                <button type="button" onClick={closeForm} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LIST */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader size={30} className="animate-spin text-blue-500 mb-4" />
            <p className="font-semibold text-lg">Fetching live notices...</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FileText size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700">No notices published yet</h3>
            <p className="text-gray-500 mt-2 max-w-sm">Create your first notice to broadcast information to the society dashboard.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices.map((notice) => (
              <div key={notice._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col">
                <div className={`h-1.5 w-full ${notice.status === "inActive" ? "bg-gray-300" : notice.priority === "High" ? "bg-red-500" : notice.priority === "medium" ? "bg-yellow-400" : "bg-green-500"}`} />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${getPriorityStyle(notice.priority)}`}>
                      {notice.priority}
                    </span>
                    {isNew(notice.noticeDate) && notice.status !== "inActive" && (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded-md animate-pulse">
                         New Today
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-gray-800 line-clamp-2 leading-tight mb-2">
                    {notice.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                    {notice.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-6 bg-gray-50 w-fit px-3 py-1.5 rounded-lg border border-gray-100">
                    <Clock size={12} className="text-gray-500" />
                    {new Date(notice.noticeDate).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className={`text-xs font-bold flex items-center gap-1 ${notice.status === "Active" ? "text-green-600" : "text-gray-400"}`}>
                      {notice.status === "Active" ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                      {notice.status === "Active" ? "Published" : "Hidden"}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(notice)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(notice._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
