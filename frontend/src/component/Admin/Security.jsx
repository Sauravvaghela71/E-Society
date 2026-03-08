import { useForm } from "react-hook-form";

export default function Security() {

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
        Security Guard Registration
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* PERSONAL INFO */}

        <Section title="Personal Information">

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

        </Section>

        {/* CONTACT */}

        <Section title="Contact Information">

          <Input
            label="Mobile Number"
            required
            error={errors.mobile}
            register={register("mobile", {
              required: "Mobile required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter valid 10 digit number"
              }
            })}
          />

          <Input
            label="Alternate Mobile"
            error={errors.altMobile}
            register={register("altMobile", {
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter valid number"
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

        </Section>

        {/* ADDRESS */}

        <Section title="Address">

          <Input
            label="Address"
            register={register("address")}
          />

          <Input
            label="City"
            register={register("city")}
          />

          <Input
            label="State"
            register={register("state")}
          />

          <Input
            label="Pincode"
            error={errors.pincode}
            register={register("pincode", {
              pattern: {
                value: /^[0-9]{6}$/,
                message: "Enter valid pincode"
              }
            })}
          />

        </Section>

        {/* JOB DETAILS */}

        <Section title="Job Details">

          <Input
            label="Guard ID"
            required
            error={errors.guardId}
            register={register("guardId", { required: "Guard ID required" })}
          />

          <Select
            label="Shift"
            register={register("shift")}
            options={["Morning", "Evening", "Night"]}
          />

          <Input
            label="Joining Date"
            type="date"
            register={register("joiningDate")}
          />

        </Section>

        {/* IDENTITY */}

        <Section title="Identity Proof">

          <Select
            label="ID Type"
            register={register("idType")}
            options={["Aadhaar", "PAN", "Driving License", "Voter ID"]}
          />

          <Input
            label="ID Number"
            register={register("idNumber")}
          />

        </Section>

        {/* EMERGENCY */}

        <Section title="Emergency Contact">

          <Input
            label="Contact Name"
            register={register("emergencyName")}
          />

          <Input
            label="Contact Number"
            error={errors.emergencyMobile}
            register={register("emergencyMobile", {
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter valid number"
              }
            })}
          />

        </Section>

        {/* STATUS */}

        <Section title="Status">

          <Select
            label="Status"
            register={register("status")}
            options={["Active", "Inactive"]}
          />

        </Section>

        {/* BUTTONS */}

        <div className="flex justify-end gap-4">

          <button
            type="button"
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save Guard
          </button>

        </div>

      </form>

    </div>
  );
}


/* REUSABLE SECTION */

function Section({ title, children }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">

      <h2 className="text-lg font-semibold mb-5 text-gray-700">
        {title}
      </h2>

      <div className="grid md:grid-cols-3 gap-5">
        {children}
      </div>

    </div>
  );
}


/* INPUT COMPONENT */

function Input({ label, register, error, required, type = "text" }) {
  return (
    <div>

      <label className="block text-sm font-medium mb-1">
        {label} {required && "*"}
      </label>

      <input
        type={type}
        {...register}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
      />

      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error.message}
        </p>
      )}

    </div>
  );
}


/* SELECT COMPONENT */

function Select({ label, register, options, error, required }) {
  return (
    <div>

      <label className="block text-sm font-medium mb-1">
        {label} {required && "*"}
      </label>

      <select
        {...register}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
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