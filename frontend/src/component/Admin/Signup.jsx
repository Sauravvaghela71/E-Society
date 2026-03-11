import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      const { confirmPassword, ...registerData } = data;
      const res = await axios.post("http://localhost:5100/api/signup", registerData);
      
      if (res.status == 201) {
        toast.success("User registered successfully");
        navigate("/login"); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE IMAGE */}
      <div className="hidden md:flex w-1/2 h-screen">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt="office"
          className="object-cover w-full h-full"
        />
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-6">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">Create Account 🚀</h2>
          <p className="text-gray-500 mb-6">Signup to get started</p>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            {/* FIRST NAME */}
            <div>
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("firstName", { required: "First Name is required" })}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>

            {/* LAST NAME */}
            <div>
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("lastName", { required: "Last Name is required" })}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
            </div>

            {/* EMAIL */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" }
                })}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) => value === watch("password") || "Passwords do not match"
                })}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* SIGNUP BUTTON */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
            >
              Signup
            </button>

            {/* LOGIN LINK (Added here) */}
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-blue-500 font-semibold cursor-pointer hover:underline"
                >
                  Login here
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}