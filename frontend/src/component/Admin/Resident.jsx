import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ResidentForm() {

  const [showForm, setShowForm] = useState(false);
  // const [residents, setResidents] = useState([]);
  const [user, setUser] = useState([]);
  
 const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

const resident = async (data) => {

  try {

    const res = await axios.post(
      "http://localhost:5100/api/residents",
      data
    );

    setUser([...user, res.data]); // FIX

    alert("Resident Added Successfully");

    setShowForm(false); // FIX

  } catch (error) {

    console.log(error);
    alert("Error adding resident");

  }

};
 
useEffect(() => {

  const fetchResidents = async () => {  

    try {

      const res = await axios.get(
        "http://localhost:5100/api/residents"
      );
      // console.log("data fetched...",res.data);
      
      setUser(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  fetchResidents();

}, []);

  const onSubmit = (data) => {
    resident(data);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <button
            onClick={() => setShowForm(true)}
            className="mb-6 px-5 py-2 bg-green-600 text-white rounded"
          >
            Add New Resident
      </button>

      {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Add New Resident
      </h1> */}

      {showForm &&
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
  onClick={() => setShowForm(false)}
  className="px-6 py-2 border rounded-lg"
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
      }

{user.length > 0 && (
       <div className="mt-10">

  <h2 className="text-2xl font-bold mb-4">
    Residents List
  </h2>

  {/* Scroll container */}
  <div className="w-230 overflow-x-auto">

    <table className="min-w-[1400px] border text-sm">

      <thead>
        <tr className="bg-gray-200 text-sm whitespace-nowrap">
          <th className="border px-3 py-2">Name</th>
          <th className="border px-3 py-2">Gender</th>
          <th className="border px-3 py-2">DOB</th>
          <th className="border px-3 py-2">Mobile</th>
          <th className="border px-3 py-2">Email</th>
          <th className="border px-3 py-2">Wing</th>
          <th className="border px-3 py-2">Flat</th>
          <th className="border px-3 py-2">Floor</th>
          <th className="border px-3 py-2">Resident Type</th>
          <th className="border px-3 py-2">Move In</th>
          <th className="border px-3 py-2">Move Out</th>
          <th className="border px-3 py-2">ID Type</th>
          <th className="border px-3 py-2">ID Number</th>
          <th className="border px-3 py-2">Vehicle</th>
          <th className="border px-3 py-2">Emergency Name</th>
          <th className="border px-3 py-2">Emergency Number</th>
          <th className="border px-3 py-2">Status</th>
        </tr>
      </thead>

      <tbody>

        {user.map((u, i) => (

          <tr key={i} className="text-center hover:bg-gray-50 whitespace-nowrap">

            <td className="border px-3 py-2">{u.firstName} {u.lastName}</td>
            <td className="border px-3 py-2">{u.gender}</td>
            <td className="border px-3 py-2">{u.dateOfBirth}</td>
            <td className="border px-3 py-2">{u.mobileNumber}</td>
            <td className="border px-3 py-2">{u.email}</td>
            <td className="border px-3 py-2">{u.wing}</td>
            <td className="border px-3 py-2">{u.flatNumber}</td>
            <td className="border px-3 py-2">{u.floorNumber}</td>
            <td className="border px-3 py-2">{u.residentType}</td>
            <td className="border px-3 py-2">{u.moveInDate}</td>
            <td className="border px-3 py-2">{u.moveOutDate}</td>
            <td className="border px-3 py-2">{u.idProofType}</td>
            <td className="border px-3 py-2">{u.idProofNumber}</td>
            <td className="border px-3 py-2">{u.vehicleNumber}</td>
            <td className="border px-3 py-2">{u.emergencyContactName}</td>
            <td className="border px-3 py-2">{u.emergencyContactNumber}</td>
            <td className="border px-3 py-2">{u.status}</td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>
      )}
      
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


