import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader, Wallet, CreditCard, Receipt, Building, CheckCircle, Clock } from "lucide-react";

export default function UserMaintenance() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  };

  const API_URL = "http://localhost:5100/api/maintenance";

  const fetchBills = async () => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();
      const profileId = currentUser.profileid || currentUser._id;
      
      const res = await axios.get(`${API_URL}/user/${profileId}`);
      setBills(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handlePayment = async (billId, amount, billName) => {
    const confirmPayment = window.confirm(`Proceed to online payment gateway for ${billName} of ₹${amount}?`);
    if (!confirmPayment) return;

    try {
      // Simulate Online Payment Processing
      await new Promise(r => setTimeout(r, 1000));
      
      // Update Database
      await axios.put(`${API_URL}/${billId}/pay`, { paymentMethod: "Online UPI/Card" });
      
      alert(`Payment of ₹${amount} successful!`);
      // Refresh list to update UI
      fetchBills();
    } catch (err) {
      alert("Payment failed. Please try again.");
    }
  };

  if (loading) return <div className="p-8"><Loader className="animate-spin text-blue-500" /></div>;

  const totalPending = bills.filter(b => b.status === "Pending").reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Wallet size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">My Dues & Maintenance</h1>
              <p className="text-gray-500 text-sm mt-1">Manage society invoices, penalties, and online payments.</p>
            </div>
          </div>
          
          <div className="bg-orange-50 px-6 py-3 rounded-xl border border-orange-100 text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-400">Total Pending Dues</p>
            <p className="text-2xl font-black text-orange-600">₹{totalPending.toLocaleString()}</p>
          </div>
        </div>

        {bills.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
            <Receipt size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">No Bills Found</h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              You do not have any pending or past maintenance bills.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {bills.map(b => {
              const pending = b.status === "Pending";
              
              return (
                <div key={b._id} className="bg-white border text-left rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-gray-100 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200">
                        {b.billType}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                        pending ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {pending ? <Clock size={12}/> : <CheckCircle size={12}/>} 
                        {b.status}
                      </span>
                    </div>
                    
                    <h3 className="font-black text-xl text-gray-800 leading-tight">{b.billName}</h3>
                    <p className="text-3xl font-black text-gray-900 mt-2 leading-none tracking-tight">
                       ₹{b.amount.toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                       <div>
                         <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Due Date</p>
                         <p className="text-sm font-bold text-gray-600">{new Date(b.dueDate).toLocaleDateString()}</p>
                       </div>
                       {!pending && (
                         <div className="text-right">
                           <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Paid On</p>
                           <p className="text-sm font-bold text-green-600">{new Date(b.paidAt).toLocaleDateString()}</p>
                         </div>
                       )}
                    </div>
                    
                    {pending ? (
                      <button 
                        onClick={() => handlePayment(b._id, b.amount, b.billName)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all uppercase tracking-wider flex items-center justify-center gap-2 text-sm"
                      >
                         <CreditCard size={18} /> Pay Online Now
                      </button>
                    ) : (
                      <button className="w-full bg-gray-50 text-gray-400 font-black py-3 rounded-xl uppercase tracking-wider text-sm border-2 border-gray-100 flex items-center justify-center gap-2 cursor-not-allowed">
                         <Building size={16} /> Receipt Generated
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
