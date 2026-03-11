import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Security() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const [guards, setGuards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // New States for Search and Edit
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

  // --- ADD / UPDATE FORM SUBMIT ---
  const onSubmit = async (data) => {
    try {
      if (editingId) {
        // UPDATE EXISTING RECORD
        const res = await axios.put(`http://localhost:5100/api/security/${editingId}`, data);
        setGuards(guards.map((g) => (g._id === editingId ? res.data : g)));
        alert("Security Guard Updated Successfully!");
      } else {
        // ADD NEW RECORD
        const res = await axios.post("http://localhost:5100/api/security", data);
        setGuards([...guards, res.data]);
        alert("Security Guard Added Successfully!");
      }

      closeForm();
    } catch (err) {
      console.error(err);
      alert("Error saving record. Please try again.");
    }
  };

  // --- DELETE RECORD ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this security guard?")) return;
    
    try {
      await axios.delete(`http://localhost:5100/api/security/${id}`);
      setGuards(guards.filter((g) => g._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting record.");
    }
  };

  // --- EDIT RECORD HANDLER ---
  const handleEdit = (guard) => {
    setEditingId(guard._id); // Assuming your backend uses MongoDB _id
    reset(guard); // Auto-fills the form with the guard's data
    setShowForm(true);
  };

  // --- CLOSE & RESET FORM ---
  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    reset({}); // Clears the form
  };

  // --- SEARCH FILTER LOGIC ---
  const filteredGuards = guards.filter((g) => {
    const fullName = `${g.firstName} ${g.lastName}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      (g.mobile && g.mobile.includes(searchQuery)) ||
      (g.city && g.city.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* HEADER & CONTROLS */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Security Guards</h1>
        
        <div className="flex gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by name, mobile, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition-all"
          />
          
          {/* Add Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-all whitespace-nowrap"
            >
              + Add Guard
            </button>
          )}
        </div>
      </div>

      {/* FORM SECTION */}
      {showForm && (
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100 mb-10">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {editingId ? "Edit Security Guard" : "Add New Security Guard"}
            </h2>
            <button onClick={closeForm} className="text-gray-400 hover:text-red-500 font-bold text-xl">&times;</button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Input fields remain largely the same, but with modernized Tailwind styling */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input {...register("firstName", { required: "Required" })} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-red-500 text-xs mt-1">{errors.firstName?.message}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input {...register("lastName", { required: "Required" })} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-red-500 text-xs mt-1">{errors.lastName?.message}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
                <input {...register("mobile", { required: "Required", pattern: { value: /^[0-9]{10}$/, message: "10 digits required" } })} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-red-500 text-xs mt-1">{errors.mobile?.message}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input {...register("email", { pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input {...register("city", { required: "Required" })} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-red-500 text-xs mt-1">{errors.city?.message}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift *</label>
                <select {...register("shift", { required: "Required" })} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Select Shift</option>
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                </select>
                <p className="text-red-500 text-xs mt-1">{errors.shift?.message}</p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 pt-4 border-t">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                {editingId ? "Update Guard" : "Save Guard"}
              </button>
              <button type="button" onClick={closeForm} className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE SECTION */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">City</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Shift</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGuards.length > 0 ? (
                filteredGuards.map((g) => (
                  <tr key={g._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6 whitespace-nowrap">
                      <div className="font-medium text-gray-900 capitalize">{g.firstName} {g.lastName}</div>
                    </td>
                    <td className="py-3 px-6 whitespace-nowrap">
                      <div className="text-sm text-gray-800">{g.mobile}</div>
                      <div className="text-xs text-gray-500">{g.email}</div>
                    </td>
                    <td className="py-3 px-6 whitespace-nowrap text-sm text-gray-600 capitalize">
                      {g.city}
                    </td>
                    <td className="py-3 px-6 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${g.shift === 'Day' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        {g.shift}
                      </span>
                    </td>
                    <td className="py-3 px-6 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(g)} className="text-blue-600 hover:text-blue-900 mr-4 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(g._id)} className="text-red-500 hover:text-red-700 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No security guards found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}