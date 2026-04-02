import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Loader, Wallet, CreditCard, Receipt, Building,
  CheckCircle, Clock, Download, UserCircle, AlertCircle
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import RazorpayPayment from "../Admin/Maintaince/Payment";

const API_URL       = "http://localhost:5100/api/maintenance";
const RESIDENT_API  = "http://localhost:5100/api/residents";

/* ── Resolve session user ── */
const getSessionUser = () => {
  try { return JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user") || "{}"); }
  catch { return {}; }
};

export default function UserMaintenance() {
  const [bills, setBills]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [residentId, setResidentId] = useState(null);
  const [residentInfo, setResidentInfo] = useState(null);
  const [error, setError]       = useState(null);

  /* Step 1 – resolve the resident's Mongo _id */
  useEffect(() => {
    const resolve = async () => {
      const user = getSessionUser();
      const email = user.email;
      const profileId = user.profileid || user._id;

      let resident = null;

      // Primary: look up by email
      if (email) {
        try {
          const r = await axios.get(`${RESIDENT_API}/by-email/${encodeURIComponent(email)}`);
          if (r.data?._id) resident = r.data;
        } catch { /* not found */ }
      }

      // Fallback: look up by profileId
      if (!resident && profileId) {
        try {
          const r = await axios.get(`${RESIDENT_API}/${profileId}`);
          if (r.data?._id) resident = r.data;
        } catch { /* not found */ }
      }

      if (resident) {
        setResidentId(resident._id);
        setResidentInfo(resident);
      } else {
        setError("Could not find your resident profile. Please contact the admin.");
        setLoading(false);
      }
    };
    resolve();
  }, []);

  /* Step 2 – fetch bills once we have a resident ID */
  const fetchBills = async () => {
    if (!residentId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/user/${residentId}`);
      setBills(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load your maintenance bills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBills(); }, [residentId]);

  const handlePaymentSuccess = () => fetchBills();

  /* PDF generation */
  const handleDownloadPDF = (bill) => {
    try {
      const doc = new jsPDF();
      
      // Constants
      const info = residentInfo || {};
      const residentName = `${info.firstName || ""} ${info.lastName || ""}`.trim() || "Resident";
      const residentMobile = info.mobileNumber || "N/A";
      const residentEmail = info.email || "N/A";
      const wingFlat = `Wing ${info.wing || ""} - Flat ${info.flatNumber || ""}`;
      
      // Brand Colors
      const primaryColor = [79, 70, 229]; // Indigo 600
      const grayDark = [55, 65, 81];
      const grayLight = [107, 114, 128];
      
      // 1. Header Banner
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", 14, 23);
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("E-Society", 196, 23, { align: "right" });
      
      // 2. Invoice Meta Info
      doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Invoice No:", 14, 50);
      doc.text("Generated:", 14, 57);
      doc.text("Due Date:", 14, 64);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(grayLight[0], grayLight[1], grayLight[2]);
      doc.text(bill._id.slice(-8).toUpperCase(), 45, 50);
      doc.text(new Date().toLocaleDateString("en-IN"), 45, 57);
      doc.text(new Date(bill.dueDate).toLocaleDateString("en-IN"), 45, 64);
      
      // 3. Billing Addresses
      doc.setFont("helvetica", "bold");
      doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
      doc.text("Billed To:", 14, 85);
      doc.text("From:", 120, 85);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(grayLight[0], grayLight[1], grayLight[2]);
      // To
      doc.text(residentName, 14, 92);
      doc.text(wingFlat, 14, 99);
      doc.text(`Mobile: ${residentMobile}`, 14, 106);
      if(residentEmail !== "N/A") doc.text(`Email: ${residentEmail}`, 14, 113);
      
      // From
      doc.text("E-Society Management", 120, 92);
      doc.text("Society Main Admin Office", 120, 99);
      doc.text("contact@e-society.com", 120, 106);

      // Parse details to create items table
      // e.g. "Water: ₹600, Parking: ₹400, Maintenance: ₹1000"
      let parsedItems = [];
      const billTotalFormatted = `Rs. ${bill.amount.toLocaleString("en-IN")}`;
      if (bill.details && bill.details.includes(",")) {
         parsedItems = bill.details.split(",").map(item => {
             const [desc, amt] = item.split(":");
             return [desc.trim(), "", "", amt ? amt.replace(/₹/g, "Rs. ").trim() : ""];
         });
      } else {
         const safeDetails = (bill.details || "").replace(/₹/g, "Rs. ");
         parsedItems = [[bill.billName, safeDetails, "", billTotalFormatted]];
      }

      // 4. Line Items Table
      autoTable(doc, {
        startY: 130,
        head: [["Description", "HSN/SAC", "Quantity", "Amount"]],
        body: parsedItems,
        theme: "striped",
        headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: "bold" },
        styles: { fontSize: 10, cellPadding: 6, textColor: grayDark },
        columnStyles: {
            0: { cellWidth: 90 },
            3: { halign: "right" }
        }
      });
      
      const finalY = doc.lastAutoTable.finalY || 135;
      
      // 5. Totals
      doc.setFont("helvetica", "bold");
      doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
      doc.text("Subtotal:", 140, finalY + 15);
      doc.text("Total:", 140, finalY + 25);
      
      doc.setFont("helvetica", "normal");
      doc.text(billTotalFormatted, 196, finalY + 15, { align: "right" });
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(billTotalFormatted, 196, finalY + 25, { align: "right" });
      
      // 6. Payment Status Box
      doc.setFillColor(249, 250, 251); // Gray 50
      doc.setDrawColor(229, 231, 235); // Gray 200
      doc.roundedRect(14, finalY + 10, 100, 45, 3, 3, "FD");
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
      doc.text("Payment Status", 19, finalY + 18);
      
      doc.setFont("helvetica", "normal");
      if (bill.status === "Paid") {
          doc.setTextColor(5, 150, 105); // Green 600
          doc.setFont("helvetica", "bold");
          doc.text("PAID", 19, finalY + 26);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(grayLight[0], grayLight[1], grayLight[2]);
          doc.text(`Method: ${bill.paymentMethod || "Online"}`, 19, finalY + 34);
          doc.text(`Paid On: ${new Date(bill.paidAt).toLocaleDateString("en-IN")}`, 19, finalY + 41);
          if (bill.razorpayPaymentId) {
             doc.setFontSize(8);
             doc.text(`Txn ID: ${bill.razorpayPaymentId}`, 19, finalY + 49);
          }
      } else {
          doc.setTextColor(220, 38, 38); // Red 600
          doc.setFont("helvetica", "bold");
          doc.text("PENDING", 19, finalY + 26);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(grayLight[0], grayLight[1], grayLight[2]);
          doc.text(`Due: ${new Date(bill.dueDate).toLocaleDateString("en-IN")}`, 19, finalY + 34);
      }
      
      // 7. Footer
      doc.setFontSize(10);
      doc.setTextColor(grayLight[0], grayLight[1], grayLight[2]);
      doc.text("Thank you for your prompt payment!", 105, 275, { align: "center" });
      doc.setFontSize(8);
      doc.text("Electronically generated invoice — E-Society", 105, 282, { align: "center" });
      
      doc.save(`Invoice_${bill.billName.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("PDF Error:", err);
      alert("Failed to generate PDF.");
    }
  };

  /* ── Loading / Error screens ── */
  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader className="animate-spin text-indigo-500" size={36} />
        <p className="text-gray-500 font-semibold">Loading your maintenance bills…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-8 flex items-center justify-center min-h-[40vh]">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
        <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
        <h3 className="font-bold text-red-800 text-lg">{error}</h3>
      </div>
    </div>
  );

  const totalPending = bills.filter(b => b.status === "Pending").reduce((s, b) => s + b.amount, 0);
  const totalPaid    = bills.filter(b => b.status === "Paid").reduce((s, b) => s + b.amount, 0);

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
              <h1 className="text-2xl font-black text-gray-800">My Dues &amp; Maintenance</h1>
              {residentInfo && (
                <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1.5">
                  <UserCircle size={14} />
                  {residentInfo.firstName} {residentInfo.lastName} · Wing {residentInfo.wing}, Flat {residentInfo.flatNumber}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-orange-50 px-6 py-3 rounded-xl border border-orange-100 text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-400">Total Pending</p>
              <p className="text-2xl font-black text-orange-600">₹{totalPending.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 px-6 py-3 rounded-xl border border-green-100 text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-green-400">Total Paid</p>
              <p className="text-2xl font-black text-green-600">₹{totalPaid.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* BILL CARDS */}
        {bills.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 flex flex-col items-center text-center">
            <Receipt size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">No Bills Found</h3>
            <p className="text-gray-500 mt-2">You have no pending or past maintenance bills.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {bills.map(b => {
              const pending = b.status === "Pending";
              return (
                <div key={b._id} className="bg-white border text-left rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-gray-100 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200">{b.billType}</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${pending ? "bg-orange-100 text-orange-600 border border-orange-200" : "bg-green-100 text-green-700 border border-green-200"}`}>
                        {pending ? <Clock size={12} /> : <CheckCircle size={12} />} {b.status}
                      </span>
                    </div>
                    <h3 className="font-black text-xl text-gray-800 leading-tight">{b.billName}</h3>
                    {b.details && <p className="text-sm text-gray-500 mt-2 font-medium italic">{b.details}</p>}
                    <p className="text-3xl font-black text-gray-900 mt-3 leading-none">₹{b.amount.toLocaleString()}</p>
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
                        <RazorpayPayment bill={b} onSuccess={handlePaymentSuccess}>
                          {({ openRazorpay, loading: rzpLoading }) => (
                            <button
                              onClick={openRazorpay}
                              disabled={rzpLoading}
                              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider disabled:opacity-60"
                            >
                              {rzpLoading ? <Loader size={18} className="animate-spin" /> : <CreditCard size={18} />}
                              {rzpLoading ? "Opening Razorpay…" : "Pay via Razorpay"}
                            </button>
                          )}
                        </RazorpayPayment>
                        <button onClick={() => handleDownloadPDF(b)} className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                          <Download size={18} /> Download PDF
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <div className="w-full bg-gray-50 text-gray-400 font-black py-3 rounded-xl border-2 border-gray-100 flex items-center justify-center gap-2 text-sm">
                          <Building size={16} /> Receipt Generated · {b.paymentMethod || "Online"}
                        </div>
                        <button onClick={() => handleDownloadPDF(b)} className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Payment History</h2>
            <span className="bg-green-100 text-green-700 font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest">
              {bills.filter(b => b.status === "Paid").length} Payments
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-black">
                  <th className="p-4">Bill Details</th>
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
                    <td className="p-4 font-semibold text-gray-600">{b.paymentMethod || "Online"}</td>
                    <td className="p-4 text-gray-600 font-semibold">{new Date(b.paidAt).toLocaleDateString()}</td>
                    <td className="p-4"><p className="text-lg font-black text-green-600">₹{b.amount.toLocaleString()}</p></td>
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

      </div>
    </div>
  );
}
