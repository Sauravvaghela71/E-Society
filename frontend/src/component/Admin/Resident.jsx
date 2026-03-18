import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ResidentForm() {
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState([]);
  const [flats, setFlats] = useState([]);
  const [showFlatMap, setShowFlatMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  // 1. Initial Fetch
  useEffect(() => {
    fetchUsers();
    fetchFlats();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5100/api/residents");
      setUser(res.data.data || res.data || []);
    } catch (err) {}
  };

  const fetchFlats = async () => {
    try {
      const res = await axios.get("http://localhost:5100/api/flats");
      setFlats(res.data.data || []);
    } catch (err) {}
  };

  // 1b. Image Preview logic
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // 2. SUBMIT LOGIC (ADD & UPDATE FIXED)
  const onSubmit = async (data) => {
    try {
      // FIX: FormData Object banana padega image ke liye
      const formData = new FormData();

      // Saare text fields ko append karein
      Object.keys(data).forEach((key) => {
        // "idProof" aapki file input ka 'name' hona chahiye register() mein
        if (key !== "idProof") {
          if (data[key] !== "" && data[key] !== null) {
            formData.append(key, data[key]);
          }
        }
      });

      // File ko manually append karein (FileList se first file nikal kar)
      if (data.idProof && data.idProof[0]) {
        formData.append("idProof", data.idProof[0]);
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };

      if (editId) {
        // --- UPDATE LOGIC ---
        const res = await axios.put(`http://localhost:5100/api/residents/${editId}`, formData, config);
        const updatedObj = res.data.data || res.data;
        setUser((prev) => prev.map((u) => (u._id === editId ? updatedObj : u)));
        alert("Resident Updated Successfully!");
      } else {
        // --- CREATE LOGIC ---
        const res = await axios.post("http://localhost:5100/api/residents", formData, config);
        const newObj = res.data.data || res.data;
        setUser((prev) => [...prev, newObj]);
        alert("Resident Added Successfully!");
      }
      fetchFlats(); // REFRESH FLAT MAP immediately!
      closeForm();
    } catch (error) {
      console.error("Submission Error:", error.response?.data || error.message);
      alert("Error: " + (error.response?.data?.message || "Something went wrong"));
    }
  };

  // 3. DELETE LOGIC
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resident?")) return;
    try {
      await axios.delete(`http://localhost:5100/api/residents/${id}`);
      setUser((prev) => prev.filter((u) => u._id !== id));
      fetchFlats(); // REFRESH FLAT MAP
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting resident");
    }
  };

  // 4. EDIT HELPER (Mapping data to form)
  const handleEdit = (resident) => {
    setEditId(resident._id);

    const formattedResident = { ...resident };
    const dateFields = ["dateOfBirth", "moveInDate", "moveOutDate"];

    dateFields.forEach(field => {
      if (resident[field]) {
        formattedResident[field] = new Date(resident[field]).toISOString().split('T')[0];
      }
    });

    reset(formattedResident);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    reset({});
  };

  // 5. SEARCH LOGIC
  const filteredUsers = user.filter((u) => {
    const searchStr = searchQuery.toLowerCase();
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    return (
      fullName.includes(searchStr) ||
      u.flatNumber?.toLowerCase().includes(searchStr) ||
      u.mobileNumber?.includes(searchStr)
    );
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">

      {/* Header Area */}
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

      {/* Form Area */}
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
              <Input label="Email" error={errors.email} register={register("email", { required: "Email required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} />

              {/* Password field only for New Registration */}
              {!editId && (
                <Input label="Password" type="password" required error={errors.password} register={register("password", { required: "Password required" })} />
              )}
            </div>
          </div>

          {/* Flat Details */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex justify-between items-center mb-5 border-b pb-2">
               <h2 className="text-lg font-semibold text-blue-600">Flat Details</h2>
               <button 
                 type="button" 
                 onClick={() => setShowFlatMap(true)}
                 className="bg-indigo-600 animate-pulse text-white font-bold px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition"
               >
                 View & Select Flat Map
               </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-5">
              <Input label="Wing" required error={errors.wing} register={register("wing", { required: "Select from map" })} readOnly={true} onClick={() => setShowFlatMap(true)} placeholder="Click Map" />
              <Input label="Flat Number" required error={errors.flatNumber} register={register("flatNumber", { required: "Select from map" })} readOnly={true} onClick={() => setShowFlatMap(true)} placeholder="Click Map" />
              <Input type="number" label="Floor" register={register("floor", { required: "Select from map" })} readOnly={true} onClick={() => setShowFlatMap(true)} placeholder="Click Map" />
            </div>
          </div>

          {/* Resident Details */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-5 text-blue-600 border-b pb-2">Resident Details</h2>
            <div className="grid md:grid-cols-3 gap-5">
              <Select label="Resident Type" required error={errors.residentType} register={register("residentType", { required: "Required" })} options={["Owner", "Tenant", "Family"]} />
              <Input type="date" label="Move In Date" register={register("moveInDate", { required: "Move in date required" })} />
              <Input type="date" label="Move Out Date" register={register("moveOutDate")} />
            </div>
          </div>

          {/* Identity & Vehicle */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Identity Details */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 hover:shadow-md transition">
              <h2 className="text-lg font-semibold mb-5 text-blue-600 border-b pb-2">Identity Details</h2>
              <div className="grid md:grid-cols-1 gap-5">
                <Select
                  label="ID Proof Type"
                  register={register("idProofType")}
                  options={["Aadhaar", "PAN", "Voter ID"]}
                />

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-600 uppercase">Upload ID Proof Photo</label>
                  <div className="relative group">
                    <div className="w-full h-48 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                      {preview || user.idProof ? (
                        <img
                          src={preview || user.idProof}
                          alt="ID Proof Preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No image selected</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      {...register("idProof")} 
                      onChange={(e) => {
                        register("idProof").onChange(e);
                        handleImageChange(e);
                      }}
                    />

                    <div className="mt-2 text-center">
                      <span className="text-blue-600 text-sm font-semibold hover:underline">
                        Click to change photo
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
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
                <Input label="Name" register={register("emergencyContactName", { required: "Emergency contact name required" })} />
                <Input label="Number" error={errors.emergencyContactNumber} register={register("emergencyContactNumber", { required: "Emergency contact number required", pattern: { value: /^[0-9]{10}$/, message: "Enter valid number" } })} />
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

      {/* Table Area */}
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

      {/* Flat Map Modal Popup */}
      {showFlatMap && (
        <FlatMapModal 
          flats={flats} 
          onClose={() => setShowFlatMap(false)} 
          onSelect={(flat) => {
            setValue("wing", flat.wing);
            setValue("flatNumber", flat.flatNumber);
            setValue("floor", flat.floor);
            setShowFlatMap(false);
          }} 
        />
      )}

    </div>
  );
}

// Flat Map Component
function FlatMapModal({ flats, onClose, onSelect }) {
  const uniqueWings = [...new Set(flats.map(f => f.wing))].sort();
  const [activeWing, setActiveWing] = useState(uniqueWings[0] || "A");

  const wingFlats = flats.filter(f => f.wing === activeWing);
  const floors = [...new Set(wingFlats.map(f => f.floor))].sort((a,b) => b - a); // descending so top floor is top visually

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Society Flat Navigator</h2>
            <p className="text-gray-500 font-medium text-sm mt-1">Select an empty green (Vacant) flat to assign it to this resident.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all text-2xl leading-none">&times;</button>
        </div>

        {/* Tab Header (Wings) */}
        <div className="flex gap-2 p-6 bg-white border-b border-gray-100 overflow-x-auto">
          {uniqueWings.map(wing => (
            <button 
              key={wing}
              onClick={() => setActiveWing(wing)}
              className={`px-6 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${activeWing === wing ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Wing {wing}
            </button>
          ))}
        </div>

        {/* Body (Floors Grid) */}
        <div className="p-6 bg-slate-50 overflow-y-auto flex-1 space-y-8">
          {floors.map(floor => (
            <div key={floor} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Floor {floor}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {wingFlats.filter(f => f.floor === floor).sort((a,b) => a.flatNumber.localeCompare(b.flatNumber)).map(flat => {
                  const isVacant = flat.status === "Vacant";
                  return (
                    <div 
                      key={flat._id} 
                      onClick={() => isVacant && onSelect(flat)}
                      className={`relative p-4 rounded-xl border-2 transition-all group ${
                        isVacant 
                        ? 'border-green-400 bg-green-50 cursor-pointer hover:bg-green-500 hover:border-green-600' 
                        : 'border-slate-200 bg-slate-100 cursor-not-allowed opacity-75'
                      }`}
                    >
                      <span className={`block text-lg font-black ${isVacant ? 'text-green-700 group-hover:text-white' : 'text-slate-500'}`}>
                        {flat.flatNumber}
                      </span>
                      <span className={`mt-1 inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        isVacant 
                        ? 'bg-green-200 text-green-800 group-hover:bg-green-400 group-hover:text-white' 
                        : 'bg-slate-200 text-slate-500'
                      }`}>
                        {flat.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// Reusable Input Component
function Input({ label, register, error, required, type = "text", readOnly, onClick, placeholder }) {
  return (
    <div onClick={onClick}>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <input
        type={type}
        {...register}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2 outline-none transition shadow-sm ${
          error ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"
        } ${readOnly ? "bg-gray-100 cursor-pointer" : "bg-white"}`}
      />
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error.message}</p>}
    </div>
  );
}

// Reusable Select Component
function Select({ label, register, options, error, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <select
        {...register}
        className={`w-full border rounded-lg px-3 py-2 outline-none transition shadow-sm bg-white ${error ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-500"}`}
      >
        <option value="">Select...</option>
        {options.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error.message}</p>}
    </div>
  );
}