import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Security() {

const { register, handleSubmit, formState:{errors}, reset } = useForm();

const [guards,setGuards] = useState([]);
const [showForm,setShowForm] = useState(false);


// FETCH DATA

const fetchGuards = async()=>{
  try{
    const res = await axios.get("http://localhost:5100/api/security");
    setGuards(res.data);
  }catch(err){
    console.log(err);
  }
};

useEffect(()=>{
  fetchGuards();
},[]);


// SUBMIT FORM

const onSubmit = async(data)=>{
  try{

    const res = await axios.post(
      "http://localhost:5100/api/security",
      data
    );

    setGuards([...guards,res.data]);

    reset();

    setShowForm(false);

    alert("Security Guard Added");

  }catch(err){
    console.log(err);
    alert("Error");
  }
};


return(

<div className="max-w-6xl mx-auto p-6">


{/* ADD BUTTON */}

<button
onClick={()=>setShowForm(true)}
className="bg-green-600 text-white px-5 py-2 rounded-lg mb-6">
Add Security Guard
</button>


{/* FORM */}

{showForm && (

<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">


{/* PERSONAL */}

<div className="border rounded-xl p-6 shadow-sm">

<h2 className="text-lg font-semibold mb-6">
Personal Information
</h2>

<div className="grid md:grid-cols-3 gap-6">

<div>
<label>First Name *</label>
<input
{...register("firstName",{required:"Name is Required"})}
className="w-full border rounded-lg p-2"
/>
<p className="text-red-500 text-sm">{errors.firstName?.message}</p>
</div>

<div>
<label>Last Name *</label>
<input
{...register("lastName",{required:"Last Name is Required"})}
className="w-full border rounded-lg p-2"
/>
<p className="text-red-500 text-sm">{errors.lastName?.message}</p>
</div>

<div>
<label>Joining Date *</label>
<input
type="date"
{...register("joiningDate",{required:"Joining Date is Required"})}
className="w-full border rounded-lg p-2"
/>
<p className="text-red-500 text-sm">{errors.joiningDate?.message}</p>
</div>

</div>

</div>


{/* CONTACT */}

<div className="border rounded-xl p-6 shadow-sm">

<h2 className="text-lg font-semibold mb-6">
Contact Information
</h2>

<div className="grid md:grid-cols-3 gap-6">

<input placeholder="Mobile"
{...register("mobile", {
                required: "Mobile required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter valid 10 digit number"
                }
              })}
className="border rounded-lg p-2"/>

<input placeholder="Alternate Mobile"
{...register("altMobile", {
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter valid 10 digit number"
                }
              })}
className="border rounded-lg p-2"/>

<input placeholder="Email"
{...register("email", {
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email"
                }
              })}
className="border rounded-lg p-2"/>

</div>

</div>


{/* ADDRESS */}

<div className="border rounded-xl p-6 shadow-sm">

<h2 className="text-lg font-semibold mb-6">
Address Information
</h2>

<div className="grid md:grid-cols-3 gap-6">

<input placeholder="Address"
{...register("address",{required:"Address is required",
  pattern:{
    value:/^[0-9]{12}$/,
    message:"Aadhaar must be 12 digit number"
  }
})}
className="border rounded-lg p-2"/>

<input placeholder="City"
{...register("city",{required:"City is required"})}
className="border rounded-lg p-2"/>
<p className="text-red-500 text-sm">{errors.city?.message}</p>

<input placeholder="State"
{...register("state",{required:"State is required"})}
className="border rounded-lg p-2"/>
<p className="text-red-500 text-sm">{errors.state?.message}</p>

<input placeholder="Pincode"
{...register("pincode",{required:"Pincode is required"})}
className="border rounded-lg p-2"/>
<p className="text-red-500 text-sm">{errors.pincode?.message}</p>

</div>

</div>


{/* JOB */}

<div className="border rounded-xl p-6 shadow-sm">

<h2 className="text-lg font-semibold mb-6">
Job Information
</h2>

<div className="grid md:grid-cols-3 gap-6">



<select {...register("shift",{required:"Shift is required"})}
className="border rounded-lg p-2">

<option value="">Shift</option>
<option>Day</option>
<option>Night</option>

</select>

<select {...register("status",{required:"Status is required"})}
className="border rounded-lg p-2">

<option value="">Status</option>
<option>Active</option>
<option>Inactive</option>

</select>

</div>

</div>


{/* ID */}

<div className="border rounded-xl p-6 shadow-sm">

<h2 className="text-lg font-semibold mb-6">
ID Proof
</h2>

<div className="grid md:grid-cols-2 gap-6">

<input
value="AadhaarCard"
readOnly
{...register("idType")}
className="border rounded-lg p-2 bg-gray-100"
/>

<input
placeholder="Aadhaar Number"
{...register("idNumber",{required:"Aadhaar Number is required"})}
className="border rounded-lg p-2"
/>

</div>

</div>


{/* EMERGENCY */}

<div className="border rounded-xl p-6 shadow-sm">

<h2 className="text-lg font-semibold mb-6">
Emergency Contact
</h2>

<div className="grid md:grid-cols-2 gap-6">

<input
placeholder="Emergency Name"
{...register("emergencyName",{required:"Emergency Name is required"})}
className="border rounded-lg p-2"
/>

<input
placeholder="Emergency Mobile"
{...register("emergencyMobile",{required:"Emergency Mobile is required"})}
className="border rounded-lg p-2"
/>

</div>

</div>


<div className="flex gap-4">

<button
type="button"
onClick={()=>setShowForm(false)}
className="border px-4 py-2 rounded-lg">
Cancel
</button>

<button
type="submit"
className="bg-blue-600 text-white px-6 py-2 rounded-lg">
Save Guard
</button>

</div>

</form>

)}



