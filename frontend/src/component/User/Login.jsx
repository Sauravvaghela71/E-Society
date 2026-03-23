import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // useForm setup
  const { register, handleSubmit, formState: { errors } } = useForm();

  const submitHandler = async (data) => {
    setIsLoading(true); // Start loader

    try {
      // ✅ FIX: Do NOT send Authorization headers for a login request. 
      // The server doesn't know who you are yet!
      const res = await axios.post("http://localhost:5100/api/user/login", data);

      // Check if response has what we need
      if (res.data && res.data.token) {
        const user = res.data.data; // Ensure your backend returns user info here
        const token = res.data.token;
        const role = user.role.toLowerCase();

        // ✅ SAVE TO SESSION STORAGE
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("user", JSON.stringify(user));

        toast.success("Login Successful!");

        // ✅ REDIRECT BASED ON ROLE
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      // ✅ Handle specific error messages from your backend
      const errorMsg = err.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(errorMsg);
    } finally {
      // ✅ Always stop loading in finally to handle both success and error cases
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side: Image */}
      <div className="hidden md:flex w-1/2 h-screen">
        <img 
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0" 
          alt="office" 
          className="object-cover w-full h-full" 
        />
      </div>

      {/* Right side: Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-black mb-2 text-gray-800">Welcome Back 👋</h2>
          <p className="text-gray-500 mb-8 font-medium">Please login to access e-Society</p>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full p-3 border rounded-xl outline-none transition ${errors.email ? 'border-red-500 bg-red-50' : 'focus:ring-2 focus:ring-blue-400 border-gray-200'}`}
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className={`w-full p-3 border rounded-xl outline-none transition ${errors.password ? 'border-red-500 bg-red-50' : 'focus:ring-2 focus:ring-blue-400 border-gray-200'}`}
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white p-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Logging in...
                </>
              ) : "Login Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}