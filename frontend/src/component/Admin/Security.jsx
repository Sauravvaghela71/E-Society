import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Security() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [guards, setGuards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  // --- FETCH DATA ---
  const fetchGuards = async () => {
    try {
      const res = await axios.get("http://localhost:5100/api/security");
      setGuards(res.data);
    } catch (err) {
      console.error("Failed to fetch guards:", err);
    }
  };

  useEffect(() => {
    fetchGuards();
  }, []);

  // --- ADD / UPDATE ---
  const onSubmit = async (data) => {
    try {
      if (editingId) {
        const res = await axios.put(`http://localhost:5100/api/security/${editingId}`, data);
        setGuards(guards.map((g) => (g._id === editingId ? res.data : g)));
        alert("Security Guard Updated Successfully!");
      } else {
        const res = await axios.post("http://localhost:5100/api/security", data);
        setGuards([...guards, res.data]);
        alert("Security Guard Added Successfully!");
      }
      closeForm();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving record.");
    }
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5100/api/security/${id}`);
      setGuards(guards.filter((g) => g._id !== id));
    } catch (err) {
      alert("Error deleting record.");
    }
  };

  const handleEdit = (guard) => {
    setEditingId(guard._id);
    // Date format fix for input type="date"
    if(guard.joiningDate) guard.joiningDate = guard.joiningDate.split('T')[0];
    reset(guard);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    reset({});
  };

  const filteredGuards = guards.filter((g) => {
    const searchStr = searchQuery.toLowerCase();
    return (
      g.firstName?.toLowerCase().includes(searchStr) ||
      g.lastName?.toLowerCase().includes(searchStr) ||
      g.mobile?.includes(searchStr) ||
      g.city?.toLowerCase().includes(searchStr)
    );
  });

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900">Security Management</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and monitor all security personnel</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search guard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all">
                + Add Guard
              </button>
            )}
          </div>
        </div>

        {/* FORM SECTION - Only shows when showForm is true */}
        {showForm && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 mb-10 transition-all">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-3">
                {editingId ? "Update Guard Details" : "Register New Guard"}
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-red-500 text-3xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Row 1: Basic Info */}
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">First Name *</label>
                  <input {...register("firstName", { required: "Required" })} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Last Name</label>
                  <input {...register("lastName")} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Mobile *</label>
                  <input {...register("mobile", { required: "Required" })} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Alt Mobile</label>
                  <input {...register("altMobile")} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none" />
                </div>
              </div>

              {/* Row 2: Auth & Contact */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email</label>
                  <input type="email" {...register("email")} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Password *</label>
                  <input type="password" {...register("password", { required: !editingId })} placeholder={editingId ? "Leave blank to keep same" : "*******"} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Joining Date</label>
                  <input type="date" {...register("joiningDate")} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none" />
                </div>
              </div>

              {/* Row 3: Location */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">City</label>
                  <input {...register("city")} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">State</label>
                  <input {...register("state")} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Pincode</label>
                  <input {...register("pincode")} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Address</label>
                  <input {...register("address")} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none" />
                </div>
              </div>

              {/* Row 4: ID & Shift */}
              <div className="grid md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">ID Type (Aadhar/PAN)</label>
                  <input {...register("idType")} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">ID Number</label>
                  <input {...register("idNumber")} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Shift</label>
                  <select {...register("shift")} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none bg-white">
                    <option value="Day">Day</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Status</label>
                  <select {...register("status")} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none bg-white">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Emergency */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Emergency Contact Name</label>
                  <input {...register("emergencyName")} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Emergency Mobile</label>
                  <input {...register("emergencyMobile")} className="w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none" />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-lg font-bold shadow-lg transition-all">
                  {editingId ? "UPDATE GUARD" : "CONFIRM & SAVE"}
                </button>
                <button type="button" onClick={closeForm} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-10 py-3 rounded-lg font-bold transition-all">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TABLE SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="py-4 px-6 text-sm font-semibold uppercase">Guard Info</th>
                <th className="py-4 px-6 text-sm font-semibold uppercase">Location</th>
                <th className="py-4 px-6 text-sm font-semibold uppercase">Shift & Status</th>
                <th className="py-4 px-6 text-sm font-semibold uppercase">ID Details</th>
                <th className="py-4 px-6 text-sm font-semibold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGuards.map((g) => (
                <tr key={g._id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900">{g.firstName} {g.lastName}</div>
                    <div className="text-sm text-blue-600 font-medium">{g.mobile}</div>
                    <div className="text-xs text-gray-400">{g.email || "No email"}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium">{g.city}, {g.state}</div>
                    <div className="text-xs text-gray-500">{g.pincode}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold mr-2 ${g.shift === 'Day' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                      {g.shift}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${g.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {g.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-bold text-gray-700">{g.idType}</div>
                    <div className="text-xs text-gray-500">{g.idNumber}</div>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button onClick={() => handleEdit(g)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all font-bold">Edit</button>
                    <button onClick={() => handleDelete(g._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all font-bold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}