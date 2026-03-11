import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ResidentForm() {
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // 1. Fetch Residents Logic
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const res = await axios.get("http://localhost:5100/api/residents");
        setUser(res.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchResidents();
  }, []);

  // 2. REGISTER & UPDATE Logic
  const onSubmit = async (data) => {
  try {
   
    const cleanData = { ...data };
    
    if (cleanData.idProofType === "") delete cleanData.idProofType;
    if (cleanData.status === "") delete cleanData.status;
    if (cleanData.gender === "") delete cleanData.gender;
    if (cleanData.residentType === "") delete cleanData.residentType;

    if (editId) {
      // UPDATE Logic
      const { _id, __v, ...updateData } = cleanData;
      const res = await axios.put(`http://localhost:5100/api/residents/${editId}`, updateData);
      setUser(user.map((u) => (u._id === editId ? res.data : u)));
      alert("Resident Updated Successfully");
    } else {
      // CREATE Logic
      const res = await axios.post("http://localhost:5100/api/residents", cleanData);
      setUser([...user, res.data]);
      alert("Resident Added Successfully");
    }
    closeForm();
  } catch (error) {
    console.error("Submission Error:", error.response?.data || error.message);
   
    const serverMessage = error.response?.data?.message || "Internal Server Error";
    alert("Error: " + serverMessage);
  }
};
  // 3. DELETE Logic
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resident?")) return;
    try {
      await axios.delete(`http://localhost:5100/api/residents/${id}`);
      setUser(user.filter((u) => u._id !== id));
    } catch (error) {
      console.log(error);
      alert("Error deleting resident");
    }
  };

  // 4. EDIT Helper
  const handleEdit = (resident) => {
  setEditId(resident._id);
  reset(resident); 
  setShowForm(true);
};

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    reset({});
  };

  const filteredUsers = user.filter((u) => {
    const searchStr = searchQuery.toLowerCase();
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    return (
      fullName.includes(searchStr) ||
      u.flatNumber?.toLowerCase().includes(searchStr) ||
      u.mobileNumber?.includes(searchStr)
    );
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      
      {/* ---------------- Header Area (Unchanged) ---------------- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-5 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-800">Resident Management</h1>
        <div className="flex w-full md:w-auto gap-4">
          <input
            type="text"
            placeholder="Search by Name, Flat, or Mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
          {!showForm && (
            <button
              onClick={() => { reset({}); setShowForm(true); }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg shadow-sm whitespace-nowrap"
            >
              + Add Resident
            </button>
          )}
        </div>
      </div>

      {/* ---------------- Form Area (Your Original Design) ---------------- */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-10 bg-gray-50 p-1">
          
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {editId ? "Update Resident Details" : "Add New Resident"}
            </h2>
          </div>

          {/* Personal Info */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-5 text-blue-600 border-b pb-2">Personal Information</h2>
            <div className="grid md:grid-cols-3 gap-5">
              <Input label="First Name" required error={errors.firstName} register={register("firstName", { required: "First name required" })} />
              <Input label="Last Name" register={register("lastName")} />
              <Select label="Gender" required error={errors.gender} register={register("gender", { required: "Select gender" })} options={["Male", "Female", "Other"]} />
              <Input type="date" label="Date Of Birth" register={register("dateOfBirth")} />
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-5 text-blue-600 border-b pb-2">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <Input label="Mobile Number" required error={errors.mobileNumber} register={register("mobileNumber", { required: "Mobile required", pattern: { value: /^[0-9]{10}$/, message: "Enter valid 10 digit number" } })} />
              <Input label="Email" error={errors.email} register={register("email", { pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} />
            </div>
          </div>

          {/* Flat Details */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-5 text-blue-600 border-b pb-2">Flat Details</h2>
            <div className="grid md:grid-cols-3 gap-5">
              <Input label="Wing" required error={errors.wing} register={register("wing", { required: "Wing required" })} />
              <Input label="Flat Number" required error={errors.flatNumber} register={register("flatNumber", { required: "Flat number required" })} />
              <Input type="number" label="Floor Number" register={register("floorNumber")} />
            </div>
          </div>

          {/* Resident Details */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-5 text-blue-600 border-b pb-2">Resident Details</h2>
            <div className="grid md:grid-cols-3 gap-5">
              <Select label="Resident Type" required error={errors.residentType} register={register("residentType", { required: "Required" })} options={["Owner", "Tenant", "Family"]} />
              <Input type="date" label="Move In Date" register={register("moveInDate")} />
              <Input type="date" label="Move Out Date" register={register("moveOutDate")} />
            </div>
          </div>

          {/* Identity & Vehicle */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 hover:shadow-md transition">
              <h2 className="text-lg font-semibold mb-5 text-blue-600 border-b pb-2">Identity Details</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <Select label="ID Proof Type" register={register("idProofType")} options={["Aadhaar", "PAN", "Driving License", "Passport"]} />
                <Input label="ID Proof Number" register={register("idProofNumber")} />
              </div>
            </div>
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 hover:shadow-md transition">
              <h2 className="text-lg font-semibold mb-5 text-blue-600 border-b pb-2">Vehicle Details</h2>
              <Input label="Vehicle Number" register={register("vehicleNumber")} />
            </div>
          </div>

          {/* Emergency & Status */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 hover:shadow-md transition">
              <h2 className="text-lg font-semibold mb-5 text-blue-600 border-b pb-2">Emergency Contact</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <Input label="Name" register={register("emergencyContactName")} />
                <Input label="Number" error={errors.emergencyContactNumber} register={register("emergencyContactNumber", { pattern: { value: /^[0-9]{10}$/, message: "Enter valid number" } })} />
              </div>
            </div>
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 hover:shadow-md transition">
              <h2 className="text-lg font-semibold mb-5 text-blue-600 border-b pb-2">Status</h2>
              <Select label="Status" register={register("status")} options={["Active", "Inactive"]} />
            </div>
          </div>

          <div className="flex justify-end gap-4 bg-white p-5 rounded-xl border shadow-sm">
            <button type="button" onClick={closeForm} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm">
              {editId ? "Update Resident" : "Save Resident"}
            </button>
          </div>
        </form>
      )}

      {/* ---------------- Table Area (Unchanged) ---------------- */}
      {!showForm && (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 font-semibold border-b">
                  <tr className="whitespace-nowrap">
                    
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Wing-Flat</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-blue-50/50 transition whitespace-nowrap">
                      
                      <td className="px-4 py-3 font-medium text-gray-900">{u.firstName} {u.lastName}</td>
                      <td className="px-4 py-3"><span className="bg-gray-100 px-2 py-1 rounded font-mono">{u.wing} - {u.flatNumber}</span></td>
                      <td className="px-4 py-3">{u.residentType}</td>
                      <td className="px-4 py-3">{u.mobileNumber}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {u.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button onClick={() => handleEdit(u)} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition text-xs font-semibold">Edit</button>
                        <button onClick={() => handleDelete(u._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs font-semibold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-500">No residents found.</div>
          )}
        </div>
      )}
    </div>
  );
}

// Reusable Components (Design untouched)
function Input({ label, register, error, required, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <input type={type} {...register} className={`w-full border rounded-lg px-3 py-2 outline-none transition shadow-sm ${error ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"}`} />
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error.message}</p>}
    </div>
  );
}

function Select({ label, register, options, error, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <select {...register} className={`w-full border rounded-lg px-3 py-2 outline-none transition shadow-sm bg-white ${error ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"}`}>
        <option value="">Select...</option>
        {options.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error.message}</p>}
    </div>
  );
}