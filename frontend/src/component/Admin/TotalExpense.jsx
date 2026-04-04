import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  WalletCards, Activity, 
  Loader 
} from 'lucide-react';

const TotalExpense = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCat, setFilterCat] = useState('All');

    const API_URL = 'http://localhost:5100/api/expense';

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/all`);
            setExpenses(res.data?.data || []);
        } catch (err) { 
            console.log("Error fetching data", err); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchExpenses(); }, []);

    const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    const displayed = filterCat === 'All' ? expenses : expenses.filter(e => e.category === filterCat);

    const CATEGORIES = [
        "All",
        "Maintenance",
        "Cleaning",
        "Security",
        "Electricity",
        "Water",
        "Events",
        "Other"
    ];

    const getCatColor = (cat) => {
        switch(cat) {
            case 'Maintenance': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Cleaning': return 'bg-green-100 text-green-700 border-green-200';
            case 'Security': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'Electricity': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Water': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
            case 'Gardening': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Repairs': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Events': return 'bg-pink-100 text-pink-700 border-pink-200';
            case 'Salaries': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* HEADER WIDGET */}
                <div className="bg-gradient-to-r from-slate-800 to-indigo-900 rounded-3xl p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                            <WalletCards size={32} className="text-blue-200" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Financial Overview</h1>
                            <p className="text-indigo-200 text-sm mt-1 font-medium">Internal organizational total expense tracker</p>
                        </div>
                    </div>
                    <div className="relative z-10 bg-white/10 backdrop-blur-md px-8 py-5 rounded-2xl border border-white/20 text-right min-w-[200px]">
                        <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Total Disbursed</p>
                        <h2 className="text-4xl font-black text-white">₹{totalAmount.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="grid lg:grid-cols-1 gap-8">
                    {/* TABLE COMPONENT */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50">
                            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                                <Activity size={20} className="text-blue-500" /> Transaction History
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button 
                                        key={cat} onClick={() => setFilterCat(cat)}
                                        className={`px-3 py-1 text-xs font-bold rounded-full transition-all border ${filterCat === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 hover:text-indigo-600'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto flex-1 p-0">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead>
                                    <tr className="bg-white border-b border-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                                        <th className="p-5">Transaction Details</th>
                                        <th className="p-5">Ledger Category</th>
                                        <th className="p-5">Payment Method</th>
                                        <th className="p-5 text-right">Debit Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 bg-white">
                                    {loading ? (
                                        <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-semibold"><Loader size={24} className="animate-spin mx-auto text-indigo-500"/></td></tr>
                                    ) : displayed.length === 0 ? (
                                        <tr><td colSpan="4" className="p-12 text-center text-gray-400 font-bold text-sm bg-gray-50/50">No logs generated for this filter.</td></tr>
                                    ) : displayed.map((exp) => (
                                        <tr key={exp._id} className="hover:bg-indigo-50/30 transition-colors group">
                                            <td className="p-5">
                                                <p className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{exp.title}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{new Date(exp.expenseDate || exp.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border inline-block ${getCatColor(exp.category)}`}>
                                                    {exp.category}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <span className="text-gray-500 font-semibold text-xs tracking-wider uppercase">{exp.paymentMethod}</span>
                                            </td>
                                            <td className="p-5 text-right">
                                                <span className="font-black text-red-500 text-lg group-hover:scale-105 inline-block transition-transform">
                                                    -₹{Number(exp.amount).toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TotalExpense;