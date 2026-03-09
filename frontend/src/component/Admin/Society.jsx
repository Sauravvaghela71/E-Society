import { useForm } from "react-hook-form";

export default function Society() {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (

    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Society Registration
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Society Information */}

        <Section title="Society Information">

          <Input
            label="Society Name"
            required
            error={errors.societyName}
            register={register("societyName", {
              required: "Society name is required"
            })}
          />

          <Input
            label="Society Code"
            error={errors.societyCode}
            register={register("societyCode")}
          />

          <Input
            label="Total Wings"
            type="number"
            register={register("totalWings")}
          />

          <Input
            label="Total Flats"
            type="number"
            register={register("totalFlats")}
          />

        </Section>

        {/* Location Details */}

        <Section title="Location Details">

          <Input
            label="Address"
            required
            error={errors.address}
            register={register("address", {
              required: "Address required"
            })}
          />

          <Input
            label="City"
            required
            error={errors.city}
            register={register("city", {
              required: "City required"
            })}
          />

          <Input
            label="State"
            required
            error={errors.state}
            register={register("state", {
              required: "State required"
            })}
          />

          <Input
            label="Pincode"
            error={errors.pincode}
            register={register("pincode", {
              pattern: {
                value: /^[0-9]{6}$/,
                message: "Enter valid 6 digit pincode"
              }
            })}
          />

        </Section>

        {/* Contact Details */}

        <Section title="Contact Details">

          <Input
            label="Contact Email"
            error={errors.email}
            register={register("email", {
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email"
              }
            })}
          />

          <Input
            label="Contact Phone"
            error={errors.phone}
            register={register("phone", {
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter valid 10 digit mobile number"
              }
            })}
          />

        </Section>

        {/* Status */}

        <Section title="Status">

          <Select
            label="Society Status"
            register={register("status")}
            options={["Active", "Inactive"]}
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
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save Society
          </button>

        </div>

      </form>
    </div>
  );
}


/* Section Component */

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


/* Input Component */

function Input({ label, register, error, required, type = "text" }) {
  return (

    <div>

      <label className="block text-sm font-medium mb-1">
        {label} {required && "*"}
      </label>

      <input
        type={type}
        {...register}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error.message}
        </p>
      )}

    </div>
  );
}


/* Select Component */

function Select({ label, register, options }) {
  return (

    <div>

      <label className="block text-sm font-medium mb-1">
        {label}
      </label>

      <select
        {...register}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
      >

        <option value="">Select</option>

        {options.map((item) => (
          <option key={item}>{item}</option>
        ))}

      </select>

    </div>
  );
}