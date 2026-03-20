import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  PlusCircle, Trash2, X, IndianRupee, TrendingDown,
  Loader, FileText, Tag, Calendar, CreditCard, AlignLeft
} from "lucide-react";

const API = "http://localhost:5100/api/expense";

const CATEGORIES = [
  "Maintenance",
  "Cleaning",
  "Security",
  "Electricity",
  "Water",
  "Gardening",
  "Repairs",
  "Events",
  "Salaries",
  "Other",
];

const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Cheque", "UPI", "Card"];

const CATEGORY_COLORS = {
  Maintenance: "bg-blue-100 text-blue-700",
  Cleaning:    "bg-green-100 text-green-700",
  Security:    "bg-indigo-100 text-indigo-700",
  Electricity: "bg-yellow-100 text-yellow-700",
  Water:       "bg-cyan-100 text-cyan-700",
  Gardening:   "bg-emerald-100 text-emerald-700",
  Repairs:     "bg-orange-100 text-orange-700",
  Events:      "bg-pink-100 text-pink-700",
  Salaries:    "bg-purple-100 text-purple-700",
  Other:       "bg-gray-100 text-gray-600",
};

const emptyForm = {
  title: "",
  category: "",
  amount: "",
  paymentMethod: "",
  expenseDate: new Date().toISOString().split("T")[0],
  description: "",
};

export default function Expense() {
  const [expenses, setExpenses]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState(emptyForm);
  const [submitting, setSubmitting]   = useState(false);
  const [deletingId, setDeletingId]   = useState(null);
  const [filterCat, setFilterCat]     = useState("All");

  /* ── Fetch ── */
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setExpenses(res.data?.data || []);
    } catch (e) {
      toast.error("Could not load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.amount || !form.paymentMethod) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setSubmitting(true);
      await axios.post(API, { ...form, amount: Number(form.amount) });
      toast.success("Expense recorded successfully!");
      setForm(emptyForm);
      setShowForm(false);
      fetchExpenses();
    } catch (e) {
      toast.error(e.response?.data?.error || "Failed to save expense");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense record?")) return;
    try {
      setDeletingId(id);
      await axios.delete(`${API}/${id}`);
      toast.success("Expense deleted");
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (e) {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Derived stats ── */
  const totalAmount   = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const thisMonth     = expenses.filter((e) => {
    const d = new Date(e.expenseDate || e.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonth.reduce((s, e) => s + Number(e.amount), 0);

  const displayed = filterCat === "All"
    ? expenses
    : expenses.filter((e) => e.category === filterCat);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── HEADER ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
              <TrendingDown size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">Society Expense Manager</h1>
              <p className="text-gray-500 text-sm mt-0.5">Track and manage all society expenditures</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-rose-100 transition-all hover:-translate-y-0.5"
          >
            <PlusCircle size={18} /> Add Expense
          </button>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Spent" value={`₹${totalAmount.toLocaleString()}`} color="bg-rose-600" />
          <StatCard label="This Month"  value={`₹${thisMonthTotal.toLocaleString()}`} color="bg-orange-500" />
          <StatCard label="Total Records" value={expenses.length} color="bg-indigo-600" />
          <StatCard label="Categories"  value={[...new Set(expenses.map(e => e.category))].length} color="bg-emerald-600" />
        </div>

        {/* ── CATEGORY FILTER PILLS ── */}
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${
                filterCat === cat
                  ? "bg-rose-600 text-white border-rose-600"
                  : "bg-white text-gray-500 border-gray-200 hover:border-rose-300 hover:text-rose-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── EXPENSE TABLE ── */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader size={32} className="animate-spin text-rose-500" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center flex flex-col items-center">
            <FileText size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700">No expenses found</h3>
            <p className="text-gray-400 mt-2 max-w-sm">Click the "Add Expense" button to record a new society expense.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Title", "Category", "Payment Method", "Date", "Amount", "Action"].map((h) => (
                      <th key={h} className="px-5 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayed.map((exp) => (
                    <tr key={exp._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-gray-800">{exp.title}</p>
                        {exp.description && (
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{exp.description}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${CATEGORY_COLORS[exp.category] || "bg-gray-100 text-gray-600"}`}>
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600 font-medium">{exp.paymentMethod}</td>
                      <td className="px-5 py-4 text-gray-500 text-xs font-semibold">
                        {new Date(exp.expenseDate || exp.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-rose-600 font-black text-base">
                          ₹{Number(exp.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDelete(exp._id)}
                          disabled={deletingId === exp._id}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          {deletingId === exp._id
                            ? <Loader size={16} className="animate-spin" />
                            : <Trash2 size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td colSpan={4} className="px-5 py-4 font-black text-gray-700 uppercase text-xs tracking-wider">
                      {filterCat === "All" ? "Grand Total" : `${filterCat} Total`}
                    </td>
                    <td className="px-5 py-4 font-black text-rose-700 text-base">
                      ₹{displayed.reduce((s, e) => s + Number(e.amount), 0).toLocaleString()}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── ADD EXPENSE MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b">
              <div>
                <h2 className="text-2xl font-black text-gray-800">Record Expense</h2>
                <p className="text-gray-400 text-sm mt-0.5">Add a new society expense entry</p>
              </div>
              <button
                onClick={() => { setShowForm(false); setForm(emptyForm); }}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Title */}
              <FormField icon={<FileText size={16} />} label="Expense Title *">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Generator fuel refill"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-400 bg-gray-50 text-sm"
                  required
                />
              </FormField>

              {/* Category + Payment Method */}
              <div className="grid grid-cols-2 gap-4">
                <FormField icon={<Tag size={16} />} label="Category *">
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-400 bg-gray-50 text-sm"
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField icon={<CreditCard size={16} />} label="Payment Method *">
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-400 bg-gray-50 text-sm"
                    required
                  >
                    <option value="">Select method</option>
                    {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </FormField>
              </div>

              {/* Amount + Date */}
              <div className="grid grid-cols-2 gap-4">
                <FormField icon={<IndianRupee size={16} />} label="Amount (₹) *">
                  <input
                    type="number"
                    min="1"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-400 bg-gray-50 text-sm"
                    required
                  />
                </FormField>
                <FormField icon={<Calendar size={16} />} label="Date">
                  <input
                    type="date"
                    value={form.expenseDate}
                    onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-400 bg-gray-50 text-sm"
                  />
                </FormField>
              </div>

              {/* Description */}
              <FormField icon={<AlignLeft size={16} />} label="Description (optional)">
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief note about this expense..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-rose-400 bg-gray-50 text-sm resize-none"
                />
              </FormField>

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t mt-6">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setForm(emptyForm); }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md shadow-rose-100 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader size={18} className="animate-spin" /> : <PlusCircle size={18} />}
                  {submitting ? "Saving..." : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Helpers ── */
function StatCard({ label, value, color }) {
  return (
    <div className={`${color} rounded-2xl p-5 text-white shadow-sm`}>
      <p className="text-xs font-bold uppercase tracking-wider opacity-80">{label}</p>
      <p className="text-2xl font-black mt-1">{value}</p>
    </div>
  );
}

function FormField({ icon, label, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
        <span className="text-rose-500">{icon}</span> {label}
      </label>
      {children}
    </div>
  );
}