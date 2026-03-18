import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Loader, Plus, MapPin, Edit3, Trash2, CalendarHeart } from "lucide-react";

export default function Facilities() {
  const { register, handleSubmit, reset } = useForm();
  const [facilities, setFacilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const API_URL = "http://localhost:5100/api/facilities";

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resFac, resBook] = await Promise.all([
        axios.get(API_URL),
        axios.get(`${API_URL}/bookings`)
      ]);
      setFacilities(resFac.data.data || []);
      setBookings(resBook.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
      } else {
        await axios.post(API_URL, data);
      }
      fetchData();
      closeForm();
    } catch (err) {
      alert("Error saving facility.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this facility?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setFacilities(facilities.filter(f => f._id !== id));
    } catch (err) {
      alert("Error deleting record.");
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/bookings/${id}/status`, { status });
      // update state
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
      if (selectedRequest && selectedRequest._id === id) {
        setSelectedRequest(null);
      }
    } catch (err) {
      alert("Failed to update booking status.");
    }
  };

  const handleEdit = (fac) => {
    setEditingId(fac._id);
    reset(fac);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    reset({});
  };

  if (loading) return <div className="p-8">Loading Facilities & Bookings...</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <CalendarHeart size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">Shared Amenities</h1>
              <p className="text-gray-500 text-sm mt-1">Manage society facilities and track residents' bookings</p>
            </div>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <Plus size={18} /> Add Facility
            </button>
          )}
        </div>

        {/* FORM */}
        {showForm && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-green-50 animate-in fade-in">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h2 className="text-xl font-black text-gray-800">
                {editingId ? "Update Facility" : "Add New Facility"}
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Facility Name</label>
                  <input {...register("name", { required: true })} className="w-full border p-3 rounded-xl focus:ring-green-500 outline-none" placeholder="e.g. Club House" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Location / Map Pin</label>
                  <input {...register("location", { required: true })} className="w-full border p-3 rounded-xl focus:ring-green-500 outline-none" placeholder="e.g. Roof Top, Wing A" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Booking Price (₹)</label>
                  <input type="number" {...register("price", { required: true })} className="w-full border p-3 rounded-xl focus:ring-green-500 outline-none" placeholder="e.g. 500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Current Status</label>
                  <select {...register("status")} className="w-full border p-3 rounded-xl focus:ring-green-500 outline-none">
                    <option value="Available">Available</option>
                    <option value="Maintenance">Under Maintenance</option>
                    <option value="closed">Permanently Closed</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Opening Time</label>
                  <input type="time" {...register("openingTime", { required: true })} className="w-full border p-3 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Closing Time</label>
                  <input type="time" {...register("closingTime", { required: true })} className="w-full border p-3 rounded-xl outline-none" />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-green-700">Save Facility</button>
                <button type="button" onClick={closeForm} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Active Facilities */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4">Manage Facilities</h2>
            <div className="space-y-4">
              {facilities.map((fac) => (
                <div key={fac._id} className="border border-gray-100 p-4 rounded-xl flex items-center justify-between hover:shadow-sm">
                  <div>
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      {fac.name} 
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                        fac.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {fac.status}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={12}/> {fac.location}</p>
                    <p className="text-sm font-black text-blue-600 mt-2">₹{fac.price} / slot</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(fac)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit3 size={16}/></button>
                    <button onClick={() => handleDelete(fac._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bookings Overview */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4">Latest Resident Bookings</h2>
            <div className="space-y-4">
              {bookings.slice(0, 10).map((b) => (
                 <div 
                   key={b._id} 
                   onClick={() => setSelectedRequest(b)}
                   className="bg-gray-50 border border-gray-100 p-4 flex gap-4 rounded-xl items-center relative overflow-hidden group hover:border-blue-200 cursor-pointer transition-all hover:bg-white hover:shadow-md"
                 >
                    <div className="bg-blue-100 text-blue-700 p-2 rounded-lg text-center min-w-[50px]">
                      <span className="block text-lg font-black leading-none">{new Date(b.bookingDate).getDate()}</span>
                      <span className="text-[10px] uppercase font-bold">{new Date(b.bookingDate).toLocaleDateString('en-US', {month: 'short'})}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 flex items-center gap-2" title="Click to view full resident request">
                        {b.resident?.Name || "Deleted Resident"}
                        <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : b.status === "Pending" ? "bg-orange-100 text-orange-700 animate-pulse" : "bg-red-100 text-red-700"}`}>
                          {b.status || 'Confirmed'}
                        </span>
                      </p>
                      <p className="text-sm font-bold text-gray-600">{b.facility?.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{b.timeSlot}</p>
                    </div>
                    <div className="text-right flex flex-col items-end justify-center">
                      <span className="block text-green-600 font-black text-sm mb-1 line-clamp-1">₹{b.amountPaid}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold uppercase transition-all group-hover:scale-105">View Request</span>
                    </div>
                 </div>
              ))}
              {bookings.length === 0 && <p className="text-center text-gray-400 py-8">No bookings found</p>}
            </div>
          </div>

        </div>
      </div>

      {/* Resident Request Profile Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden mx-4 scale-100 animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center text-white">
              <div>
                <h2 className="text-xl font-black">Resident Request Form</h2>
                <p className="text-blue-100 text-sm opacity-90">Booking detailed review and approval</p>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="text-white hover:text-gray-200 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20">&times;</button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-black text-2xl shadow-inner border-2 border-white">
                  {selectedRequest.resident?.Name?.[0] || 'R'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{selectedRequest.resident?.Name || 'Unknown Resident'}</h3>
                  <div className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-1">
                    Wing {selectedRequest.resident?.blockWing || '?'} - Flat {selectedRequest.resident?.flatNumber || '?'}
                  </div>
                  <div className="text-sm text-gray-600 flex gap-4 mt-2">
                     <span>📞 {selectedRequest.resident?.mobileNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-3 border rounded-xl">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Facility Requested</p>
                    <p className="font-black text-gray-800 mt-1">{selectedRequest.facility?.name}</p>
                </div>
                <div className="p-3 border rounded-xl">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Requested Date</p>
                    <p className="font-black text-blue-600 mt-1">{new Date(selectedRequest.bookingDate).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="p-3 border rounded-xl col-span-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Time Slot</p>
                      <p className="font-black text-gray-800 mt-1">{selectedRequest.timeSlot}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Sent</p>
                      <p className="font-black text-green-600 mt-1">₹{selectedRequest.amountPaid} <span className="text-[10px] bg-green-100 px-1 py-0.5 rounded text-green-800 uppercase">{selectedRequest.paymentStatus}</span></p>
                    </div>
                </div>
              </div>

              <div className="flex gap-4">
                {selectedRequest.status === "Pending" ? (
                  <>
                    <button onClick={() => handleUpdateBookingStatus(selectedRequest._id, 'Confirmed')} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl shadow-lg shadow-green-600/20 transition-all uppercase tracking-wider">
                      Approve Request
                    </button>
                    <button onClick={() => handleUpdateBookingStatus(selectedRequest._id, 'Cancelled')} className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-black py-4 rounded-xl shadow-inner transition-all uppercase tracking-wider">
                      Decline
                    </button>
                  </>
                ) : (
                  <button onClick={() => setSelectedRequest(null)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 rounded-xl transition-all uppercase tracking-wider">
                    Close Details (Currently {selectedRequest.status})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
