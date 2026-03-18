import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Security() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [guards, setGuards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  

  const fetchGuards = async () => {
    try {
      const res = await axios.get("http://localhost:5100/api/security");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setGuards(data);
    } catch (err) {
      console.error("Failed to fetch guards:", err);
    }
  };

  useEffect(() => {
    fetchGuards();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await axios.put(`${"http://localhost:5100/api/security"}/${editingId}`, data);
        alert("Security Guard Updated Successfully!");
      } else {
        await axios.post("http://localhost:5100/api/security", data);
        alert("Security Guard Added Successfully!");
      }
      fetchGuards(); 
      closeForm();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving record.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${"http://localhost:5100/api/security"}/${id}`);
      setGuards(guards.filter((g) => g._id !== id));
    } catch (err) {
      alert("Error deleting record.");
    }
  };

  const handleEdit = (guard) => {
    setEditingId(guard._id);
    const editData = { ...guard };
    
    if (editData.joiningDate) {
      editData.joiningDate = new Date(editData.joiningDate).toISOString().split('T')[0];
    }
    
    reset(editData);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    reset({});
  };

  const filteredGuards = guards.filter((g) => {
    const searchStr = searchQuery.toLowerCase();
    const fullName = `${g.firstName || ""} ${g.lastName || ""}`.toLowerCase();
    return (
      fullName.includes(searchStr) ||
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
            <p className="text-gray-500 text-sm mt-1">Personnel Directory</p>
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

        {/* FORM SECTION */}
        {showForm && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 mb-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-3">
                {editingId ? "Update Guard Details" : "Register New Guard"}
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-red-500 text-3xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <FormInput label="First Name *" register={register("firstName", { required: true })} error={errors.firstName} />
                <FormInput label="Last Name" register={register("lastName")} />
                <FormInput label="Mobile *" register={register("mobile", { required: true })} error={errors.mobile} />
                <FormInput label="Alt Mobile" register={register("altMobile")} />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <FormInput label="Email" type="email" register={register("email")} />
                <FormInput 
                  label="Password *" 
                  type="password" 
                  register={register("password", { required: !editingId })} 
                  placeholder={editingId ? "Leave blank to keep current" : "*******"} 
                  error={errors.password} 
                />
                <FormInput label="Joining Date" type="date" register={register("joiningDate")} />
              </div>

              <div className="grid md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl">
                <FormInput label="City" register={register("city")} />
                <FormInput label="State" register={register("state")} />
                <FormInput label="Pincode" register={register("pincode")} />
                <FormInput label="Address" register={register("address")} />
              </div>

              <div className="grid md:grid-cols-4 gap-4 bg-blue-50/50 p-4 rounded-xl">
                <FormInput label="ID Type" register={register("idType")} />
                <FormInput label="ID Number" register={register("idNumber")} />
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

              <div className="grid md:grid-cols-2 gap-4">
                <FormInput label="Emergency Contact Name" register={register("emergencyName")} />
                <FormInput label="Emergency Mobile" register={register("emergencyMobile")} />
              </div>

              <div className="flex gap-4 pt-6">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-lg font-bold shadow-lg transition-all">
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
                  </td>
                  <td className="py-4 px-6 text-sm font-medium">
                    {g.city}, {g.state}
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
                    <button onClick={() => handleEdit(g)} className="text-blue-600 hover:underline font-bold">Edit</button>
                    <button onClick={() => handleDelete(g._id)} className="text-red-500 hover:underline font-bold">Delete</button>
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

function FormInput({ label, type = "text", register, error, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{label}</label>
      <input 
        type={type} 
        {...register} 
        placeholder={placeholder}
        className={`w-full border p-2.5 rounded-lg focus:border-blue-500 outline-none ${error ? 'border-red-500' : 'border-gray-200'}`} 
      />
    </div>
  );
}