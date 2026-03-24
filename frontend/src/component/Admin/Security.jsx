import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Security() {
  const { register, handleSubmit,   watch, formState: { errors }, reset } = useForm();
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
    } catch (err){
      alert("Error deleting record.");
      console.error(err);
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
        <div className="flex flex-col md:flex-vrow justify-between items-center mb-8 gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
          {/* Row 1: Names & Mobile */}
          <div className="grid md:grid-cols-4 gap-4">
            <FormInput 
              label="First Name *" 
              register={register("firstName", { 
                required: "First name is required",
                pattern: { value: /^[A-Za-z\s]+$/, message: "only alphabets allowed" }
              })} 
              error={errors.firstName} 
            />
            <FormInput 
              label="Last Name" 
              register={register("lastName", {
                pattern: { value: /^[A-Za-z\s]+$/, message: "only alphabets allowed" }
              })} 
              error={errors.lastName}
            />
            <FormInput 
              label="Mobile *" 
              register={register("mobile", { 
                required: "Mobile number is required",
                pattern: { value: /^[0-9]{10}$/, message: "Enter valid 10 digits and only numbers" }
              })} 
              error={errors.mobile} 
            />
            <FormInput 
              label="Alt Mobile" 
              register={register("altMobile", {
                pattern: { value: /^[0-9]{10}$/, message: "Enter valid 10 digits and only numbers" }
              })} 
              error={errors.altMobile}
            />
          </div>

          {/* Row 2: Email, Strong Password, Joining Date */}
          <div className="grid md:grid-cols-3 gap-4">
            <FormInput 
              label="Email" 
              type="email" 
              register={register("email", {
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
              })} 
              error={errors.email}
            />
            <FormInput 
              label="Password *" 
              type="password" 
              register={register("password", { 
                required: editingId ? false : "Password is required",
                minLength: { value: 6, message: "Min 6 characters required" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                  message: "Must include: A, a, 1, @$!"
                }
              })} 
              placeholder={editingId ? "Leave blank to keep current" : "*******"} 
              error={errors.password} 
            />
            
              <FormInput 
                label="Confirm Password"
                type="password" 
                register={register("confirmPassword", { 
                  required: "Please confirm your password",
                  validate: (value) => value === watch("password") || "Passwords do not match"
                })} 
                error={errors.confirmPassword} 
              />
            

            <FormInput 
              label="Joining Date" 
              type="date" 
              register={register("joiningDate", { required: "Joining date is required" })} 
              error={errors.joiningDate}
            />
          </div>

          {/* Row 3: Address Details */}
          <div className="grid md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl">
            <FormInput label="City" register={register("city", { required: "City required" })} error={errors.city} />
            <FormInput label="State" register={register("state", { required: "State required" })} error={errors.state} />
            <FormInput 
              label="Pincode" 
              register={register("pincode", {
                required: "Pincode required",
                pattern: { value: /^[0-9]{6}$/, message: "Enter 6 digit pincode" }
              })} 
              error={errors.pincode}
            />
            <FormInput label="Address" register={register("address", { required: "Address required" , message: "Address is required" })} error={errors.address} />
          </div>

          {/* Row 4: ID Type, ID Number, Shift, Status */}
          <div className="grid md:grid-cols-4 gap-4 bg-blue-50/50 p-4 rounded-xl">
            <div className="grid md:grid-cols-2 gap-6 bg-blue-50/30 p-5 rounded-2xl border border-blue-100">
  
        {/* ID Type: Defaulted & Fixed */}
        <div>
          <Select
              label="ID Proof Type"
              register={register("idProofType", { required: "Aadhaar Card is mandatory" })}
              error={errors.idProofType}
              options={["Aadhaar"]} 
              />
          
        </div>

          {/* File Upload UI with PDF/JPG & 30KB Validation */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
              Upload Aadhaar (JPG/PDF, Max 30KB) *
            </label>
            
            <div className={`relative border-2 border-dashed rounded-xl p-3 transition-all ${errors.idFile ? 'border-red-400 bg-red-50' : 'border-blue-200 bg-white hover:border-blue-400'}`}>
              <input 
                type="file" 
                accept="image/jpeg, application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                {...register("idFile", {
                  required: editingId ? false : "Aadhaar file is mandatory",
                  validate: {
                    lessThan30KB: (files) => {
                      if (!files[0]) return true;
                      return files[0].size <= 30 * 1024 || `Too large (${(files[0].size / 1024).toFixed(1)} KB). Max 30KB limit.`;
                    },
                    acceptedFormats: (files) => {
                      if (!files[0]) return true;
                      const allowed = ['image/jpeg', 'image/jpg', 'application/pdf'];
                      return allowed.includes(files[0].type) || "Only JPEG or PDF allowed";
                    }
                  }
                })}
              />
              
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">Click to upload file</p>
                  <p className="text-[10px] text-gray-400 font-medium italic">JPEG or PDF only (Max: 30KB)</p>
                </div>
              </div>
            </div>

            {/* Error Message Display */}
            {errors.idFile && (
              <p className="text-red-500 text-[11px] mt-1.5 font-bold flex items-center gap-1">
                <span className="bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]">!</span>
                {errors.idFile.message}
              </p>
            )}
          </div>
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

         
          

          {/* Row 6: Emergency Contacts */}
          <div className="grid md:grid-cols-2 gap-4">
            <FormInput 
              label="Emergency Contact Name" 
              register={register("emergencyName", { required: "Emergency name required" })} 
              error={errors.emergencyName}
            />
            <FormInput 
              label="Emergency Mobile" 
              register={register("emergencyMobile", { 
                required: "Emergency mobile required",
                pattern: { value: /^[0-9]{10}$/, message: "10 digits required" }
              })} 
              error={errors.emergencyMobile}
            />
          </div>

          {/* Form Buttons */}
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