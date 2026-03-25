import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";
import { 
  Building2, Hash, MapPin, Mail, Phone, 
  Activity, Plus, Layers, Flag, ShieldCheck 
} from "lucide-react";

export default function Society() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [showForm, setShowForm] = useState(false);
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);

  /* FETCH SOCIETY */
  const fetchSocieties = async () => {
    try {
      const res = await axios.get("http://localhost:5100/api/society");
      setSocieties(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocieties();
  }, []);

  /* SUBMIT */
  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5100/api/society", data);
      setSocieties([...societies, res.data]);
      alert("Society Added record successfully.");
      reset();
      setShowForm(false);
    } catch (err) {
      console.log(err);
      alert("Error adding society");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Building2 size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">Society Directory</h1>
              <p className="text-gray-500 text-sm mt-1">Manage society profiles and root operational metrics</p>
            </div>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus size={18} /> Add Society
            </button>
          )}
        </div>

        {/* FORM */}
        {showForm && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h2 className="text-xl font-black text-gray-800">Register New Society</h2>
              <button onClick={() => { setShowForm(false); reset(); }} className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              <Section icon={<Building2 />} title="Society Information">
                <Input label="Society Name" register={register("societyName", { required: "Required" })} error={errors.societyName} />
                <Input label="Society Code" register={register("societyCode",{ required: "Required" })} error={errors.societyCode} />
                <Input type="number" label="Total Wings" register={register("totalWings",{ required: "Required" })} error={errors.totalWings} />
                <Input type="number" label="Total Flats" register={register("totalFlats",{ required: "Required" })} error={errors.totalFlats} />
              </Section>

              <Section icon={<MapPin />} title="Location Details">
                <Input label="Address" register={register("address", { required: "Required" })} error={errors.address} />
                <Input label="City" register={register("city", { required: "Required" })} error={errors.city} />
                <Input label="State" register={register("state", { required: "Required" })} error={errors.state} />
                <Input label="Pincode" register={register("pincode", { pattern: { value: /^[0-9]{6}$/, message: "Valid 6 digit pincode required" } })} error={errors.pincode} />
              </Section>

              <Section icon={<Phone />} title="Contact & Networking">
                <Input label="Contact Email" register={register("email", { pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} error={errors.email} />
                <Input label="Contact Phone" register={register("phone", { pattern: { value: /^[0-9]{10}$/, message: "Invalid mobile" } })} error={errors.phone} />
                <Select label="Society Status" register={register("status")} options={["Active", "Inactive"]} />
              </Section>

              <div className="flex gap-4 pt-4 border-t">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all">
                  Onboard Society
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LIST */}
        {!showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <h2 className="text-lg font-bold text-gray-800">Registered Societies</h2>
               <span className="bg-indigo-100 text-indigo-700 font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest">{societies.length} Total</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-black">
                    <th className="p-5">Society Hub</th>
                    <th className="p-5">Capacity Stats</th>
                    <th className="p-5">Location</th>
                    <th className="p-5">Contact</th>
                    <th className="p-5 text-right">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {loading ? (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-semibold">Loading data...</td></tr>
                  ) : societies.length === 0 ? (
                    <tr><td colSpan="5" className="p-12 text-center text-gray-400 font-bold">No society records found. Add one above.</td></tr>
                  ) : societies.map((s, i) => (
                    <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                            {s.societyName?.[0] || 'S'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{s.societyName}</p>
                            <p className="text-xs font-bold text-indigo-500 uppercase flex items-center gap-1 mt-0.5"><Hash size={10}/> {s.societyCode}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-5">
                        <div className="flex flex-col gap-1 text-sm text-gray-700 font-medium">
                          <span className="flex items-center gap-2"><Layers size={13} className="text-orange-400"/> {s.totalWings} Wings</span>
                          <span className="flex items-center gap-2"><Building2 size={13} className="text-blue-400"/> {s.totalFlats} Flats</span>
                        </div>
                      </td>

                      <td className="p-5">
                        <p className="font-bold text-gray-800 text-sm">{s.city}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={10}/> {s.state}</p>
                      </td>

                      <td className="p-5">
                         <p className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1"><Phone size={13} className="text-green-500"/> {s.phone || 'N/A'}</p>
                         <p className="text-xs text-gray-500 flex items-center gap-2"><Mail size={13} className="text-blue-500"/> {s.email || 'N/A'}</p>
                      </td>

                      <td className="p-5 text-right">
                         <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                           s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                         }`}>
                           <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                           {s.status}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* SECTION */
function Section({ title, icon, children }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-black text-gray-800 mb-5 flex items-center gap-2">
        <span className="text-indigo-500">{icon}</span> {title}
      </h2>
      <div className="grid md:grid-cols-2 gap-5">
        {children}
      </div>
    </div>
  );
}

/* INPUT */
function Input({ label, register, error, type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
        {label}
      </label>
      <input
        type={type}
        {...register}
        className={`w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200'}`}
      />
      {error && <p className="text-red-500 text-xs mt-1 font-bold">{error.message}</p>}
    </div>
  );
}

/* SELECT */
function Select({ label, register, options }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
        {label}
      </label>
      <select
        {...register}
        className="w-full border p-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white font-medium"
      >
        <option value="">Select Option</option>
        {options.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}