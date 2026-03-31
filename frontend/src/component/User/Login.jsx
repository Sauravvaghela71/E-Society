import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, Lock, ArrowRight, Loader } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // useForm setup
  const { register, handleSubmit, formState: { errors } } = useForm();

  const submitHandler = async (data) => {
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5100/api/user/login", data);

      if (res.data && res.data.token) {
        const user = res.data.data; 
        const token = res.data.token;
        const role = user.role.toLowerCase();

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("user", JSON.stringify(user));

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("Login Successful!");

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if ( role === "guard") {
          navigate("/security/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (err) {
      let errorMsg = "Invalid credentials. Please try again.";
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
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      {/* Left side: Premium Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative overflow-hidden bg-gray-900 border-r border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-black z-0 pointer-events-none opacity-80" />
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" 
          alt="Building Architecture" 
          className="absolute inset-0 object-cover w-full h-full opacity-20 z-0 mix-blend-overlay"
        />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-blue-500/30">
            E
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">Society</h1>
            <span className="text-xs text-blue-400 font-bold tracking-[0.2em] uppercase">Enterprise Protocol</span>
          </div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            #1 Management Software
          </div>
          <h2 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Connecting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Communities.
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md font-medium leading-relaxed">
            The premium platform for modern society administration, resident engagement, and impenetrable digital security.
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

      {/* Right side: Login Form */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-6 md:p-12 z-10">
        
        {/* Mobile Header */}
        <div className="flex lg:hidden items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/30">
            E
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">Society</h1>
        </div>

        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[32px] shadow-2xl shadow-indigo-100/50 border border-gray-100/50">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back 👋</h2>
            <p className="text-gray-500 font-medium mt-2">Enter your credentials to access the portal.</p>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className={`${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all font-medium ${
                    errors.email 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white'
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
              {errors.email && <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full"></span> {errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Password</label>
                <Link to="/forgotpassword" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className={`${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all font-medium ${
                    errors.password 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white'
                  }`}
                  {...register("password", { required: "Password is required" })}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full"></span> {errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm font-medium text-gray-500 space-y-2">
            <div>
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">
                Contact Admin
              </Link>
            </div>
            <div>
              <Link to="/admin/register" className="text-red-600 font-bold hover:underline bg-red-50 px-3 py-1 rounded-full">
                Register as Admin
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}