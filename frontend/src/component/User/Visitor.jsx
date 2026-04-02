import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Loader, ShieldCheck, Clock, UserCheck, Search,
  Phone, AlertCircle, CheckCircle, LogOut
} from "lucide-react";

const API          = "http://localhost:5100/api";
const RESIDENT_API = `${API}/residents`;
const VISITOR_API  = `${API}/visitor`;

/* ── Resolve session/local user ── */
const getSessionUser = () => {
  try {
    return JSON.parse(
      sessionStorage.getItem("user") || localStorage.getItem("user") || "{}"
    );
  } catch { return {}; }
};

export default function UserVisitor() {
  const [visitors,     setVisitors]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [residentInfo, setResidentInfo] = useState(null);
  const [searchTerm,   setSearchTerm]   = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const user      = getSessionUser();
        const email     = user.email;
        const profileId = user.profileid || user._id;

        /* ── Step 1: resolve resident's real Mongo _id ── */
        let resident = null;

        // Primary: by email (most reliable)
        if (email) {
          try {
            const r = await axios.get(
              `${RESIDENT_API}/by-email/${encodeURIComponent(email)}`
            );
            if (r.data?._id) resident = r.data;
          } catch { /* not found */ }
        }

        // Fallback: by profileId stored in session
        if (!resident && profileId) {
          try {
            const r = await axios.get(`${RESIDENT_API}/${profileId}`);
            if (r.data?._id) resident = r.data;
          } catch { /* not found */ }
        }

        if (!resident) {
          setError("Could not find your resident profile. Please contact admin.");
          setLoading(false);
          return;
        }

        setResidentInfo(resident);

        /* ── Step 2: fetch visitors linked to this resident's _id ── */
        // Backend: GET /api/visitor/resident/:residentId  →  { visitingResident: residentId }
        const linkedRes = await axios.get(
          `${VISITOR_API}/resident/${resident._id}`
        ).catch(() => null);

        const linked = linkedRes?.data?.data || [];

        /* ── Step 3: also fetch ALL visitors and match by wing + flatNumber ──
           Covers entries where guard typed wing/flat but didn't pick resident from dropdown */
        const allRes = await axios.get(VISITOR_API).catch(() => null);
        const allVisitors = allRes?.data?.data || [];

        const linkedIds = new Set(linked.map(v => v._id));

        const wing = resident.wing  || "";
        const flat = String(resident.flatNumber || "");

        const flatMatched = Array.isArray(allVisitors)
          ? allVisitors.filter(v =>
              !linkedIds.has(v._id) &&
              wing && flat &&
              // VisitorModel stores blockWing; compare against resident's wing
              (v.blockWing?.toLowerCase() === wing.toLowerCase()) &&
              String(v.flatNumber) === flat
            )
          : [];

        const merged = [...linked, ...flatMatched].sort(
          (a, b) =>
            new Date(b.entryTime || b.createdAt) -
            new Date(a.entryTime || a.createdAt)
        );

        setVisitors(merged);
      } catch (err) {
        console.error("Visitor fetch error:", err);
        setError("Failed to load visitor logs.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ── Status badge ── */
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "inside":
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <CheckCircle size={11} /> Inside
          </span>
        );
      case "exited":
        return (
          <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <LogOut size={11} /> Exited
          </span>
        );
      case "pending":
      default:
        return (
          <span className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Clock size={11} /> Pending
          </span>
        );
    }
  };

  /* ── Purpose emoji ── */
  const purposeEmoji = { Delivery: "📦", Guest: "👤", Service: "🔧", Cab: "🚕", Courier: "📬", Other: "📋" };

  /* ── Filtered list ── */
  const filteredVisitors = visitors.filter(v =>
    (filterStatus === "all" || v.status?.toLowerCase() === filterStatus) &&
    (
      v.visitorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.purpose?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  /* ── Loading / Error screens ── */
  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader className="animate-spin text-indigo-500" size={36} />
        <p className="text-gray-500 font-semibold">Loading your visitor logs…</p>
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

  const insideCount  = visitors.filter(v => v.status === "inside").length;
  const pendingCount = visitors.filter(v => v.status === "Pending").length;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">My Visitor Logs</h1>
              {residentInfo && (
                <p className="text-gray-500 text-sm mt-0.5">
                  Wing {residentInfo.wing}, Flat {residentInfo.flatNumber} ·{" "}
                  {residentInfo.firstName} {residentInfo.lastName}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-2.5 text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-green-500">Inside Now</p>
              <p className="text-2xl font-black text-green-700">{insideCount}</p>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl px-5 py-2.5 text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Pending</p>
              <p className="text-2xl font-black text-orange-700">{pendingCount}</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-2.5 text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Total</p>
              <p className="text-2xl font-black text-indigo-700">{visitors.length}</p>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="relative w-full md:w-96 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search visitor name or purpose…"
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-100 focus:border-indigo-500 rounded-xl outline-none text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all",     label: "All" },
              { key: "inside",  label: "Inside" },
              { key: "pending", label: "Pending" },
              { key: "exited",  label: "Exited" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border-2 transition-all ${
                  filterStatus === key
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-100 text-gray-500 hover:border-indigo-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* VISITOR CARDS */}
        {filteredVisitors.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
            <UserCheck size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">No Visitors Found</h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              {visitors.length === 0
                ? "No visitors have been logged for your flat yet."
                : "No visitors match your current search or filter."}
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {filteredVisitors.map(v => (
              <div
                key={v._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Status color bar */}
                <div className={`h-1.5 w-full ${
                  v.status === "inside" ? "bg-green-500" :
                  v.status === "Pending" ? "bg-orange-400" : "bg-gray-300"
                }`} />

                <div className="p-5 flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full font-black text-xl flex items-center justify-center flex-shrink-0">
                    {purposeEmoji[v.purpose] || v.visitorName?.[0]?.toUpperCase() || "V"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <h3 className="font-black text-gray-900 text-lg leading-tight truncate">
                        {v.visitorName || "Unknown"}
                      </h3>
                      {getStatusBadge(v.status)}
                    </div>

                    <p className="text-sm font-semibold text-gray-500 mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                      {v.purpose || "Personal Visit"}
                    </p>

                    {/* OTP badge when pending */}
                    {v.status === "Pending" && v.visitorKey && (
                      <div className="mt-2 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-3 py-1.5 text-xs font-black">
                        🔑 Entry OTP: <span className="tracking-[0.3em]">{v.visitorKey}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 mt-3 pt-3 border-t border-gray-50 gap-3">
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Entry Time</p>
                        <p className="text-xs font-bold text-gray-700 mt-0.5 flex items-center gap-1">
                          <Clock size={10} className="text-gray-400" />
                          {v.entryTime
                            ? `${new Date(v.entryTime).toLocaleDateString("en-IN")} · ${new Date(v.entryTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
                            : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Mobile</p>
                        <p className="text-xs font-bold text-gray-700 mt-0.5 flex items-center gap-1">
                          <Phone size={10} className="text-gray-400" />
                          {v.mobileNumber || "—"}
                        </p>
                      </div>
                      {v.exitTime && (
                        <div className="col-span-2">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Exit Time</p>
                          <p className="text-xs font-bold text-gray-700 mt-0.5 flex items-center gap-1">
                            <LogOut size={10} className="text-gray-400" />
                            {new Date(v.exitTime).toLocaleDateString("en-IN")} · {new Date(v.exitTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
