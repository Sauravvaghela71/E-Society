import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import FlatDetails from "./FlatDetails";

export default function ResidentForm() {
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState([]);
  const [flats, setFlats] = useState([]);
  const [showFlatMap, setShowFlatMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedResident, setSelectedResident] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
      watch,
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
    } catch (err) {console.error("Error fetching users:", err);}
  };

  const fetchFlats = async () => {
    try {
      const res = await axios.get("http://localhost:5100/api/flats");
      setFlats(res.data.data || []);
    } catch (err) {console.error("Error fetching flats:", err);}
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

  // 3b. STATUS TOGGLE LOGIC
  const handleStatusToggle = async (resident) => {
    // Default to Active if not set, then toggle
    const currentStatus = resident.status || "Active";
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      await axios.put(`http://localhost:5100/api/residents/${resident._id}`, { status: newStatus }, config);
      setUser((prev) => prev.map((u) => (u._id === resident._id ? { ...u, status: newStatus } : u)));
    } catch (error) {
      console.error("Status update error:", error);
      alert("Error updating status");
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-800 p-8 rounded-3xl shadow-xl border-none relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-blue-400 opacity-10 rounded-full blur-2xl translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white tracking-tight">Resident Management</h1>
          <p className="text-blue-200 mt-1 text-sm font-medium">Manage society residents, flats, and access levels</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4 relative z-10">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-blue-200">🔍</span>
            <input
              type="text"
              placeholder="Search by Name, Flat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-blue-200 rounded-2xl focus:ring-2 focus:ring-white/50 focus:bg-white/20 outline-none backdrop-blur-md transition-all shadow-inner"
            />
          </div>
          {!showForm && (
            <button
              onClick={() => { reset({}); setShowForm(true); }}
              className="px-6 py-3 bg-white text-indigo-900 hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all font-bold rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.3)] whitespace-nowrap flex items-center gap-2"
            >
              <span className="text-lg">+</span> Add Resident
            </button>
          )}
        </div>
      </div>

    {/* Form Area */}
    {showForm && (
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-indigo-50/50 relative z-10">
          <h2 className="text-2xl font-black text-indigo-900 tracking-tight flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm shadow-md">
              {editId ? "✏️" : "🏠"}
            </span>
            {editId ? "Update Resident Details" : "Add New Resident"}
          </h2>
          <button 
            onClick={closeForm} 
            className="w-10 h-10 bg-white hover:bg-red-50 rounded-full border border-gray-100 hover:border-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center text-xl transition-all shadow-sm"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
          {/* Personal Info */}
          <div className="bg-gradient-to-tr from-indigo-50/50 to-blue-50/30 p-6 rounded-2xl border border-indigo-50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-40 rounded-full blur-2xl pointer-events-none"></div>
            <h2 className="text-[11px] font-black tracking-widest text-indigo-900/40 uppercase mb-5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400"></span> Personal Information</h2>
      <div className="grid md:grid-cols-3 gap-5">
        <Input 
          label="First Name" 
          required 
          error={errors.firstName} 
          register={register("firstName", { 
            required: "First name is required",
            pattern: { value: /^[A-Za-z\s]+$/, message: "Numbers are not allowed in name" }
          })} 
        />
        <Input 
          label="Last Name" 
          error={errors.lastName}
          register={register("lastName", { 
            pattern: { value: /^[A-Za-z\s]+$/, message: "Numbers are not allowed in name" }
          })} 
        />
        <Select 
          label="Gender" 
          required 
          error={errors.gender} 
          register={register("gender", { required: "Please select gender" })} 
          options={["Male", "Female", "Other"]} 
        />
        <Input 
          type="date" 
          label="Date Of Birth" 
          error={errors.dateOfBirth}
          register={register("dateOfBirth", { required: "Date of birth is required" })} 
        />
      </div>
    </div>

    {/* Contact Info */}
    <div className="bg-gradient-to-tr from-indigo-50/50 to-blue-50/30 p-6 rounded-2xl border border-indigo-50 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-40 rounded-full blur-2xl pointer-events-none"></div>
      <h2 className="text-[11px] font-black tracking-widest text-indigo-900/40 uppercase mb-5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400"></span> Contact Information</h2>
      <div className="grid md:grid-cols-2 gap-5">
        <Input 
          label="Mobile Number" 
          required 
          error={errors.mobileNumber} 
          register={register("mobileNumber", { 
            required: "Mobile number is required", 
            pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" } 
          })} 
        />
        <Input 
          label="Email" 
          error={errors.email} 
          register={register("email", { 
            required: "Email is required", 
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } 
          })} 
        />

        {/* Password field only for New Registration */}
        {!editId && (
          <>
            <Input 
              label="Password" 
              type="password" 
              required 
              error={errors.password} 
              register={register("password", { 
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters required" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: "Must include Uppercase, Lowercase, Number and Special Character"
                }
              })} 
            />
            {/* Adding Confirm Password field as requested in previous turn for complete verification */}
            <Input 
              label="Confirm Password" 
              type="password" 
              required 
              error={errors.confirmPassword} 
              register={register("confirmPassword", { 
                required: "Please confirm your password",
                validate: (val) => val === watch('password') || "Passwords do not match"
              })} 
            />
          </>
        )}
      </div>
    </div>

    {/* Flat Details */}
    <div className="bg-gradient-to-tr from-indigo-50/50 to-blue-50/30 p-6 rounded-2xl border border-indigo-50 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-40 rounded-full blur-2xl pointer-events-none"></div>
      <div className="flex justify-between items-center mb-5 pb-2">
         <h2 className="text-[11px] font-black tracking-widest text-indigo-900/40 uppercase items-center gap-2 flex m-0"><span className="w-2 h-2 rounded-full bg-indigo-400"></span> Flat Details</h2>
         <button 
           type="button" 
           onClick={() => setShowFlatMap(true)}
           className="bg-indigo-600 animate-pulse text-white font-black tracking-wide px-5 py-2 rounded-xl text-xs hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-md z-10"
         >
           View & Select Flat Map
         </button>
      </div>
      
      <div className="grid md:grid-cols-4 gap-5">
        <Input 
          label="Wing" 
          required 
          error={errors.wing} 
          register={register("wing", { required: "Please select wing from map" })} 
          readOnly={true} 
          onClick={() => setShowFlatMap(true)} 
          placeholder="Click Map" 
        />
        <Input 
          label="Flat Number" 
          required 
          error={errors.flatNumber} 
          register={register("flatNumber", { required: "Please select flat from map" })} 
          readOnly={true} 
          onClick={() => setShowFlatMap(true)} 
          placeholder="Click Map" 
        />
        <Input 
          type="number" 
          label="Floor" 
          error={errors.floor}
          register={register("floor", { required: "Please select floor from map" })} 
          readOnly={true} 
          onClick={() => setShowFlatMap(true)} 
          placeholder="Click Map" 
        />
        
      </div>
    </div>

    {/* Resident Details */}
    <div className="bg-gradient-to-tr from-indigo-50/50 to-blue-50/30 p-6 rounded-2xl border border-indigo-50 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-40 rounded-full blur-2xl pointer-events-none"></div>
      <h2 className="text-[11px] font-black tracking-widest text-indigo-900/40 uppercase mb-5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400"></span> Resident Details</h2>
      <div className="grid md:grid-cols-3 gap-5">
        <Select 
          label="Resident Type" 
          required 
          error={errors.residentType} 
          register={register("residentType", { required: "Resident type is required" })} 
          options={["Owner", "Tenant", "Family"]} 
        />
        <Input 
          type="date" 
          label="Move In Date" 
          error={errors.moveInDate}
          register={register("moveInDate", { required: "Move in date is required" })} 
        />
        <Input 
          type="date" 
          label="Move Out Date" 
          register={register("moveOutDate")} 
        />
      </div>
    </div>

    {/* Identity & Vehicle */}
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-tr from-indigo-50/50 to-blue-50/30 p-6 rounded-2xl border border-indigo-50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-40 rounded-full blur-2xl pointer-events-none"></div>
        <h2 className="text-[11px] font-black tracking-widest text-indigo-900/40 uppercase mb-5 flex items-center gap-2 relative z-10"><span className="w-2 h-2 rounded-full bg-indigo-400"></span> Identity Details</h2>
        <div className="grid md:grid-cols-1 gap-5">
              <Select
              label="ID Proof Type"
              register={register("idProofType", { required: "Aadhaar Card is mandatory" })}
              error={errors.idProofType}
              options={["Aadhaar"]} 
              />

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-600 uppercase">Upload ID Proof Photo</label>
            <div className="relative group">
  <div className={`w-full h-48 rounded-xl border-2 border-dashed overflow-hidden bg-gray-50 flex items-center justify-center transition-colors ${errors.idProof ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
    
    {/* Preview Logic for Image vs PDF */}
    {preview || user.idProof ? (
      // Agar file image hai toh image dikhao, agar PDF hai toh text dikhao
      (preview?.startsWith("data:image") || user.idProof?.endsWith(".jpg") || user.idProof?.endsWith(".jpeg")) ? (
        <img src={preview || user.idProof} alt="ID Proof Preview" className="w-full h-full object-contain" />
      ) : (
        <div className="text-center">
          <div className="text-4xl mb-2">📄</div>
          <span className="text-gray-600 font-semibold text-sm">PDF Document Selected</span>
        </div>
      )
    ) : (
      <div className="text-center">
        <span className="text-gray-400 text-sm block">No file selected</span>
        <span className="text-blue-500 text-xs font-semibold">Upload Aadhaar (JPEG/PDF - Max 30KB)</span>
      </div>
    )}
  </div>

    <input
      type="file"
      // 
      accept="image/jpeg, application/pdf"
      className="absolute inset-0 opacity-0 cursor-pointer"
      {...register("idProof", { 
      required: editId ? false : "Aadhaar file is required",
      validate: {
        // Size validation: 30KB limit
        lessThan30KB: (files) => {
          if (!files[0]) return true; 
          const fileSize = files[0]?.size;
          const maxSize = 30 * 1024; 
          return fileSize <= maxSize || `File is too large (${(fileSize/1024).toFixed(1)} KB). Max 30 KB allowed.`;
        },
        // Format validation: Only JPEG and PDF
        acceptedFormats: (files) => {
          if (!files[0]) return true;
          const allowedTypes = ['image/jpeg', 'image/jpg', 'application/pdf'];
          return allowedTypes.includes(files[0]?.type) || "Only JPEG and PDF files are allowed";
        }
      }
              })} 
              onChange={(e) => {
                register("idProof").onChange(e);
               // Handle preview only for images, not for PDFs
                handleImageChange(e);
              }}
            />

            {/* Error Message Display */}
            {errors.idProof && (
              <p className="text-red-500 text-xs mt-1 font-bold">
                {errors.idProof.message}
              </p>
            )}
          </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-tr from-indigo-50/50 to-blue-50/30 p-6 rounded-2xl border border-indigo-50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-40 rounded-full blur-2xl pointer-events-none"></div>
        <h2 className="text-[11px] font-black tracking-widest text-indigo-900/40 uppercase mb-5 flex items-center gap-2 relative z-10"><span className="w-2 h-2 rounded-full bg-indigo-400"></span> Vehicle Details</h2>
        <Input 
          label="Vehicle Number" 
          error={errors.vehicleNumber}
          register={register("vehicleNumber", {
            pattern: { value: /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/, message: "Invalid format (Ex: MH01AB1234)" }
          })} 
        />
      </div>
    </div>

    {/* Emergency & Status */}
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-tr from-indigo-50/50 to-blue-50/30 p-6 rounded-2xl border border-indigo-50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-40 rounded-full blur-2xl pointer-events-none"></div>
        <h2 className="text-[11px] font-black tracking-widest text-indigo-900/40 uppercase mb-5 flex items-center gap-2 relative z-10"><span className="w-2 h-2 rounded-full bg-indigo-400"></span> Emergency Contact</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <Input 
            label="Name" 
            error={errors.emergencyContactName}
            register={register("emergencyContactName", { 
              required: "Emergency contact name required",
              pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters allowed" }
            })} 
          />
          <Input 
            label="Number" 
            error={errors.emergencyContactNumber} 
            register={register("emergencyContactNumber", { 
              required: "Emergency number required", 
              pattern: { value: /^[0-9]{10}$/, message: "Enter 10 digits" } 
            })} 
          />
        </div>
      </div>
      <div className="bg-gradient-to-tr from-indigo-50/50 to-blue-50/30 p-6 rounded-2xl border border-indigo-50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-40 rounded-full blur-2xl pointer-events-none"></div>
        <h2 className="text-[11px] font-black tracking-widest text-indigo-900/40 uppercase mb-5 flex items-center gap-2 relative z-10"><span className="w-2 h-2 rounded-full bg-indigo-400"></span> Status</h2>
        <Select 
          label="Status" 
          error={errors.status}
          register={register("status", { required: "Select status" })} 
          options={["Active", "Inactive"]} 
        />
      </div>
    </div>

    <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 mt-8 relative z-10">
      <button type="button" onClick={closeForm} className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 px-8 py-3 rounded-xl font-bold transition-all shadow-sm">
        Cancel
      </button>
      <button type="submit" className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-10 py-3 rounded-xl font-black shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] transition-all hover:-translate-y-0.5 active:translate-y-0">
        {editId ? "Update Resident" : "Save Resident"}
      </button>
    </div>
  </form>
  </div>
    )}

      {/* Table Area */}
      {!showForm && (
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-indigo-50/80 text-indigo-900 font-extrabold uppercase tracking-wider text-[11px] border-b border-indigo-100">
                  <tr className="whitespace-nowrap">
                    <th className="px-6 py-4 rounded-tl-3xl">#</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Wing-Flat</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Mobile</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 rounded-tr-3xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/50">
                  {filteredUsers.map((u, idx) => (
                    <tr key={u._id} className="hover:bg-indigo-50/40 transition-colors whitespace-nowrap group">
                      <td className="px-6 py-4 text-gray-400 text-xs font-black">{idx + 1}</td>
                      <td className="px-6 py-4 font-bold text-gray-800 flex items-center gap-3 border-none">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-400 text-white flex items-center justify-center text-xs shadow-md">
                          {u.firstName ? u.firstName.charAt(0) : 'U'}{u.lastName ? u.lastName.charAt(0) : ''}
                        </div>
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-white border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl font-black text-xs shadow-sm inline-block min-w-[70px] text-center">
                          {u.wing} - {u.flatNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${u.residentType === 'Owner' ? 'bg-amber-100 text-amber-700' : 'bg-cyan-100 text-cyan-700'}`}>
                          {u.residentType}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-600">{u.mobileNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleStatusToggle(u)}
                            className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!u.status || u.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${!u.status || u.status === 'Active' ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                          </button>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${!u.status || u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {!u.status || u.status === 'Active' ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 items-center opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setSelectedResident(u)}
                            className="bg-white border border-indigo-100 px-3 py-1.5 text-indigo-600 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-all text-xs font-bold shadow-sm"
                          >View</button>
                          <button onClick={() => handleEdit(u)} className="bg-white border border-yellow-100 px-3 py-1.5 text-yellow-600 rounded-lg hover:bg-yellow-50 hover:border-yellow-200 transition-all text-xs font-bold shadow-sm">Edit</button>
                          <button onClick={() => handleDelete(u._id)} className="bg-white border border-red-100 px-3 py-1.5 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all text-xs font-bold shadow-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">📭</div>
              <h3 className="text-xl font-bold text-gray-800">No Residents Found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or add a new resident.</p>
            </div>
          )}
        </div>
      )}

      {/* Flat Map Modal Popup */}
      {showFlatMap && (
        <FlatMapModal
          flats={flats}
          currentResidentId={editId}
          onClose={() => setShowFlatMap(false)}
          onSelect={(flat) => {
            setValue("wing", flat.wing);
            setValue("flatNumber", flat.flatNumber);
            setValue("floor", flat.floor);
            setShowFlatMap(false);
          }}
        />
      )}

      {/* Flat Details Drawer */}
      {selectedResident && (
        <FlatDetails
          resident={selectedResident}
          onClose={() => setSelectedResident(null)}
        />
      )}

    </div>
  );
}

