import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ShieldCheck, Bell, Users, FileText, LogIn, LogOut,
  Loader, CheckCircle, Clock, Phone, Home, User,
  AlertTriangle, Key, RefreshCw
} from "lucide-react";

const API = "http://localhost:5100/api";

// ─── OTP Generator ─────────────────────────────────────────────────────────
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── Tab Button ─────────────────────────────────────────────────────────────
function Tab({ active, icon: Icon, label, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all relative ${
        active
          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
      }`}
    >
      <Icon size={17} />
      {label}
      {badge > 0 && (
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}

// ─── MAIN GUARD DASHBOARD ───────────────────────────────────────────────────
export default function GuardDashboard() {
  const [activeTab, setActiveTab] = useState("entry");
  const [residents, setResidents] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const guardInfo = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  })();

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      fetchResidents(),
      fetchVisitors(),
      fetchNotices()
    ]).finally(() => setLoading(false));
  }, []);

  const fetchResidents = async () => {
    try {
      const res = await axios.get(`${API}/residents`);
      // Backend returns plain array directly
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data?.data ?? res.data?.residents ?? []);
      setResidents(data);
    } catch (e) {
      console.error("Resident fetch error:", e);
      toast.error("Could not load residents list");
    }
  };

  const fetchVisitors = async () => {
    try {
      const res = await axios.get(`${API}/visitor`);
      // VisitorController returns { success, count, data: [...] }
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data?.data ?? []);
      setVisitors(data);
    } catch (e) {
      console.error("Visitor fetch error:", e);
      toast.error("Could not load visitor log");
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${API}/notice`);
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data?.data ?? res.data?.notices ?? []);
      setNotices(data);
    } catch (e) {
      console.error("Notice fetch error:", e);
      // Non-critical — guard doesn't need notices to function
    }
  };

  // Always guard: insideNow only if visitors is a real array
  const insideNow = Array.isArray(visitors)
    ? visitors.filter((v) => v?.status === "inside")
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-gray-400">
        <Loader size={28} className="animate-spin text-blue-500" />
        <p className="text-lg font-semibold">Loading Guard Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info Bar */}
      <div className="bg-gradient-to-r from-slate-800 to-blue-900 rounded-2xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-500/30 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={30} />
          </div>
          <div>
            <p className="text-blue-200 text-sm font-semibold">Guard On Duty</p>
            <h1 className="text-2xl font-black tracking-tight">
              {guardInfo.name || guardInfo.email?.split("@")[0] || "Guard"}
            </h1>
            <p className="text-blue-300 text-xs mt-0.5">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long", day: "numeric", month: "long", year: "numeric"
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Stat label="Inside Now" value={insideNow.length} color="bg-green-500/20 text-green-300" />
          <Stat label="Today Total" value={visitors.length} color="bg-blue-500/20 text-blue-300" />
          <Stat label="Residents" value={residents.length} color="bg-purple-500/20 text-purple-300" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        <Tab active={activeTab === "entry"} icon={LogIn} label="Visitor Entry" onClick={() => setActiveTab("entry")} />
        <Tab active={activeTab === "log"} icon={Clock} label="Today's Log" onClick={() => setActiveTab("log")} badge={insideNow.length} />
        <Tab active={activeTab === "residents"} icon={Users} label="Residents" onClick={() => setActiveTab("residents")} />
        <Tab active={activeTab === "notices"} icon={FileText} label="Notices" onClick={() => setActiveTab("notices")} />
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "entry" && (
          <VisitorEntryTab residents={residents} onNewVisitor={(v) => { setVisitors((prev) => [v, ...prev]); }} />
        )}
        {activeTab === "log" && (
          <VisitorLogTab visitors={visitors} onCheckout={fetchVisitors} />
        )}
        {activeTab === "residents" && <ResidentsTab residents={residents} />}
        {activeTab === "notices" && <NoticesTab notices={notices} />}
      </div>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function Stat({ label, value, color }) {
  return (
    <div className={`${color} rounded-xl px-4 py-3 text-center min-w-[80px]`}>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-[10px] font-bold opacity-80">{label}</p>
    </div>
  );
}

