import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader, ShieldCheck, Clock, UserCheck, Search, Filter } from "lucide-react";

export default function UserVisitor() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  };

  const API_URL = "http://localhost:5100/api/visitor";

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        const profileId = currentUser.profileid || currentUser._id;
        
        // As a resident we want to fetch resident data, so we'll grab currentUser details again if they exist
        // or we'll fetch them if missing, but typically they are in local storage by now
        const residentRes = await axios.get(`http://localhost:5100/api/residents/${profileId}`).catch(() => null);
        let residentData = null;
        if (residentRes && residentRes.data) {
          residentData = residentRes.data;
        }

        const wing = residentData?.blockWing || currentUser.blockWing;
        const flat = residentData?.flatNumber || currentUser.flatNumber;

        const res = await axios.get(API_URL);
        const allVisitors = Array.isArray(res.data) ? res.data : res.data?.data || [];

        // Filter the dataset to only visitors arriving at the logged-in resident's exact Wing & Flat Number
        const myVisitors = allVisitors.filter(v => 
          (v.blockWing === wing && String(v.flatNumber) === String(flat)) ||
          v.visitingResident === profileId
        );

        // Sort descending by expected time / date
        setVisitors(myVisitors.sort((a,b) => new Date(b.date) - new Date(a.date)));
      } catch (err) {
        console.error("Error fetching visitors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "inside":
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">Gate Cleared</span>;
      case "exited":
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">Left</span>;
      case "pending":
      default:
        return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">Awaiting Entry</span>;
    }
  };

  // Filter and Search
  const filteredVisitors = visitors.filter(v => 
    (filterStatus === "all" || v.status?.toLowerCase() === filterStatus) &&
    (v.visitorName?.toLowerCase().includes(searchTerm.toLowerCase()) || v.purpose?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="p-8"><Loader className="animate-spin text-indigo-500" /></div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-800">Visitor Logs</h1>
            <p className="text-gray-500 text-sm mt-1">Check security records and arrivals at your flat.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
           <div className="relative w-full md:w-96 flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search visitor name or purpose..." 
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-100 focus:border-indigo-500 rounded-xl outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
           
           <div className="flex gap-2">
              {['all', 'inside', 'exited'].map(status => (
                <button 
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border-2 transition-all ${
                    filterStatus === status 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-100 text-gray-500 hover:border-indigo-200'
                  }`}
                >
                  {status === 'all' ? 'All Logs' : status === 'inside' ? 'Currently Inside' : 'Exited'}
                </button>
              ))}
           </div>
        </div>

        {filteredVisitors.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
            <UserCheck size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">No Visitors Found</h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              We couldn't find any visitors matching your filters, or you haven't received any guests recently.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {filteredVisitors.map(v => (
              <div key={v._id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full font-black text-xl flex items-center justify-center pt-1 border border-gray-200 shadow-inner">
                  {v.visitorName?.[0]?.toUpperCase() || 'V'}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{v.visitorName || 'Unknown'}</h3>
                    {getStatusBadge(v.status)}
                  </div>
                  
                  <p className="text-sm font-semibold text-gray-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> {v.purpose || 'Personal'}
                  </p>
                  
                  <div className="grid grid-cols-2 mt-4 pt-3 border-t border-gray-50 gap-2">
                     <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Arrival Log</p>
                        <p className="text-xs font-black text-gray-700 flex items-center gap-1 mt-0.5">
                           <Clock size={10}/> {new Date(v.expectedDate || v.date).toLocaleDateString()}, {v.expectedTime}
                        </p>
                     </div>
                     <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Contact</p>
                        <p className="text-xs font-black text-gray-700 mt-0.5">{v.mobile || 'Not Mapped'}</p>
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