// Flat Map Component
function FlatMapModal({ flats, onClose, onSelect, currentResidentId }) {
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
                  const isOwnedByCurrent = currentResidentId && flat.residentId && (flat.residentId._id === currentResidentId || flat.residentId === currentResidentId);
                  const isSelectable = isVacant || isOwnedByCurrent;

                  return (
                    <div 
                      key={flat._id} 
                      onClick={() => isSelectable && onSelect(flat)}
                      className={`relative p-4 rounded-xl border-2 transition-all group ${
                        isOwnedByCurrent 
                        ? 'border-indigo-400 bg-indigo-50 cursor-pointer hover:bg-indigo-500 hover:border-indigo-600'
                        : isVacant 
                        ? 'border-green-400 bg-green-50 cursor-pointer hover:bg-green-500 hover:border-green-600' 
                        : 'border-slate-200 bg-slate-100 cursor-not-allowed opacity-75 hover:opacity-100 hover:border-slate-300'
                      }`}
                    >
                      <span className={`block text-lg font-black ${isOwnedByCurrent ? 'text-indigo-700 group-hover:text-white' : isVacant ? 'text-green-700 group-hover:text-white' : 'text-slate-500'}`}>
                        {flat.flatNumber}
                      </span>
                      <span className={`mt-1 inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        isOwnedByCurrent 
                        ? 'bg-indigo-200 text-indigo-800 group-hover:bg-indigo-400 group-hover:text-white' 
                        : isVacant 
                        ? 'bg-green-200 text-green-800 group-hover:bg-green-400 group-hover:text-white' 
                        : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isOwnedByCurrent ? "Current Flat" : flat.status}
                      </span>
                      
                      {!isSelectable && flat.residentId && (
                        <p className="text-[9px] font-bold text-slate-500 uppercase mt-2 border-t border-slate-200 pt-1 truncate">
                          🔒 {flat.residentId.firstName || "Booked"}
                        </p>
                      )}
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
    <div onClick={onClick} className={readOnly ? 'cursor-pointer' : ''}>
      <label className="block text-[11px] font-black tracking-widest text-indigo-900/60 uppercase mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
      <input
        type={type}
        {...register}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full border-2 p-3 font-semibold text-gray-800 rounded-xl outline-none transition-all shadow-sm focus:bg-white ${
          readOnly ? "bg-gray-50/50 cursor-pointer border-dashed border-indigo-200 hover:bg-indigo-50/50 hover:border-indigo-400" : "bg-white/50 backdrop-blur-sm"
        } ${
          error ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : !readOnly ? "border-gray-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 hover:border-gray-200" : ""
        }`}
      />
      {error && <p className="text-red-500 text-[11px] mt-1.5 font-bold flex items-center gap-1"><span className="bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]">!</span>{error.message}</p>}
    </div>
  );
}

// Reusable Select Component
function Select({ label, register, options, error, required }) {
  return (
    <div>
      <label className="block text-[11px] font-black tracking-widest text-indigo-900/60 uppercase mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
      <select
        {...register}
        className={`w-full border-2 p-3 font-semibold text-gray-800 rounded-xl outline-none transition-all shadow-sm bg-white/50 backdrop-blur-sm focus:bg-white ${error ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 hover:border-gray-200"}`}
      >
        <option value="">Select...</option>
        {options.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      {error && <p className="text-red-500 text-[11px] mt-1.5 font-bold flex items-center gap-1"><span className="bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]">!</span>{error.message}</p>}
    </div>
  );
}