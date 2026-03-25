import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  WalletCards, Plus, IndianRupee, Activity, 
  TrendingDown, FileText, Tag, Loader 
} from 'lucide-react';

const TotalExpense = () => {
    const [expenses, setExpenses] = useState([]);
    const [formData, setFormData] = useState({ title: '', amount: '', category: 'Food' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [filterCat, setFilterCat] = useState('All');

    const API_URL = 'http://localhost:5100/api/totalExpense';

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/all`);
            setExpenses(res.data || []);
        } catch (err) { 
            console.log("Error fetching data", err); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchExpenses(); }, []);

    const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    const displayed = filterCat === 'All' ? expenses : expenses.filter(e => e.category === filterCat);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`${API_URL}/add`, formData);
            setFormData({ title: '', amount: '', category: 'Food' });
            fetchExpenses();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const getCatColor = (cat) => {
        switch(cat) {
            case 'Food': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Rent': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Shopping': return 'bg-pink-100 text-pink-700 border-pink-200';
            case 'Bills': return 'bg-red-100 text-red-700 border-red-200';
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

                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* ADD EXPENSE COMPONENT */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit lg:col-span-1">
                        <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                            <TrendingDown size={20} className="text-red-500" /> Log Transaction
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                                    <FileText size={14} className="text-blue-500"/> Title
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Enter item name..." 
                                    className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 transition-all font-medium"
                                    value={formData.title} 
                                    onChange={e => setFormData({...formData, title: e.target.value})} 
                                    required 
                                />
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                                    <IndianRupee size={14} className="text-green-500"/> Amount
                                </label>
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    min="1"
                                    className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 transition-all font-bold text-green-700"
                                    value={formData.amount} 
                                    onChange={e => setFormData({...formData, amount: e.target.value})} 
                                    required 
                                />
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                                    <Tag size={14} className="text-purple-500"/> Category classification
                                </label>
                                <select 
                                    className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 font-bold text-gray-700"
                                    value={formData.category} 
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="Food">Food & Catering</option>
                                    <option value="Rent">Facility Rent</option>
                                    <option value="Shopping">Supplies & Shopping</option>
                                    <option value="Bills">Utility Bills</option>
                                </select>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all mt-4 disabled:opacity-70"
                            >
                                {submitting ? <Loader size={18} className="animate-spin" /> : <Plus size={18} />}
                                {submitting ? 'Authenticating...' : 'Add Expense'}
                            </button>
                        </form>
                    </div>

                    {/* TABLE COMPONENT */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2 flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50">
                            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                                <Activity size={20} className="text-blue-500" /> Transaction History
                            </h3>
                            <div className="flex gap-2">
                                {['All', 'Food', 'Rent', 'Shopping', 'Bills'].map(cat => (
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
                                        <th className="p-5 text-right">Debit Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 bg-white">
                                    {loading ? (
                                        <tr><td colSpan="3" className="p-8 text-center text-gray-400 font-semibold"><Loader size={24} className="animate-spin mx-auto text-indigo-500"/></td></tr>
                                    ) : displayed.length === 0 ? (
                                        <tr><td colSpan="3" className="p-12 text-center text-gray-400 font-bold text-sm bg-gray-50/50">No logs generated for this filter.</td></tr>
                                    ) : displayed.map((exp) => (
                                        <tr key={exp._id} className="hover:bg-indigo-50/30 transition-colors group">
                                            <td className="p-5">
                                                <p className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{exp.title}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{new Date(exp.date).toLocaleDateString()}</p>
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border inline-block ${getCatColor(exp.category)}`}>
                                                    {exp.category}
                                                </span>
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