import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Security() {
  const { register, handleSubmit,   watch, formState: { errors }, reset } = useForm();
  const [guards, setGuards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  // OTP States
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    } else if (otpTimer === 0) {
      setIsOtpSent(false);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const sendOtp = async () => {
    const email = watch("email");
    if (!email) return alert("Please enter email first to send OTP");
    try {
      await axios.post("http://localhost:5100/api/otp/send-otp", { email });
      setIsOtpSent(true);
      setOtpTimer(90); // 1.30 minute
      alert("OTP sent to " + email);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    const email = watch("email");
    if (!otpValue) return alert("Please enter OTP");
    try {
      await axios.post("http://localhost:5100/api/otp/verify-otp", { email, otp: otpValue });
      setIsEmailVerified(true);
      setIsOtpSent(false); // Stop timer visually
      setOtpTimer(0);
      alert("Email verified successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid or expired OTP");
    }
  };

  

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
      if (!editingId && !isEmailVerified) {
        return alert("Please verify the email with OTP to complete registration.");
      }
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

  const handleStatusToggle = async (guard) => {
    const currentStatus = guard.status || "active";
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.put(`http://localhost:5100/api/security/${guard._id}`, { status: newStatus });
      setGuards((prev) => prev.map((g) => (g._id === guard._id ? { ...g, status: newStatus } : g)));
    } catch (error) {
      console.error("Status update error:", error);
      alert("Error updating status");
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
    setIsOtpSent(false);
    setOtpTimer(0);
    setIsEmailVerified(false);
    setOtpValue("");
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-800 p-8 rounded-3xl shadow-xl border-none relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-10 w-40 h-40 bg-blue-400 opacity-10 rounded-full blur-2xl translate-y-1/2 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-white tracking-tight">Security Management</h1>
            <p className="text-blue-200 text-sm mt-1 font-medium">Manage security personnel, shifts, and access</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto relative z-10">
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-blue-200">🔍</span>
              <input
                type="text"
                placeholder="Search guard..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-blue-200 rounded-2xl focus:ring-2 focus:ring-white/50 focus:bg-white/20 outline-none backdrop-blur-md transition-all shadow-inner"
              />
            </div>
            {!showForm && (
              <button 
                onClick={() => setShowForm(true)} 
                className="px-6 py-3 bg-white text-indigo-900 hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all font-bold rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.3)] whitespace-nowrap flex items-center gap-2"
              >
                <span className="text-lg">+</span> Add Guard
              </button>
            )}
          </div>
        </div>

        {/* FORM SECTION */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-indigo-50/50 relative z-10">
              <h2 className="text-2xl font-black text-indigo-900 tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm shadow-md">
                  {editingId ? "✏️" : "🛡️"}
                </span>
                {editingId ? "Update Guard Details" : "Register New Guard"}
              </h2>
              <button 
                onClick={closeForm} 
                className="w-10 h-10 bg-white hover:bg-red-50 rounded-full border border-gray-100 hover:border-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center text-xl transition-all shadow-sm"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
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
            <div className="relative">
              <FormInput 
                label="Email *" 
                type="email" 
                register={register("email", {
                  required: editingId ? false : "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                })} 
                error={errors.email}
              />
              {!editingId && (
                <div className="mt-2 flex justify-end">
                  <button 
                    type="button" 
                    onClick={sendOtp} 
                    disabled={isOtpSent || isEmailVerified} 
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border ${isEmailVerified ? 'bg-green-50 text-green-700 border-green-200' : isOtpSent ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 transition-colors'}`}
                  >
                    {isEmailVerified ? '✅ Verified' : isOtpSent ? `Resend in ${otpTimer}s` : 'Send OTP'}
                  </button>
                </div>
              )}
            </div>

            {!editingId && isOtpSent && !isEmailVerified && (
              <div>
                <label className="block text-[11px] font-black tracking-widest text-indigo-900/60 uppercase mb-1.5">Enter OTP *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                    className="w-full border-2 bg-white/50 backdrop-blur-sm p-3 rounded-xl outline-none transition-all shadow-sm font-semibold text-gray-800 focus:bg-white border-gray-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="Enter 6-digit OTP"
                  />
                  <button type="button" onClick={verifyOtp} className="bg-indigo-600 text-white font-bold px-6 rounded-xl hover:bg-indigo-700 shadow-md">Verify</button>
                </div>
              </div>
            )}
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
          <div className="grid md:grid-cols-4 gap-5 bg-gradient-to-tr from-gray-50 to-white p-6 rounded-2xl border border-gray-100 shadow-sm">
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

          {/* Row 4: ID Type, File, Shift, Status */}
          <div className="grid md:grid-cols-4 gap-6 bg-gradient-to-tr from-indigo-50/50 to-blue-50/30 p-6 rounded-2xl border border-indigo-50 shadow-sm">
            <div className="md:col-span-2 grid md:grid-cols-2 gap-6 bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm">
  
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
              <label className="block text-[11px] font-black tracking-widest text-indigo-900/60 uppercase mb-1.5">Shift</label>
              <select {...register("shift")} className="w-full border-2 p-3 font-semibold text-gray-800 rounded-xl outline-none transition-all shadow-sm bg-white/50 backdrop-blur-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 hover:border-gray-200">
                <option value="Day">Day</option>
                <option value="Night">Night</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-black tracking-widest text-indigo-900/60 uppercase mb-1.5">Status</label>
              <select {...register("status")} className="w-full border-2 p-3 font-semibold text-gray-800 rounded-xl outline-none transition-all shadow-sm bg-white/50 backdrop-blur-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 hover:border-gray-200">
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
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 mt-8">
            <button type="button" onClick={closeForm} className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 px-8 py-3 rounded-xl font-bold transition-all shadow-sm">
              Cancel
            </button>
            <button type="submit" className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-10 py-3 rounded-xl font-black shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] transition-all hover:-translate-y-0.5 active:translate-y-0">
              {editingId ? "Update Guard" : "Save Guard Member"}
            </button>
          </div>
             </form>
                    </div>
                  )}

                  {/* TABLE SECTION */}
                  <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    {filteredGuards.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-indigo-50/80 text-indigo-900 font-extrabold uppercase tracking-wider text-[11px] border-b border-indigo-100">
                            <tr className="whitespace-nowrap">
                              <th className="py-4 px-6 rounded-tl-3xl">Guard Info</th>
                              <th className="py-4 px-6">Location</th>
                              <th className="py-4 px-6">Shift & Status</th>
                              <th className="py-4 px-6">ID Details</th>
                              <th className="py-4 px-6 rounded-tr-3xl text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50/50">
                            {filteredGuards.map((g) => (
                              <tr key={g._id} className="hover:bg-indigo-50/40 transition-colors group">
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-400 text-white flex items-center justify-center text-sm shadow-md font-bold shrink-0">
                                      {g.firstName ? g.firstName.charAt(0) : 'G'}{g.lastName ? g.lastName.charAt(0) : ''}
                                    </div>
                                    <div>
                                      <div className="font-bold text-gray-800 text-sm">{g.firstName} {g.lastName}</div>
                                      <div className="text-[11px] text-indigo-600 font-bold tracking-wide">{g.mobile}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <span className="text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-xl border border-gray-100 inline-block shadow-sm">
                                    {g.city}, {g.state}
                                  </span>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex flex-col gap-2">
                                    <span className={`self-start px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${g.shift === 'Day' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                                      {g.shift} Shift
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleStatusToggle(g)}
                                        className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!g.status || g.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}
                                      >
                                        <span
                                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${!g.status || g.status === 'active' ? 'translate-x-5' : 'translate-x-0'}`}
                                        />
                                      </button>
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${!g.status || g.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {!g.status || g.status === 'active' ? 'active' : 'inactive'}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="text-xs font-black text-gray-700 uppercase tracking-widest">{g.idProofType || g.idType || 'AADHAAR'}</div>
                                  <div className="text-[10px] text-gray-500 font-mono mt-1 bg-white px-2 py-0.5 rounded inline-block border border-gray-100 shadow-sm">{g.idNumber || 'Document Uploaded'}</div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(g)} className="bg-white border border-yellow-100 px-3 py-1.5 text-yellow-600 rounded-lg hover:bg-yellow-50 hover:border-yellow-200 transition-all text-xs font-bold shadow-sm">Edit</button>
                                    <button onClick={() => handleDelete(g._id)} className="bg-white border border-red-100 px-3 py-1.5 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all text-xs font-bold shadow-sm">Delete</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-16 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🛡️</div>
                        <h3 className="text-xl font-bold text-gray-800">No Security  Found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or add a new guard.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          function FormInput({ label, type = "text", register, error, placeholder }) {
            return (
              <div>
                <label className="block text-[11px] font-black tracking-widest text-indigo-900/60 uppercase mb-1.5">{label}</label>
                <input 
                  type={type} 
                  {...register} 
                  placeholder={placeholder}
                  className={`w-full border-2 bg-white/50 backdrop-blur-sm p-3 rounded-xl outline-none transition-all shadow-sm font-semibold text-gray-800 placeholder-gray-400 focus:bg-white ${error ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-gray-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 hover:border-gray-200'}`} 
                />
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
              className={`w-full border-2 p-3 font-semibold text-gray-800 rounded-xl outline-none transition-all shadow-sm bg-white/50 backdrop-blur-sm focus:bg-white ${error ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-gray-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 hover:border-gray-200'}`}
            >
              <option value="">Select...</option>
              {options.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            {error && <p className="text-red-500 text-xs mt-1 font-medium">{error.message}</p>}
          </div>
        );
      }