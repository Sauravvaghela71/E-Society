import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Society() {

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [showForm, setShowForm] = useState(false);
  const [societies, setSocieties] = useState([]);


  /* FETCH SOCIETY */

  const fetchSocieties = async () => {

    try {

      const res = await axios.get("http://localhost:5100/api/society");

      setSocieties(res.data);

    } catch (err) {
      console.log(err);
    }

  };


  useEffect(() => {
    fetchSocieties();
  }, []);



  /* SUBMIT */

  const onSubmit = async (data) => {

    try {

      const res = await axios.post(
        "http://localhost:5100/api/society",
        data
      );

      setSocieties([...societies, res.data]);

      alert("Society Added");

      reset();

      setShowForm(false);

    } catch (err) {

      console.log(err);

      alert("Error");

    }

  };



  return (

    <div className="max-w-6xl mx-auto p-6">


      {/* ADD BUTTON */}

      <button
        onClick={() => setShowForm(true)}
        className="bg-indigo-600 text-white px-5 py-2 rounded-lg mb-6"
      >
        Add Society
      </button>



      {/* FORM */}

      {showForm && (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">


          <Section title="Society Information">

            <Input
              label="Society Name"
              required
              error={errors.societyName}
              register={register("societyName", { required: "Required" })}
            />

            <Input
              label="Society Code"
              register={register("societyCode",{ required: "Required" })}
            />

            <Input
              label="Total Wings"
              type="number"
              register={register("totalWings",{ required: "Required" })}
            />

            <Input
              label="Total Flats"
              type="number"
              register={register("totalFlats",{ required: "Required" })}
            />

          </Section>



          <Section title="Location Details">

            <Input
              label="Address"
              required
              error={errors.address}
              register={register("address", { required: "Required" })}
            />

            <Input
              label="City"
              required
              error={errors.city}
              register={register("city", { required: "Required" })}
            />

            <Input
              label="State"
              required
              error={errors.state}
              register={register("state", { required: "Required" })}
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
                  message: "Invalid mobile"
                }
              })}
            />

          </Section>



          <Section title="Status">

            <Select
              label="Society Status"
              register={register("status")}
              options={["Active", "Inactive"]}
            />

          </Section>



          <div className="flex gap-4">

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Save Society
            </button>

          </div>

        </form>

      )}


     {societies.length > 0 && (
  <div className="mt-10">
    {/* SOCIETY TABLE */}

    <h2 className="text-xl font-semibold mb-4">Society List</h2>

    <div className="overflow-x-auto">
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Code</th>
            
            <th className="border p-2">Total Wings</th>
            <th className="border p-2">Total Floor</th>
            <th className="border p-2">Float</th>
            <th className="border p-2">City</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {societies.map((s, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{s.societyName}</td>
              <td className="border p-2">{s.societyCode}</td>
              
              <td className="border p-2">{s.totalWings}</td>
              <td className="border p-2">{s.totalFloors}</td>
              <td className="border p-2">{s.totalFlats}</td>
              <td className="border p-2">{s.city}</td>
              <td className="border p-2">{s.phone}</td>
              <td className="border p-2">{s.status}</td>
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



/* SECTION */

function Section({ title, children }) {

  return (

    <div className="bg-white border rounded-xl p-6 shadow-sm">

      <h2 className="text-lg font-semibold mb-5">
        {title}
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        {children}
      </div>

    </div>

  );

}



/* INPUT */

function Input({ label, register, error, required, type = "text" }) {

  return (

    <div>

      <label className="block text-sm font-medium mb-1">
        {label} {required && "*"}
      </label>

      <input
        type={type}
        {...register}
        className="w-full border rounded-lg px-3 py-2"
      />

      {error && (
        <p className="text-red-500 text-sm">
          {error.message}
        </p>
      )}

    </div>

  );

}



/* SELECT */

function Select({ label, register, options }) {

  return (

    <div>

      <label className="block text-sm font-medium mb-1">
        {label}
      </label>

      <select
        {...register}
        className="w-full border rounded-lg px-3 py-2"
      >

        <option value="">Select</option>

        {options.map((item) => (

          <option key={item}>
            {item}
          </option>

        ))}

      </select>

    </div>

  );

}