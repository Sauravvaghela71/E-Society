import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Loader, Wallet, CreditCard, Receipt, Building,
  CheckCircle, Clock, Download, X, Smartphone, Lock,
  ShieldCheck, QrCode, User, CalendarDays, Hash
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SOCIETY_UPI  = "6354643123@rapl";
const SOCIETY_NAME = "ESociety";
const API_URL      = "http://localhost:5100/api/maintenance";

const qrUrl = (amount) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    `upi://pay?pa=${SOCIETY_UPI}&pn=${SOCIETY_NAME}&am=${amount}&cu=INR`
  )}`;

const getCurrentUser = () => {
  try { return JSON.parse(localStorage.getItem("user") || "{}"); }
  catch { return {}; }
};

export default function UserMaintenance() {
  const [bills, setBills]                       = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill]         = useState(null);
  const [payTab, setPayTab]                     = useState("upi");
  const [cardForm, setCardForm]                 = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [processing, setProcessing]             = useState(false);
  const [paid, setPaid]                         = useState(false);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setBills(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBills(); }, []);

  const openPayment = (bill) => {
    setSelectedBill(bill);
    setPayTab("upi");
    setCardForm({ name: "", number: "", expiry: "", cvv: "" });
    setPaid(false);
    setShowPaymentModal(true);
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setSelectedBill(null);
    setPaid(false);
  };

  const handleConfirmPayment = async () => {
    if (!selectedBill) return;
    if (payTab !== "upi") {
      if (!cardForm.name || !cardForm.number || !cardForm.expiry || !cardForm.cvv) {
        alert("Please fill all card details.");
        return;
      }
      if (cardForm.number.replace(/\s/g, "").length !== 16) {
        alert("Enter a valid 16-digit card number.");
        return;
      }
    }
    const method = payTab === "upi" ? "Online UPI/QR" : payTab === "debit" ? "Debit Card" : "Credit Card";
    setProcessing(true);
    try {
      await axios.put(`${API_URL}/${selectedBill._id}/pay`, { paymentMethod: method });
      setPaid(true);
      fetchBills();
    } catch (err) {
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadPDF = (bill) => {
    try {
      const doc = new jsPDF();
      const currentUser = getCurrentUser();
      const residentName = bill.residentId?.firstName
        ? `${bill.residentId.firstName} ${bill.residentId.lastName || ""}`
        : `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "Resident";
      const residentMobile = bill.residentId?.mobileNumber || currentUser.mobileNumber || "N/A";
      const safeDetails    = (bill.details || "N/A").replace(/₹/g, "Rs. ");

      doc.setFontSize(22); doc.setTextColor(40, 40, 40);
      doc.text("SOCIETY MAINTENANCE INVOICE", 105, 20, { align: "center" });
      doc.setFontSize(12); doc.setTextColor(100, 100, 100);
      doc.text(`Bill ID: ${bill._id}`, 14, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 36);
      doc.setFontSize(14); doc.setTextColor(0, 0, 0);
      doc.text("Billed To:", 14, 50);
      doc.setFontSize(12); doc.setTextColor(80, 80, 80);
      doc.text(residentName, 14, 58);
      doc.text(`Mobile: ${residentMobile}`, 14, 64);
      autoTable(doc, {
        startY: 75,
        head: [["Description", "Details", "Due Date", "Amount"]],
        body: [[bill.billName, safeDetails, new Date(bill.dueDate).toLocaleDateString(), `Rs. ${bill.amount.toLocaleString()}`]],
        theme: "grid",
        headStyles: { fillColor: [63, 81, 181] }
      });
      const finalY = doc.lastAutoTable?.finalY || 100;
      doc.setFontSize(14); doc.setTextColor(0, 0, 0);
      doc.text(`Total: Rs. ${bill.amount.toLocaleString()}`, 14, finalY + 15);
      doc.setTextColor(bill.status === "Paid" ? 34 : 220, bill.status === "Paid" ? 139 : 53, bill.status === "Paid" ? 34 : 69);
      doc.text(`Status: ${bill.status.toUpperCase()}`, 14, finalY + 23);
      if (bill.status === "Paid") {
        doc.text(`Paid On: ${new Date(bill.paidAt).toLocaleDateString()}`, 14, finalY + 31);
        if (bill.paymentMethod) doc.text(`Method: ${bill.paymentMethod}`, 14, finalY + 39);
      }
      doc.setFontSize(10); doc.setTextColor(150, 150, 150);
      doc.text("Electronically generated invoice — E-Society", 105, 280, { align: "center" });
      doc.save(`Invoice_${bill.billName.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF.");
    }
  };

  if (loading) return <div className="p-8"><Loader className="animate-spin text-blue-500" /></div>;

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
              <h1 className="text-2xl font-black text-gray-800">My Dues & Maintenance</h1>
              <p className="text-gray-500 text-sm mt-1">Society invoices, penalties &amp; online payments.</p>
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
                        <button onClick={() => openPayment(b)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                          <CreditCard size={18} /> Pay Online Now
                        </button>
                        <button onClick={() => handleDownloadPDF(b)} className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                          <Download size={18} /> Download PDF
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button className="w-full bg-gray-50 text-gray-400 font-black py-3 rounded-xl border-2 border-gray-100 flex items-center justify-center gap-2 cursor-not-allowed text-sm">
                          <Building size={16} /> Receipt Generated
                        </button>
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

      {/* PAYMENT MODAL */}
      {showPaymentModal && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-6 flex justify-between items-center">
              <div>
                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-0.5">Secure Payment</p>
                <h2 className="text-xl font-black">{selectedBill.billName}</h2>
                <p className="text-3xl font-black mt-1">₹{selectedBill.amount.toLocaleString()}</p>
              </div>
              <button onClick={closeModal} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <X size={18} />
              </button>
            </div>

            {paid ? (
              /* SUCCESS SCREEN */
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={40} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-black text-gray-800">Payment Successful!</h3>
                <p className="text-gray-500 mt-2 text-sm">
                  ₹{selectedBill.amount.toLocaleString()} paid via {payTab === "upi" ? "UPI/QR" : payTab === "debit" ? "Debit Card" : "Credit Card"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Transaction recorded at {new Date().toLocaleTimeString()}</p>
                <button onClick={closeModal} className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-xl transition-all">
                  Done
                </button>
              </div>
            ) : (
              <div className="p-6">
                {/* METHOD TABS */}
                <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
                  {[
                    { id: "upi",    icon: <Smartphone size={15} />,  label: "UPI / QR"    },
                    { id: "debit",  icon: <CreditCard size={15} />,  label: "Debit Card"  },
                    { id: "credit", icon: <CreditCard size={15} />,  label: "Credit Card" },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setPayTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-black transition-all ${
                        payTab === tab.id ? "bg-white shadow text-blue-700" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>

                {/* UPI TAB */}
                {payTab === "upi" && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-inner">
                      <img
                        src={qrUrl(selectedBill.amount)}
                        alt="UPI QR Code"
                        className="w-52 h-52 object-contain"
                      />
                    </div>
                    <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">UPI ID</p>
                      <p className="font-black text-blue-800 text-lg tracking-wide">{SOCIETY_UPI}</p>
                      <p className="text-[10px] text-blue-400 mt-1 font-bold">Scan with PhonePe · GPay · Paytm · BHIM</p>
                    </div>
                    <div className="w-full bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                      <p className="text-xs text-amber-700 font-bold flex items-center justify-center gap-1.5">
                        <ShieldCheck size={14} /> After paying via UPI, click "Confirm Payment" below
                      </p>
                    </div>
                  </div>
                )}

                {/* DEBIT / CREDIT CARD TAB */}
                {(payTab === "debit" || payTab === "credit") && (
                  <div className="space-y-4">
                    {/* Card Preview */}
                    <div className="bg-gradient-to-br from-slate-800 to-indigo-900 rounded-2xl p-5 text-white shadow-xl">
                      <div className="flex justify-between items-start mb-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/60">{payTab === "credit" ? "Credit Card" : "Debit Card"}</p>
                        <QrCode size={22} className="text-white/30" />
                      </div>
                      <p className="font-black text-xl tracking-[0.2em] mb-5">
                        {cardForm.number || "•••• •••• •••• ••••"}
                      </p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[9px] text-white/50 uppercase tracking-widest">Card Holder</p>
                          <p className="font-bold text-sm">{cardForm.name || "YOUR NAME"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-white/50 uppercase tracking-widest">Expires</p>
                          <p className="font-bold text-sm">{cardForm.expiry || "MM/YY"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card form */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"><User size={13} /> Cardholder Name</label>
                      <input type="text" placeholder="Name on card" value={cardForm.name}
                        onChange={e => setCardForm({ ...cardForm, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50" />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"><Hash size={13} /> Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} value={cardForm.number}
                        onChange={e => {
                          const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                          const fmt = raw.replace(/(.{4})/g, "$1 ").trim();
                          setCardForm({ ...cardForm, number: fmt });
                        }}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 tracking-widest font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"><CalendarDays size={13} /> Expiry</label>
                        <input type="text" placeholder="MM/YY" maxLength={5} value={cardForm.expiry}
                          onChange={e => {
                            let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                            if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                            setCardForm({ ...cardForm, expiry: v });
                          }}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50" />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"><Lock size={13} /> CVV</label>
                        <input type="password" placeholder="•••" maxLength={4} value={cardForm.cvv}
                          onChange={e => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50" />
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-green-500" /> Your card details are encrypted &amp; secure.
                    </p>
                  </div>
                )}

                {/* CONFIRM BUTTON */}
                <button
                  onClick={handleConfirmPayment}
                  disabled={processing}
                  className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-60"
                >
                  {processing ? <Loader size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                  {processing ? "Processing..." : `Confirm ₹${selectedBill.amount.toLocaleString()} Payment`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
