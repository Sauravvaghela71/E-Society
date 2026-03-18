import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const submitHandler = async (formData) => {
    try {
      const res = await axios.post("http://localhost:5100/api/user/login", formData);
      
      if (res.status === 200) {
        toast.success("Login Success");
        
        const userData = res.data.data;

        // Save exactly what Header and ProtectedRoute are looking for
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", userData.role || "user");
        localStorage.setItem("user", JSON.stringify(userData));

        const userRole = (userData.role || "user").toLowerCase();

        // Redirect based on role
        if (userRole === "admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "user" || userRole === "resident") {
          navigate("/user");
        } else if (userRole === "guard" || userRole === "security") {
          navigate("/security/dashboard");
        } else {
          navigate("/");
        }

        // Force a window reload to let AppRouter / Header pick up the fresh LocalStorage data
        // Delaying reload slightly to ensure React Router navigates first
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Invalid Email or Password");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden md:flex w-1/2 h-screen">
        <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0" alt="office" className="object-cover w-full h-full" />
      </div>
      <div className="flex items-center justify-center w-full md:w-1/2 px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-black mb-2 text-gray-800">Welcome Back 👋</h2>
          <p className="text-gray-500 mb-8 font-medium">Please login to access e-Society</p>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input type="email" placeholder="Enter your email" 
                className={`w-full p-3 border rounded-xl outline-none transition ${errors.email ? 'border-red-500 bg-red-50' : 'focus:ring-2 focus:ring-blue-400 border-gray-200'}`} 
                {...register("email", { required: "Email is required" })} 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input type="password" placeholder="Enter your password" 
                className={`w-full p-3 border rounded-xl outline-none transition ${errors.password ? 'border-red-500 bg-red-50' : 'focus:ring-2 focus:ring-blue-400 border-gray-200'}`} 
                {...register("password", { required: "Password is required" })} 
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{errors.password.message}</p>}
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
              Login Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}