import React from 'react';
import { Flame, ShieldAlert, Activity, PhoneCall, AlertTriangle } from 'lucide-react';

const Emergency = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
              <Flame size={32} className="text-rose-200 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Emergency Protocol Hub</h1>
              <p className="text-rose-200 text-sm mt-1 font-medium">Broadcast instant society-wide multi-channel alarms</p>
            </div>
          </div>
        </div>

        {/* ALERTS GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          <button className="group bg-white p-8 rounded-2xl shadow-sm border border-red-100 hover:shadow-lg hover:-translate-y-1 hover:border-red-300 transition-all text-left">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <Flame size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">Fire Hazard</h3>
            <p className="text-sm text-gray-500 font-medium">Trigger building-wide fire evacuation sirens and notify fire department immediately.</p>
          </button>

          <button className="group bg-white p-8 rounded-2xl shadow-sm border border-orange-100 hover:shadow-lg hover:-translate-y-1 hover:border-orange-300 transition-all text-left">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">Security Breach</h3>
            <p className="text-sm text-gray-500 font-medium">Lock down all society gates and instantly notify on-duty security supervisors.</p>
          </button>

          <button className="group bg-white p-8 rounded-2xl shadow-sm border border-blue-100 hover:shadow-lg hover:-translate-y-1 hover:border-blue-300 transition-all text-left">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">Medical SOS</h3>
            <p className="text-sm text-gray-500 font-medium">Alert society medical volunteers and coordinate urgent ambulance entry protocols.</p>
          </button>
        </div>

        {/* LIVE BOARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <AlertTriangle size={20} className="text-rose-500" /> Active Alert Monitoring
            </h3>
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Systems Normal
            </span>
          </div>
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-inner">
              <ShieldAlert size={32} className="text-gray-300" />
            </div>
            <h4 className="text-xl font-black text-gray-700">No Active Emergencies</h4>
            <p className="text-sm text-gray-400 font-medium mt-2 max-w-sm">
              The society ecosystem is currently safe. Any resident-triggered SOS panics will appear here instantly.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Emergency;