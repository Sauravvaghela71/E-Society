import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TotalExpense = () => {
    const [expenses, setExpenses] = useState([]);
    const [formData, setFormData] = useState({ title: '', amount: '', category: 'Food' });

    const fetchExpenses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/totalExpense/all');
            setExpenses(res.data);
        } catch (err) { console.log("Error fetching data", err); }
    };

    useEffect(() => { fetchExpenses(); }, []);

    const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/totalExpense/add', formData);
        setFormData({ title: '', amount: '', category: 'Food' });
        fetchExpenses();
    };

    return (
        <div style={styles.container}>
            {/* --- Header Section --- */}
            <header style={styles.header}>
                <h1>Expense <span style={{color: '#4f46e5'}}>Tracker</span></h1>
                <div style={styles.totalCard}>
                    <p>Total Balance</p>
                    <h2 style={{margin: 0}}>₹{totalAmount.toLocaleString()}</h2>
                </div>
            </header>

            <div style={styles.mainLayout}>
                {/* --- Form Section (Unique Sidebar Style) --- */}
                <aside style={styles.formContainer}>
                    <h3>Add Transaction</h3>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <label>Title</label>
                        <input type="text" placeholder="Rent, Groceries..." 
                               value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                        
                        <label>Amount (₹)</label>
                        <input type="number" placeholder="0.00" 
                               value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                        
                        <label>Category</label>
                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option value="Food">Food</option>
                            <option value="Rent">Rent</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Bills">Bills</option>
                        </select>
                        
                        <button type="submit" style={styles.btn}>Add Expense</button>
                    </form>
                </aside>

                {/* --- Table Section (Clean Data Show) --- */}
                <main style={styles.tableSection}>
                    <h3>Recent History</h3>
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((exp) => (
                                    <tr key={exp._id}>
                                        <td>{exp.title}</td>
                                        <td><span style={styles.badge}>{exp.category}</span></td>
                                        <td style={{color: '#e11d48', fontWeight: 'bold'}}>-₹{exp.amount}</td>
                                        <td>{new Date(exp.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

// --- Unique Inline Styles (UX focused) ---
const styles = {
    container: { padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    totalCard: { backgroundColor: '#1e293b', color: 'white', padding: '15px 30px', borderRadius: '12px', textAlign: 'right' },
    mainLayout: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' },
    formContainer: { backgroundColor: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
    form: { display: 'flex', flexDirection: 'column', gap: '12px' },
    btn: { marginTop: '10px', padding: '12px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    tableSection: { backgroundColor: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    badge: { backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', color: '#64748b' },
};

export default TotalExpense;