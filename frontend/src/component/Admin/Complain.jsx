import { useForm } from "react-hook-form";

export default function Complaint() {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
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
            register={register("name", {
              required: "Resident name required"
            })}
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
            register={register("wing", {
              required: "Wing required"
            })}
          />

          <Input
            label="Flat Number"
            required
            error={errors.flat}
            register={register("flat", {
              required: "Flat number required"
            })}
          />

        </Section>

        {/* Complaint Details */}

        <Section title="Complaint Details">

          <Select
            label="Complaint Category"
            required
            error={errors.category}
            register={register("category", {
              required: "Select complaint category"
            })}
            options={[
              "Water Issue",
              "Electricity Issue",
              "Lift Issue",
              "Parking Issue",
              "Security Issue",
              "Cleaning Issue",
              "Other"
            ]}
          />

          <Select
            label="Priority"
            required
            error={errors.priority}
            register={register("priority", {
              required: "Select priority"
            })}
            options={[
              "Low",
              "Medium",
              "High",
              "Urgent"
            ]}
          />

          <Select
            label="Complaint Location"
            register={register("location")}
            options={[
              "Flat",
              "Parking",
              "Garden",
              "Lift",
              "Common Area"
            ]}
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
              minLength: {
                value: 10,
                message: "Minimum 10 characters required"
              }
            })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}

        </div>

        {/* Attachment */}

        <div className="bg-white border rounded-xl p-6 shadow-sm">

          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Upload Image (Optional)
          </h2>

          <input
            type="file"
            {...register("image")}
            className="w-full border rounded-lg px-3 py-2"
          />

        </div>

        {/* Status */}

        <Section title="Complaint Status">

          <Select
            label="Status"
            register={register("status")}
            options={[
              "Pending",
              "In Progress",
              "Resolved",
              "Closed"
            ]}
          />

        </Section>

        {/* Buttons */}

        <div className="flex justify-end gap-4">

          <button
            type="button"
            className="px-6 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit Complaint
          </button>

        </div>

      </form>
    </div>
  );
}


/* SECTION COMPONENT */

function Section({ title, children }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">

      <h2 className="text-lg font-semibold mb-5 text-gray-700">
        {title}
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
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
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">
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
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">Select</option>

        {options.map((item) => (
          <option key={item}>{item}</option>
        ))}

      </select>

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error.message}
        </p>
      )}

    </div>
  );
}