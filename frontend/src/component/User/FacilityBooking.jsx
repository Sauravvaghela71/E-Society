import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader, Calendar, Clock, CreditCard, Dumbbell } from "lucide-react";

export default function FacilityBooking() {
  const [facilities, setFacilities] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  // This would ideally come from a central auth context
  // For demo purposes parsing from localStorage if available
  const getResidentProfileId = () => {
     let user = localStorage.getItem("user");
     if(user) {
         try{
             user = JSON.parse(user);
             return user.profileid || user._id; // fallback
         }catch(e){}
     }
     return "650000000000000000000000"; // Fake Resident ID if not logged in correctly for testing
  };

  const API_URL = "http://localhost:5100/api/facilities";

  const fetchFacilities = async () => {
    try {
      const res = await axios.get(API_URL);
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      // Only show available ones
      setFacilities(data.filter(f => f.status === "Available"));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/bookings`);
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      // Filter for my bookings only
      const profileId = getResidentProfileId();
      setMyBookings(data.filter(b => b.resident?._id === profileId || b.resident === profileId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    Promise.all([fetchFacilities(), fetchMyBookings()]).finally(() => setLoading(false));
  }, []);

  // Fetch booked slots when date or facility changes
  useEffect(() => {
    if (selectedFacility && bookingDate) {
      const fetchSlots = async () => {
        try {
          const res = await axios.get(`${API_URL}/booked-slots?facilityId=${selectedFacility._id}&date=${bookingDate}`);
          setBookedSlots(res.data.data || []);
          setSelectedSlot(""); // reset selected slot
        } catch (err) {
          console.error(err);
        }
      };
      fetchSlots();
    }
  }, [selectedFacility, bookingDate]);

  const generateTimeSlots = (openTime, closeTime) => {
    // Basic generator for simple slots
    // Example openTime: "06:00", closeTime: "22:00" or similar.
    // Assuming backend returns "09:00 AM". Parsing this is complex, we will provide a fixed 2-hour slot array for simplicity in demo
    return [
      "08:00 AM - 10:00 AM",
      "10:00 AM - 12:00 PM",
      "12:00 PM - 02:00 PM",
      "02:00 PM - 04:00 PM",
      "04:00 PM - 06:00 PM",
      "06:00 PM - 08:00 PM",
      "08:00 PM - 10:00 PM",
    ];
  };

  const handleBook = async () => {
    if (!selectedFacility || !bookingDate || !selectedSlot) {
      alert("Please select a facility, date, and time slot.");
      return;
    }

    // Process payment visually
    const confirmPayment = window.confirm(`Proceed to secure payment of ₹${selectedFacility.price} for ${selectedFacility.name}?`);
    if (!confirmPayment) return;

    try {
      await axios.post(`${API_URL}/book`, {
        facilityId: selectedFacility._id,
        bookingDate: bookingDate,
        timeSlot: selectedSlot,
        amountPaid: selectedFacility.price,
        residentId: getResidentProfileId()
      });
      alert("Booking requested! Waiting for Admin Approval.");
      setSelectedFacility(null);
      setBookingDate("");
      setSelectedSlot("");
      fetchMyBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Error booking facility.");
    }
  };

  if (loading) return <div className="p-8">Loading Facilities...</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Dumbbell size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-800">Facility Bookings</h1>
            <p className="text-gray-500 text-sm mt-1">Reserve gymnasiums, swimming pools, and halls</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Booking Form */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-6">New Booking</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Select Amenity</label>
                <div className="grid md:grid-cols-2 gap-3">
                  {facilities.map(f => (
                    <div 
                      key={f._id} 
                      onClick={() => setSelectedFacility(f)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedFacility?._id === f._id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                    >
                      <h3 className="font-bold text-gray-800">{f.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{f.location}</p>
                      <p className="text-sm font-black text-blue-600 mt-2">₹{f.price} / slot</p>
                    </div>
                  ))}
                  {facilities.length === 0 && <p className="text-sm text-gray-500 col-span-2">No facilities available.</p>}
                </div>
              </div>

              {selectedFacility && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Select Date</label>
                    <input 
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-blue-500 outline-none"
                    />
                  </div>

                  {bookingDate && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                      <label className="block text-sm font-bold text-gray-600 mb-2">Availability Calendar</label>
                      <div className="grid grid-cols-2 gap-2">
                        {generateTimeSlots().map(slot => {
                          const isBooked = bookedSlots.includes(slot);
                          return (
                            <label
                              key={slot}
                              className={`p-3 rounded-xl text-sm font-semibold border-2 transition-all flex items-center gap-3 cursor-pointer ${
                                isBooked 
                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60' 
                                : selectedSlot === slot
                                  ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                                  : 'bg-white border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <input 
                                type="checkbox"
                                name="timeSlot"
                                value={slot}
                                disabled={isBooked}
                                checked={selectedSlot === slot}
                                onChange={() => setSelectedSlot(selectedSlot === slot ? "" : slot)}
                                className={`w-5 h-5 rounded border-gray-300 ${isBooked ? 'cursor-not-allowed' : 'cursor-pointer accent-blue-600'}`}
                              />
                              {slot}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedSlot && (
                    <div className="pt-4 border-t border-gray-100 mt-4 animate-in fade-in">
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4 flex justify-between items-center">
                        <span className="font-semibold text-gray-600">Total Amount:</span>
                        <span className="text-2xl font-black text-gray-800">₹{selectedFacility.price}</span>
                      </div>
                      <button 
                        onClick={handleBook}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-xl shadow-md transition-all flex justify-center items-center gap-2"
                      >
                        <CreditCard size={18} /> Pay & Confirm Booking
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Past/Upcoming Bookings */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-6">My Bookings</h2>
            
            {myBookings.length === 0 ? (
              <div className="text-center py-12 px-6 border-2 border-dashed border-gray-100 rounded-2xl">
                <Calendar size={40} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 font-medium">You haven't made any bookings yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map(b => (
                  <div key={b._id} className="border border-gray-100 p-4 rounded-xl flex gap-4 hover:shadow-sm transition-all">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs text-center leading-tight">
                      {new Date(b.bookingDate).toLocaleDateString("en-IN", { month:'short', day:'numeric' })}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-800">{b.facility?.name || "Deleted Facility"}</h3>
                        <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : b.status === 'Pending' ? 'bg-orange-100 text-orange-700 animate-pulse' : 'bg-red-100 text-red-700'}`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock size={12}/> {b.timeSlot}
                      </p>
                      <p className="text-xs font-bold text-blue-600 mt-2">Paid: ₹{b.amountPaid}</p>
                      {b.adminResponse && (
                        <div className="mt-3 bg-gray-50 border-l-4 border-blue-400 p-2 rounded-r-lg">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Admin Note</p>
                          <p className="text-xs text-gray-700 font-medium">{b.adminResponse}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