{/* TABLE */}
{guards.length > 0 && (
<div className="mt-10">

<h2 className="text-2xl font-bold mb-4">
Security Guards List
</h2>
<div className="overflow-x-auto border rounded-lg">

<table className="min-w-[1400px] border text-sm">


<thead>

<tr className="bg-gray-200 text-sm">

<th className="border p-2">First Name</th>
<th className="border p-2">Last Name</th>
<th className="border p-2">Mobile</th>
<th className="border p-2">Alt Mobile</th>
<th className="border p-2">Email</th>
<th className="border p-2">Address</th>
<th className="border p-2">City</th>
<th className="border p-2">State</th>
<th className="border p-2">Pincode</th>
<th className="border p-2">Shift</th>
<th className="border p-2">Joining Date</th>
<th className="border p-2">ID Type</th>
<th className="border p-2">AadharCard Number</th>
<th className="border p-2">Emergency Name</th>
<th className="border p-2">Emergency Mobile</th>
<th className="border p-2">Status</th>

</tr>

</thead>

<tbody>

{guards.map((g,i)=>(

<tr key={i} className="text-center hover:bg-gray-50 whitespace-nowrap">

<td className="border p-2">{g.firstName}</td>
<td className="border p-2">{g.lastName}</td>
<td className="border p-2">{g.mobile}</td>
<td className="border p-2">{g.altMobile}</td>
<td className="border p-2">{g.email}</td>
<td className="border p-2">{g.address}</td>
<td className="border p-2">{g.city}</td>
<td className="border p-2">{g.state}</td>
<td className="border p-2">{g.pincode}</td>
<td className="border p-2">{g.shift}</td>
<td className="border p-2">{g.joiningDate}</td>
<td className="border p-2">{g.idType}</td>
<td className="border p-2">{g.idNumber}</td>
<td className="border p-2">{g.emergencyName}</td>
<td className="border p-2">{g.emergencyMobile}</td>
<td className="border p-2">{g.status}</td>

</tr>

))}

</tbody>

</table>

</div>
</div>

)}
</div>

)

}