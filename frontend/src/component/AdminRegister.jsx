import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, Lock, ArrowRight, Loader, User, Phone } from "lucide-react";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // useForm setup
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const submitHandler = async (data) => {
    setIsLoading(true);

    try {
      // Create admin user
      const payload = {
        Name: data.name,
        email: data.email,
        password: data.password,
        phone: data.mobile,
        role: "admin",
        // Adding a fallback dummy profileid since UserModel requires it.
        profileid: "000000000000000000000000"
      };

      const res = await axios.post("http://localhost:5100/api/user/signup", payload);

      if (res.status === 201 || res.status === 200) {
        toast.success("Admin Registration Successful!");
        navigate("/login");
      }
    } catch (err) {
      let errorMsg = "Registration failed. Please try again.";
      if (err.response?.status === 500) {
        errorMsg = err.response?.data?.message || "Server error. Please contact support.";
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-gray-50 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      {/* Left side: Premium Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative overflow-hidden bg-gray-900 border-r border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-gray-900 to-black z-0 pointer-events-none opacity-80" />
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" 
          alt="Building Architecture" 
          className="absolute inset-0 object-cover w-full h-full opacity-20 z-0 mix-blend-overlay"
        />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-emerald-500/30">
            E
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">Society</h1>
            <span className="text-xs text-emerald-400 font-bold tracking-[0.2em] uppercase">Enterprise Protocol</span>
          </div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            #1 Management Software
          </div>
          <h2 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Connecting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Communities.
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md font-medium leading-relaxed">
            Register as an Administrator to manage your society operations efficiently and securely.
          </p>
        </div>

        <div className="relative z-10 flex gap-4 text-sm font-bold text-gray-500 uppercase tracking-widest">
          <span>Secure</span>
          <span>•</span>
          <span>Scalable</span>
          <span>•</span>
          <span>Unified</span>
        </div>
      </div>

      {/* Right side: Registration Form */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-6 md:p-12 z-10">
        
        {/* Mobile Header */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-emerald-500/30">
            E
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">Society</h1>
        </div>

        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[32px] shadow-2xl shadow-emerald-100/50 border border-gray-100/50">
          <div className="mb-6">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Admin Registration</h2>
            <p className="text-gray-500 font-medium mt-2">Create a new administrator account.</p>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className={`${errors.name ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-medium ${
                    errors.name 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white'
                  }`}
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className={`${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-medium ${
                    errors.email 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white'
                  }`}
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email structure"
                    }
                  })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone size={18} className={`${errors.mobile ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Enter your mobile number"
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-medium ${
                    errors.mobile 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white'
                  }`}
                  {...register("mobile", { 
                    required: "Mobile Number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Invalid mobile number"
                    }
                  })}
                />
              </div>
              {errors.mobile && <p className="text-red-500 text-xs mt-1 font-bold">{errors.mobile.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className={`${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="password"
                  placeholder="Create a password"
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-medium ${
                    errors.password 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white'
                  }`}
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters required" }
                  })}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className={`${errors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all font-medium ${
                    errors.confirmPassword 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white'
                  }`}
                  {...register("confirmPassword", { 
                    required: "Please confirm your password",
                    validate: (val) => {
                      if (watch('password') != val) {
                        return "Your passwords do not match";
                      }
                    }
                  })}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-bold">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" /> Registering...
                </>
              ) : (
                <>
                  Register Admin <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 flex flex-col items-center gap-2 text-sm font-medium text-gray-500">
            <div>
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-600 font-bold hover:underline">
                Login
              </Link>
            </div>
            <div>
              <Link to="/forgotpassword" className="text-emerald-600 font-bold hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