// ─── VISITOR ENTRY TAB ───────────────────────────────────────────────────────
function VisitorEntryTab({ residents, onNewVisitor }) {
  const [form, setForm] = useState({
    visitorName: "", mobileNumber: "", blockWing: "",
    flatNumber: "", purpose: "Delivery", visitingResident: ""
  });
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const purposes = ["Delivery", "Guest", "Service", "Cab", "Courier", "Other"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const triggerBell = () => {
    setShake(true);
    setTimeout(() => setShake(false), 800);
    toast.info("🔔 Resident has been notified!", { position: "top-center" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.visitorName || !form.mobileNumber || !form.blockWing || !form.flatNumber || !form.purpose) {
      toast.error("Please fill all required fields");
      return;
    }

    const otp = generateOTP();
    setGeneratedOTP(otp);
    setLoading(true);

    try {
      const payload = {
        ...form,
        visitorKey: otp,
        visitingResident: form.visitingResident || undefined,
      };
      const res = await axios.post("http://localhost:5100/api/visitor", payload);
      const newVisitor = res.data?.data || res.data;
      onNewVisitor(newVisitor);
      setSubmitted(true);
      triggerBell();
      toast.success("Visitor logged and resident notified!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to log visitor. Check required fields.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ visitorName: "", mobileNumber: "", blockWing: "", flatNumber: "", purpose: "Delivery", visitingResident: "" });
    setGeneratedOTP("");
    setSubmitted(false);
  };

  if (submitted && generatedOTP) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 text-center space-y-6">
          {/* Bell animation */}
          <div
            className={`w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto text-green-500 text-4xl transition-transform ${shake ? "animate-bounce" : ""}`}
          >
            🔔
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800">Visitor Logged!</h2>
            <p className="text-gray-500 mt-1">Resident has been notified</p>
          </div>

          {/* OTP Key Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
              <Key size={12} /> Visitor Entry Key
            </p>
            <p className="text-5xl font-black tracking-[0.3em]">{generatedOTP}</p>
            <p className="text-blue-200 text-xs mt-3">Share this key with the visitor</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-1 text-sm">
            <p><span className="font-bold text-gray-500">Visitor:</span> <span className="font-semibold text-gray-800">{form.visitorName}</span></p>
            <p><span className="font-bold text-gray-500">Mobile:</span> <span className="font-semibold text-gray-800">{form.mobileNumber}</span></p>
            <p><span className="font-bold text-gray-500">Flat:</span> <span className="font-semibold text-gray-800">{form.blockWing} – {form.flatNumber}</span></p>
            <p><span className="font-bold text-gray-500">Purpose:</span> <span className="font-semibold text-gray-800">{form.purpose}</span></p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={triggerBell}
              className={`flex-1 flex items-center justify-center gap-2 py-3 bg-yellow-400 text-yellow-900 font-bold rounded-2xl hover:bg-yellow-500 transition-colors ${shake ? "scale-95" : ""}`}
            >
              <Bell size={18} className={shake ? "animate-bounce" : ""} /> Ring Bell
            </button>
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={18} /> New Entry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
          <LogIn size={22} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-800">Visitor Entry</h2>
          <p className="text-gray-400 text-sm">Log visitor details and notify resident</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Visitor Name *" name="visitorName" value={form.visitorName} onChange={handleChange} placeholder="Full name" />
          <Field label="Mobile Number *" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} placeholder="10-digit number" type="tel" />
          <Field label="Wing / Block *" name="blockWing" value={form.blockWing} onChange={handleChange} placeholder="e.g. A" />
          <Field label="Flat Number *" name="flatNumber" value={form.flatNumber} onChange={handleChange} placeholder="e.g. 204" />
        </div>

        {/* Purpose Select */}
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1.5">Purpose of Visit *</label>
          <div className="flex flex-wrap gap-2">
            {purposes.map((p) => (
              <button
                key={p} type="button"
                onClick={() => setForm({ ...form, purpose: p })}
                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                  form.purpose === p
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                }`}
              >
                {p === "Delivery" ? "📦" : p === "Guest" ? "👤" : p === "Service" ? "🔧" : p === "Cab" ? "🚕" : p === "Courier" ? "📬" : "📋"} {p}
              </button>
            ))}
          </div>
        </div>

        {/* Resident Dropdown */}
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1.5">Visiting Resident (optional)</label>
          <select
            name="visitingResident"
            value={form.visitingResident}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          >
            <option value="">Select Resident</option>
            {residents.map((r) => (
              <option key={r._id} value={r._id}>
                {r.firstName} {r.lastName} — Wing {r.wing}, Flat {r.flatNumber}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white font-black text-lg rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-60"
        >
          {loading ? <Loader size={22} className="animate-spin" /> : <><Bell size={20} /> Log Visitor & Notify Resident</>}
        </button>
      </form>
    </div>
  );
}

// ─── VISITOR LOG TAB ─────────────────────────────────────────────────────────
function VisitorLogTab({ visitors, onCheckout }) {
  const [checkingOut, setCheckingOut] = useState(null);

  const handleCheckout = async (id) => {
    setCheckingOut(id);
    try {
      await axios.put(`http://localhost:5100/api/visitor/checkout/${id}`);
      toast.success("Visitor checked out!");
      onCheckout();
    } catch (err) {
      toast.error("Checkout failed");
    } finally {
      setCheckingOut(null);
    }
  };

  const purposeEmoji = { Delivery: "📦", Guest: "👤", Service: "🔧", Cab: "🚕", Courier: "📬" };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending":
        return { text: "⏳ Pending Approval", badge: "bg-orange-100 text-orange-700 font-bold", border: "border-orange-200 shadow-sm shadow-orange-50 bg-orange-50/10" };
      case "inside":
        return { text: "🟢 Inside", badge: "bg-green-100 text-green-700 font-bold", border: "border-green-200 shadow-sm shadow-green-50 bg-white" };
      case "Exited":
        return { text: "🔴 Exited", badge: "bg-gray-100 text-gray-500 font-medium", border: "border-gray-100 opacity-70 bg-white" };
      default:
        return { text: status, badge: "bg-gray-100 text-gray-800", border: "" };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-800">Visitor Log</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-semibold">{visitors.length} Total</span>
      </div>

      {visitors.length === 0 ? (
        <EmptyState emoji="🔒" text="No visitors logged today" />
      ) : (
        <div className="space-y-3">
          {visitors.map((v) => {
            const styles = getStatusStyles(v.status);
            return (
              <div key={v._id} className={`rounded-2xl border p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${styles.border}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/60 border border-gray-100 flex items-center justify-center text-2xl shadow-sm">
                    {purposeEmoji[v.purpose] || "🙂"}
                  </div>
                  <div>
                    <p className="font-black text-gray-800">{v.visitorName || "—"}</p>
                    <p className="text-sm text-gray-500">
                      {v.mobileNumber || "—"} · Wing {v.blockWing || "?"}, Flat {v.flatNumber || "?"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {v.purpose || "Visit"} · Entry:{" "}
                      {v.entryTime
                        ? new Date(v.entryTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                        : "—"}
                      {v.exitTime
                        ? ` · Exit: ${new Date(v.exitTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-full text-xs ${styles.badge}`}>
                    {styles.text}
                  </span>
                  {v.status === "inside" && (
                    <button
                      onClick={() => handleCheckout(v._id)}
                      disabled={checkingOut === v._id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-100 transition-colors"
                    >
                      {checkingOut === v._id ? <Loader size={14} className="animate-spin" /> : <LogOut size={14} />} Check Out
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ─── RESIDENTS TAB ───────────────────────────────────────────────────────────
function ResidentsTab({ residents }) {
  const [search, setSearch] = useState("");
  const filtered = residents.filter(
    (r) =>
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      r.flatNumber?.includes(search) ||
      r.wing?.toLowerCase().includes(search.toLowerCase()) ||
      r.mobileNumber?.includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <h2 className="text-xl font-black text-gray-800">Resident Directory</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, flat, wing or mobile…"
          className="ml-auto border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="🔍" text="No residents found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <div key={r._id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 font-black flex items-center justify-center text-lg">
                  {r.firstName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-gray-800">{r.firstName} {r.lastName}</p>
                  <p className="text-xs text-blue-600 font-bold">{r.residentType}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <p className="flex items-center gap-2 text-gray-600"><Home size={14} /> Wing {r.wing}, Flat {r.flatNumber}</p>
                <p className="flex items-center gap-2 text-gray-600"><Phone size={14} /> {r.mobileNumber}</p>
                {r.email && <p className="flex items-center gap-2 text-gray-400 text-xs truncate">{r.email}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NOTICES TAB ─────────────────────────────────────────────────────────────
function NoticesTab({ notices }) {
  // Only show Active notices
  const activeNotices = notices.filter(n => n.status === 'Active');

  const getPriorityStyle = (priority) => {
    if (priority === "High") return "bg-red-100 text-red-700 border-red-200";
    if (priority === "medium") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const isNew = (dateString) => {
    return new Date(dateString).toDateString() === new Date().toDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-gray-800">Society Notices</h2>
        <span className="text-sm font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-lg">
          {activeNotices.length} Live Updates
        </span>
      </div>

      {activeNotices.length === 0 ? (
        <EmptyState emoji="📋" text="No active notices from admin at the moment" />
      ) : (
        <div className="space-y-4">
          {activeNotices.map((n) => (
            <div key={n._id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden group">
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${n.priority === "High" ? "bg-red-500" : n.priority === "medium" ? "bg-yellow-400" : "bg-green-500"}`} />
              
              <div className="pl-2 flex justify-between items-start mb-3">
                <span className={`text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md border ${getPriorityStyle(n.priority)}`}>
                  {n.priority}
                </span>
                
                {isNew(n.noticeDate) && (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase text-blue-600 bg-blue-50 border border-blue-100 shadow-sm px-2 py-1 rounded-md animate-pulse">
                     New Today
                  </span>
                )}
              </div>
              
              <div className="pl-2">
                <h3 className="font-extrabold text-xl text-gray-800 tracking-tight leading-tight">{n.title || n.subject}</h3>
                <p className="text-gray-500 mt-2 leading-relaxed text-sm md:text-base border-l-2 border-gray-100 pl-3 italic">
                  "{n.description || n.content}"
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Clock size={14} />
                  Published: {new Date(n.noticeDate).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Field({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-600 mb-1.5">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-sm"
      />
    </div>
  );
}

function EmptyState({ emoji, text }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-5xl mb-4">{emoji}</p>
      <p className="font-semibold text-lg">{text}</p>
    </div>
  );
}
