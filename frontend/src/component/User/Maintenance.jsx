import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader, Wallet, CreditCard, Receipt, Building, CheckCircle, Clock, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function UserMaintenance() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentBill, setSelectedPaymentBill] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

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
      
      const res = await axios.get(`${API_URL}`);
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

  const initiatePayment = (bill) => {
    setSelectedPaymentBill(bill);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    if(!selectedPaymentBill) return;
    setProcessingPayment(true);
    try {
      await axios.put(`${API_URL}/${selectedPaymentBill._id}/pay`, { paymentMethod: "Online UPI/QR" });
      alert(`Payment of ₹${selectedPaymentBill.amount} successful!`);
      setShowPaymentModal(false);
      setSelectedPaymentBill(null);
      fetchBills();
    } catch (err) {
      alert("Payment failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) return <div className="p-8"><Loader className="animate-spin text-blue-500" /></div>;

  const totalPending = bills.filter(b => b.status === "Pending").reduce((sum, b) => sum + b.amount, 0);
  const totalPaid = bills.filter(b => b.status === "Paid").reduce((sum, b) => sum + b.amount, 0);

  const handleDownloadPDF = (bill) => {
    try {
      const doc = new jsPDF();
      const currentUser = getCurrentUser();
    
    // Parse Resident details properly (handles populated object or local storage fallback)
    const residentName = bill.residentId?.firstName
       ? `${bill.residentId.firstName} ${bill.residentId.lastName || ""}`
       : currentUser.name || currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName || ""}` : "Resident";
       
    const residentMobile = bill.residentId?.mobileNumber || currentUser.mobileNumber || currentUser.phone || "N/A";
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("SOCIETY MAINTENANCE INVOICE", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Bill ID: ${bill._id}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 36);

    // Resident Details
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Billed To:", 14, 50);
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(residentName, 14, 58);
    doc.text(`Mobile: ${residentMobile}`, 14, 64);
    
    // Clean unsupported Rupee symbol for jsPDF
    const safeDetails = (bill.details || "N/A").replace(/₹/g, 'Rs. ');

    // Bill Summary
    autoTable(doc, {
      startY: 75,
      head: [["Description", "Details", "Due Date", "Amount"]],
      body: [
        [bill.billName, safeDetails, new Date(bill.dueDate).toLocaleDateString(), `Rs. ${bill.amount.toLocaleString()}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [63, 81, 181] }
    });

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 100;

    // Status & Total
    doc.setFontSize(14);
    doc.setTextColor(0,0,0);
    doc.text(`Total Amount: Rs. ${bill.amount.toLocaleString()}`, 14, finalY + 15);
    
    doc.setTextColor(bill.status === "Paid" ? 34 : 220, bill.status === "Paid" ? 139 : 53, bill.status === "Paid" ? 34 : 69);
    doc.text(`Status: ${bill.status.toUpperCase()}`, 14, finalY + 23);

    if(bill.status === "Paid") {
       doc.text(`Paid On: ${new Date(bill.paidAt).toLocaleDateString()}`, 14, finalY + 31);
       if(bill.paymentMethod) doc.text(`Payment Method: ${bill.paymentMethod}`, 14, finalY + 39);
    }
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("This is an electronically generated invoice.", 105, 280, { align: "center" });

    doc.save(`Invoice_${bill.billName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

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
          
          <div className="flex gap-4">
             <div className="bg-orange-50 px-6 py-3 rounded-xl border border-orange-100 text-right">
               <p className="text-[10px] font-black uppercase tracking-widest text-orange-400">Total Pending Dues</p>
               <p className="text-2xl font-black text-orange-600">₹{totalPending.toLocaleString()}</p>
             </div>
             <div className="bg-green-50 px-6 py-3 rounded-xl border border-green-100 text-right">
               <p className="text-[10px] font-black uppercase tracking-widest text-green-400">Total Amount Paid</p>
               <p className="text-2xl font-black text-green-600">₹{totalPaid.toLocaleString()}</p>
             </div>
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
                    {b.details && <p className="text-sm text-gray-500 mt-2 font-medium italic pr-4">{b.details}</p>}
                    <p className="text-3xl font-black text-gray-900 mt-3 leading-none tracking-tight">
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
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => initiatePayment(b)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all uppercase tracking-wider flex items-center justify-center gap-2 text-sm"
                        >
                           <CreditCard size={18} /> Pay Online Now
                        </button>
                        <button 
                          onClick={() => handleDownloadPDF(b)}
                          className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2 text-sm"
                        >
                           <Download size={18} /> Download PDF
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button className="w-full bg-gray-50 text-gray-400 font-black py-3 rounded-xl uppercase tracking-wider text-sm border-2 border-gray-100 flex items-center justify-center gap-2 cursor-not-allowed">
                           <Building size={16} /> Receipt Generated
                        </button>
                        <button 
                          onClick={() => handleDownloadPDF(b)}
                          className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-3 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2 text-sm"
                        >
                           <Download size={18} /> Download Receipt PDF
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAYMENT HISTORY TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
           <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
             <h2 className="text-lg font-bold text-gray-800">Payment History Table</h2>
             <span className="bg-green-100 text-green-700 font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest">{bills.filter(b => b.status === "Paid").length} Payments</span>
           </div>
           
           <div className="p-0 overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-black">
                   <th className="p-4">Transaction Details</th>
                   <th className="p-4">Payment Method</th>
                   <th className="p-4">Paid On</th>
                   <th className="p-4">Amount</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {bills.filter(b => b.status === "Paid").map(b => (
                   <tr key={b._id} className="hover:bg-green-50/30 transition-colors">
                     <td className="p-4">
                       <p className="font-bold text-gray-800">{b.billName}</p>
                       <p className="text-[10px] font-bold text-indigo-500 mt-0.5">{b.billType}</p>
                     </td>
                     <td className="p-4 font-semibold text-gray-600">
                       {b.paymentMethod || "Online"}
                     </td>
                     <td className="p-4 text-gray-600 font-semibold">
                       {new Date(b.paidAt).toLocaleDateString()}
                     </td>
                     <td className="p-4">
                       <p className="text-lg font-black text-green-600">₹{b.amount.toLocaleString()}</p>
                     </td>
                   </tr>
                 ))}
                 {bills.filter(b => b.status === "Paid").length === 0 && (
                   <tr>
                     <td colSpan="4" className="p-10 text-center text-gray-400 font-bold">No payments made yet.</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>

        {/* UPI QR PAYMENT MODAL */}
        {showPaymentModal && selectedPaymentBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm flex flex-col items-center text-center animate-in zoom-in-95 relative mx-4">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-3xl leading-none font-bold"
              >
                &times;
              </button>
              
              <h3 className="text-2xl font-black text-gray-800 mb-1">Scan to Pay</h3>
              <p className="text-sm text-gray-500 font-medium mb-6">UPI / QR Payment Gateway</p>
              
              <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100 mb-6 shadow-inner w-full flex justify-center">
                 <img 
                   src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=society@upi&pn=Society&am=${selectedPaymentBill.amount}`} 
                   alt="QR Code" 
                   className="w-48 h-48 object-contain mix-blend-multiply border-4 border-white shadow-sm rounded-xl" 
                 />
              </div>

              <div className="w-full bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
                 <p className="text-[10px] uppercase tracking-widest font-black text-indigo-400 mb-1">Paying For</p>
                 <p className="font-bold text-gray-800 text-sm truncate">{selectedPaymentBill.billName}</p>
                 <p className="text-3xl font-black text-indigo-600 mt-2">₹{selectedPaymentBill.amount.toLocaleString()}</p>
              </div>

              <button 
                onClick={handleConfirmPayment}
                disabled={processingPayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl shadow-lg shadow-green-600/30 transition-all uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processingPayment ? <Loader className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                {processingPayment ? 'Processing...' : 'Confirm Paid'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
