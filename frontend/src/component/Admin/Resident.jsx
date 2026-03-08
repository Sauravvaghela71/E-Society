import { useForm } from "react-hook-form";

export default function ResidentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Add New Resident
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* ---------------- Personal Info ---------------- */}

        <div className="bg-white shadow-sm rounded-xl border p-6">

          <h2 className="text-lg font-semibold mb-5 text-gray-700">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-3 gap-5">

            <Input
              label="First Name"
              required
              error={errors.firstName}
              register={register("firstName", { required: "First name required" })}
            />

            <Input
              label="Last Name"
              register={register("lastName")}
            />

            <Select
              label="Gender"
              required
              error={errors.gender}
              register={register("gender", { required: "Select gender" })}
              options={["Male", "Female", "Other"]}
            />

            <Input
              type="date"
              label="Date Of Birth"
              register={register("dateOfBirth")}
            />

          </div>
        </div>

        {/* ---------------- Contact Info ---------------- */}

        <div className="bg-white shadow-sm rounded-xl border p-6">

          <h2 className="text-lg font-semibold mb-5 text-gray-700">
            Contact Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <Input
              label="Mobile Number"
              required
              error={errors.mobileNumber}
              register={register("mobileNumber", {
                required: "Mobile required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter valid 10 digit number"
                }
              })}
            />

            <Input
              label="Email"
              error={errors.email}
              register={register("email", {
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email"
                }
              })}
            />

          </div>
        </div>

        {/* ---------------- Flat Details ---------------- */}

        <div className="bg-white shadow-sm rounded-xl border p-6">

          <h2 className="text-lg font-semibold mb-5 text-gray-700">
            Flat Details
          </h2>

          <div className="grid md:grid-cols-3 gap-5">

            <Input
              label="Wing"
              required
              error={errors.wing}
              register={register("wing", { required: "Wing required" })}
            />

            <Input
              label="Flat Number"
              required
              error={errors.flatNumber}
              register={register("flatNumber", { required: "Flat number required" })}
            />

            <Input
              type="number"
              label="Floor Number"
              register={register("floorNumber")}
            />

          </div>
        </div>

        {/* ---------------- Resident Details ---------------- */}

        <div className="bg-white shadow-sm rounded-xl border p-6">

          <h2 className="text-lg font-semibold mb-5 text-gray-700">
            Resident Details
          </h2>

          <div className="grid md:grid-cols-3 gap-5">

            <Select
              label="Resident Type"
              required
              error={errors.residentType}
              register={register("residentType", { required: "Required" })}
              options={["Owner", "Tenant", "Family"]}
            />

            <Input
              type="date"
              label="Move In Date"
              register={register("moveInDate")}
            />

            <Input
              type="date"
              label="Move Out Date"
              register={register("moveOutDate")}
            />

          </div>
        </div>

        {/* ---------------- Identity ---------------- */}

        <div className="bg-white shadow-sm rounded-xl border p-6">

          <h2 className="text-lg font-semibold mb-5 text-gray-700">
            Identity Details
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <Select
              label="ID Proof Type"
              register={register("idProofType")}
              options={["Aadhaar", "PAN", "Driving License", "Passport"]}
            />

            <Input
              label="ID Proof Number"
              register={register("idProofNumber")}
            />

          </div>
        </div>

        {/* ---------------- Vehicle ---------------- */}

        <div className="bg-white shadow-sm rounded-xl border p-6">

          <h2 className="text-lg font-semibold mb-5 text-gray-700">
            Vehicle Details
          </h2>

          <Input
            label="Vehicle Number"
            register={register("vehicleNumber")}
          />

        </div>

        {/* ---------------- Emergency ---------------- */}

        <div className="bg-white shadow-sm rounded-xl border p-6">

          <h2 className="text-lg font-semibold mb-5 text-gray-700">
            Emergency Contact
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <Input
              label="Emergency Contact Name"
              register={register("emergencyContactName")}
            />

            <Input
              label="Emergency Contact Number"
              error={errors.emergencyContactNumber}
              register={register("emergencyContactNumber", {
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter valid number"
                }
              })}
            />

          </div>
        </div>

        {/* ---------------- Status ---------------- */}

        <div className="bg-white shadow-sm rounded-xl border p-6">

          <h2 className="text-lg font-semibold mb-5 text-gray-700">
            Resident Status
          </h2>

          <Select
            label="Status"
            register={register("status")}
            options={["Active", "Inactive"]}
          />

        </div>

        {/* Submit */}

        <div className="flex justify-end gap-4">

          <button
            type="button"
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Resident
          </button>

        </div>

      </form>
    </div>
  );
}

/* ---------------- Reusable Components ---------------- */

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

      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
}

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
          <option key={item}>{item}</option>
        ))}
      </select>

      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
}