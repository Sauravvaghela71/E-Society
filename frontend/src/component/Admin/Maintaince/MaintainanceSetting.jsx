import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Loader, CreditCard, Plus, Clock, CheckCircle } from "lucide-react";

export default function MaintainanceSetting() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [bills, setBills] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [settings, setSettings] = useState({ maintenanceAmount: 2000, penaltyAmount: 500 });
  const [savingSettings, setSavingSettings] = useState(false);

  const API_URL = "http://localhost:5100/api/maintenance";

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resBills, resResidents] = await Promise.all([
        axios.get(API_URL),
        axios.get("http://localhost:5100/api/residents"),
        axios.get(`${API_URL}/settings`)
      ]);
      setBills(resBills.data.data || []);
      setResidents(resResidents.data.data || resResidents.data || []);
      if(resSettings.data.data) {
        setSettings(resSettings.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await axios.put(`${API_URL}/settings`, settings);
      alert("Society Settings Updated successfully!");
    } catch (e) {
      alert("Failed to update settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const generateAutoMonthly = async () => {
    const confirmation = window.confirm(`Generate regular monthly bills of ₹${settings.maintenanceAmount} for ALL residents?`);
    if(!confirmation) return;
    
    try {
       const nextMonth = new Date();
       nextMonth.setMonth(nextMonth.getMonth() + 1);

       const promises = residents.map(r => axios.post(API_URL, {
          residentId: r._id,
          billName: `${new Date().toLocaleString('default', { month: 'long' })} Monthly Maintenance`,
          billType: "Regular Maintenance",
          amount: settings.maintenanceAmount,
          dueDate: nextMonth,
          status: "Pending",
          details: `Water: ₹${Math.round(settings.maintenanceAmount * 0.3)}, Parking: ₹${Math.round(settings.maintenanceAmount * 0.2)}, Maintenance: ₹${Math.round(settings.maintenanceAmount * 0.5)}`
       }));
       await Promise.all(promises);
       alert("Auto-Generated Monthly Bills successfully for ALL residents!");
       fetchData();
    } catch (err) {
       alert("Error auto-generating bills.");
    }
  };

  const onSubmit = async (data) => {
    try {
      if (data.residentId === "ALL") {
         // Create individual bills for ALL residents
         const promises = residents.map(r => axios.post(API_URL, {
            ...data,
            residentId: r._id,
         }));
         await Promise.all(promises);
         alert("Bills sent to ALL residents successfully!");
      } else {
         await axios.post(API_URL, data);
         alert("Bill created successfully!");
      }
      fetchData();
      setShowForm(false);
      reset();
    } catch (err) {
      alert("Error generating bill.");
    }
  };

  if (loading) return <div className="p-8"><Loader className="animate-spin text-blue-500" /></div>;

  const totalPendingAmount = bills.filter(b => b.status === "Pending").reduce((sum, b) => sum + b.amount, 0);
  const totalPaidAmount = bills.filter(b => b.status === "Paid").reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <CreditCard size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">Maintenance & Billing</h1>
              <p className="text-gray-500 text-sm mt-1">Configure global society settings and generate manual invoices.</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button
               onClick={generateAutoMonthly}
               className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all whitespace-nowrap"
             >
               Auto-Gen Monthly Bills
             </button>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all whitespace-nowrap"
              >
                <Plus size={18} /> Generate Custom
              </button>
            )}
          </div>
        </div>

        {/* SUMMARY WIDGETS */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 shadow-sm">
             <p className="text-xs font-black uppercase tracking-widest text-orange-400 mb-1">Total Pending Payable Amount</p>
             <p className="text-3xl font-black text-orange-600">₹{totalPendingAmount.toLocaleString()}</p>
           </div>
           <div className="bg-green-50 border border-green-100 rounded-2xl p-6 shadow-sm">
             <p className="text-xs font-black uppercase tracking-widest text-green-400 mb-1">Total Paid Amount</p>
             <p className="text-3xl font-black text-green-600">₹{totalPaidAmount.toLocaleString()}</p>
           </div>
        </div>


        {/* Global Settings Viewer & Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 lg:items-center">
            <div className="md:w-1/3">
              <h2 className="text-lg font-bold text-gray-800">Society Rate Settings</h2>
              <p className="text-xs text-gray-400 mt-1 font-semibold leading-relaxed">
                 Configure standard global rates. The Auto-Gen button strictly references these explicit values.
              </p>
            </div>
            <form onSubmit={handleUpdateSettings} className="flex-1 grid md:grid-cols-3 gap-4 items-end">
               <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Standard Maintenance (₹)</label>
                  <input type="number" value={settings.maintenanceAmount} onChange={e => setSettings({...settings, maintenanceAmount: Number(e.target.value)})} className="w-full border p-2.5 rounded-xl bg-gray-50 outline-none focus:border-blue-500 font-bold" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Penalty / Late Fee (₹)</label>
                  <input type="number" value={settings.penaltyAmount} onChange={e => setSettings({...settings, penaltyAmount: Number(e.target.value)})} className="w-full border p-2.5 rounded-xl bg-gray-50 outline-none focus:border-blue-500 font-bold" />
               </div>
               <button type="submit" disabled={savingSettings} className={`w-full py-2.5 font-bold text-white rounded-xl transition-all shadow-md ${savingSettings ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                 {savingSettings ? 'Saving...' : 'Save Settings'}
               </button>
            </form>
        </div>

        {/* CREATE CUSTOM BILL FORM */}
        {showForm && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Create Billing Record</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Assign To</label>
                  <select {...register("residentId", { required: true })} className="w-full border p-3 rounded-xl focus:border-blue-500 outline-none bg-gray-50">
                    <option value="">Select Resident...</option>
                    <option value="ALL" className="font-bold text-blue-600">-- ALL RESIDENTS --</option>
                    {residents.map(r => (
                       <option key={r._id} value={r._id}>{r.firstName} {r.lastName} (Wing {r.wing} - {r.flatNumber})</option>
                    ))}
                  </select>
                  {errors.residentId && <span className="text-red-500 text-xs mt-1">Required</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Bill Name / Title</label>
                  <input {...register("billName", { required: true })} placeholder="e.g. October Maintenance" className="w-full border p-3 rounded-xl focus:border-blue-500 outline-none" />
                  {errors.billName && <span className="text-red-500 text-xs mt-1">Required</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Bill Type</label>
                  <select {...register("billType", { required: true })} className="w-full border p-3 rounded-xl focus:border-blue-500 outline-none bg-gray-50">
                    <option value="Regular Maintenance">Regular Maintenance</option>
                    <option value="Penalty">Penalty Charge</option>
                    <option value="Event">Event Contribution</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Amount (₹)</label>
                    <input type="number" {...register("amount", { required: true, min: 1 })} placeholder="2500" className="w-full border p-3 rounded-xl focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Due Date</label>
                    <input type="date" {...register("dueDate", { required: true })} className="w-full border p-3 rounded-xl focus:border-blue-500 outline-none" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Charge Details / Breakdown</label>
                  <textarea {...register("details")} placeholder="e.g. Water Bill: ₹500, Lift Maintenance: ₹1000, Security: ₹1000" className="w-full border p-3 rounded-xl focus:border-blue-500 outline-none h-20 bg-white" />
                  <p className="text-[10px] text-gray-400 font-bold mt-1">Residents will see exactly what items this charge covers.</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-blue-700">Generate Invoice</button>
                <button type="button" onClick={() => { setShowForm(false); reset(); }} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* BILLING HISTORY LOG */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
             <h2 className="text-lg font-bold text-gray-800">Billing Directory</h2>
             <span className="bg-blue-100 text-blue-700 font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest">{bills.length} Invoices</span>
           </div>
           
           <div className="p-0">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-black">
                   <th className="p-4">Resident / Flat</th>
                   <th className="p-4">Bill Details</th>
                   <th className="p-4">Amount</th>
                   <th className="p-4">Status & Paid Via</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {bills.map(b => (
                   <tr key={b._id} className="hover:bg-blue-50/30 transition-colors">
                     <td className="p-4">
                       <p className="font-bold text-gray-900">{b.residentId?.firstName || 'Unknown'} {b.residentId?.lastName}</p>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Wing {b.residentId?.wing || '?'} - {b.residentId?.flatNumber || '?'}</p>
                     </td>
                     <td className="p-4">
                       <p className="font-bold text-gray-800">{b.billName}</p>
                       <p className="text-xs font-bold text-indigo-500 mt-0.5">{b.billType}</p>
                       {b.details && <p className="text-[10px] text-gray-500 w-48 truncate mt-1 border-l-2 border-slate-300 pl-1">{b.details}</p>}
                       <p className="text-[10px] text-gray-400 uppercase font-bold mt-1 shadow-sm inline-block px-1 border border-gray-200 rounded">
                         Due: {new Date(b.dueDate).toLocaleDateString()}
                       </p>
                     </td>
                     <td className="p-4">
                       <p className="text-lg font-black text-blue-600">₹{b.amount}</p>
                     </td>
                     <td className="p-4">
                        {b.status === "Paid" ? (
                          <div>
                            <span className="flex items-center gap-1 text-xs font-black text-green-600 uppercase tracking-wide bg-green-50 px-2 py-1 rounded-lg w-fit">
                              <CheckCircle size={14} /> Paid 
                            </span>
                            {b.paymentMethod && <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">Via {b.paymentMethod} • {new Date(b.paidAt).toLocaleDateString()}</p>}
                          </div>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-black text-orange-600 uppercase tracking-wide bg-orange-50 px-2 py-1 rounded-lg w-fit">
                            <Clock size={14} /> Pending
                          </span>
                        )}
                     </td>
                   </tr>
                 ))}
                 {bills.length === 0 && (
                   <tr>
                     <td colSpan="4" className="p-10 text-center text-gray-400 font-bold">No billing records generated yet.</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>

      </div>
    </div>
  );
}