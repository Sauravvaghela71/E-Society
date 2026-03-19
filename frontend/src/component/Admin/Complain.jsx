import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for update
  const [updateStatus, setUpdateStatus] = useState("");
  const [updatePriority, setUpdatePriority] = useState("");
  const [adminNote, setAdminNote] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5100/api/complaint");
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    setUpdateStatus(complaint.status);
    setUpdatePriority(complaint.priority);
    setAdminNote(complaint.adminResponse || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
    setAdminNote("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5100/api/complaint/${selectedComplaint._id}`, {
        status: updateStatus,
        priority: updatePriority,
        adminResponse: adminNote,
      });

      if (res.status === 200) {
        toast.success("Complaint updated successfully!");
        fetchComplaints(); // Refresh table
        closeModal();
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update complaint");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
      case "Closed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
      case "Urgent":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-semibold text-lg">Loading Complaints...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Complaints</h1>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-600">Complainant</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600">Unit / Mobile</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600">Category</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600">Priority</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {complaints.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500 font-medium">
                  No complaints registered yet.
                </td>
              </tr>
            ) : (
              complaints.map((comp) => (
                <tr key={comp._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{comp.name || "Unknown"}</p>
                    <p className="text-xs text-gray-500 max-w-[200px] truncate" title={comp.description}>
                      {comp.description}
                    </p>
                    {comp.photo && (
                      <a href={comp.photo} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline font-bold mt-1 inline-block bg-blue-50 px-2 py-0.5 rounded">
                        View Attached Photo
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-700">Flat: {comp.flat || "-"} / Wing: {comp.wing || "-"}</p>
                    <p className="text-xs text-gray-500">{comp.mobile || "-"}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">{comp.category || "-"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(comp.priority)}`}>
                      {comp.priority || "Medium"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(comp.status)}`}>
                      {comp.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => openModal(comp)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Respond
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Respond to Complaint</h2>
            
            <div className="mb-6 space-y-3">
              <div>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Complainant</span>
                <p className="font-medium text-gray-800">{selectedComplaint.name}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Description</span>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border mt-1">{selectedComplaint.description}</p>
              </div>
              {selectedComplaint.photo && (
                <div>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Attached Photo Proof</span>
                  <div className="mt-1 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                     <img src={selectedComplaint.photo} alt="Proof" className="max-h-48 object-contain rounded" />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Update Status</label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Update Priority</label>
                  <select
                    value={updatePriority}
                    onChange={(e) => setUpdatePriority(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Response to Resident <span className="font-normal text-gray-400">(message visible to the resident)</span>
                </label>
                <textarea
                  rows="3"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. We have received your complaint and our team will resolve it within 24 hours."
                  className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-8 border-t pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-100 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
