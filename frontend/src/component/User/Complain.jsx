import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";



export default function Complaint() {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // --- 1. BACKEND SE DATA LANEY KA CODE ---
  useEffect(() => {
    const getComplaintData = async () => {
      try {
        // Changed to proper Axios syntax and removed undefined 'data' argument
        const response = await axios.get("http://localhost:5100/api/user/complaints"); 
        if (response.status === 200) {
          // Pre-populate data if response is an object matching the form fields
          // reset(response.data); 
        }
      } catch (error) {
        console.error("Data fetch karne me error:", error);
      }
    };

    // getComplaintData(); // Call this when you actually need to fetch and set default data
  }, [reset]);

  // --- 2. BACKEND ME DATA STORE KARNE KA CODE ---
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        data.userId = JSON.parse(storedUser)._id; // Add user id
      }
      
      const response = await axios.post("http://localhost:5100/api/complaint", data, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response.status === 200 || response.status === 201) {
        alert("Complaint successfully store ho gayi!");
        reset(); // Clear the form after successful submission
      } else {
        alert("Server error: Data store nahi ho paya.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.response?.data?.message || "Network error: Backend connect nahi ho raha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Register Complaint
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Resident Information */}
        <Section title="Resident Information">
          <Input
            label="Resident Name"
            required
            error={errors.name}
            register={register("name", { required: "Resident name required" })}
          />

          <Input
            label="Mobile Number"
            required
            error={errors.mobile}
            register={register("mobile", {
              required: "Mobile number required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter valid 10 digit number"
              }
            })}
          />

          <Input
            label="Wing"
            required
            error={errors.wing}
            register={register("wing", { required: "Wing required" })}
          />

          <Input
            label="Flat Number"
            required
            error={errors.flat}
            register={register("flat", { required: "Flat number required" })}
          />
        </Section>

        {/* Complaint Details */}
        <Section title="Complaint Details">
          <Select
            label="Complaint Category"
            required
            error={errors.category}
            register={register("category", { required: "Select complaint category" })}
            options={["Water Issue", "Electricity Issue", "Lift Issue", "Parking Issue", "Security Issue", "Cleaning Issue", "Other"]}
          />

          <Select
            label="Priority"
            required
            error={errors.priority}
            register={register("priority", { required: "Select priority" })}
            options={["Low", "Medium", "High", "Urgent"]}
          />

          <Select
            label="Complaint Location"
            register={register("location")}
            options={["Flat", "Parking", "Garden", "Lift", "Common Area"]}
          />
        </Section>

        {/* Description */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Complaint Description
          </h2>
          <textarea
            rows="4"
            {...register("description", {
              required: "Complaint description required",
              minLength: { value: 10, message: "Minimum 10 characters required" }
            })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Attachment */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Upload Image (Optional)
          </h2>
          <input type="file" {...register("image")} className="w-full border rounded-lg px-3 py-2" />
        </div>

        {/* Status */}
        <Section title="Complaint Status">
          <Select
            label="Status"
            register={register("status")}
            options={["Pending", "In Progress", "Resolved", "Closed"]}
          />
        </Section>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100"
          >
            Reset Form
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? "Storing..." : "Submit Complaint"}
          </button>
        </div>

      </form>
    </div>
  );
}

/* SECTION COMPONENT (NO CHANGES) */
function Section({ title, children }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-5 text-gray-700">{title}</h2>
      <div className="grid md:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

/* INPUT COMPONENT (NO CHANGES) */
function Input({ label, register, error, required, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label} {required && "*"}
      </label>
      <input
        type={type}
        {...register}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

/* SELECT COMPONENT (NO CHANGES) */
function Select({ label, register, options, error, required }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label} {required && "*"}
      </label>
      <select
        {...register}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">Select</option>
        {options.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}