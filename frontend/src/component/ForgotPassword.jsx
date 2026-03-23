import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'

export const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
    const navigate = useNavigate()

    const submitHandler = async (data) => {
        try {
            const res = await axios.post("http://localhost:5100/api/user/forgotpassword", data)
            if (res.status === 200) {
                // Consider adding a "Success" toast here
                navigate("/login")
            }
        } catch (error) {
            console.error("Error sending reset link:", error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        No worries! Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${
                                errors.email 
                                ? "border-red-500 focus:ring-2 focus:ring-red-200" 
                                : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            }`}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500 font-medium">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Sending Link..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link 
                        to="/" 
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}