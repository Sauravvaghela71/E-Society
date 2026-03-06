import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

export const GetApi = () => {
  const [users, setUsers] = useState([]);

  
    const getuser = async()=>{
      
      const response = await axios.post("http://localhost:5100/flat", [{id:1001,name:"saurav"},{id:1002,name:"rohit"},{id:1003,name:"rahul"}]);
      console.log(response.data);
      setUsers(response.data);
      }
    

    const DeleteUser = async(id)=>{
      
        const res = await axios.delete(`https://node5.onrender.com/user/user/${id}`)
        console.log(res);
        if(res.status==204){
          toast.success("delete user succesfully")
        }
        getuser()
      } 
    
  useEffect(()=>{
    getuser()
  },[]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        User List
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-4 border">#</th>
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Email</th>
              <th className="py-3 px-4 border">Role</th>
              <th className="py-3 px-4 border">Button</th>
              
            </tr>
          </thead>

          <tbody>
            {/* {!users.map((user, index) => (
              <tr
                key={user._id}
                className="text-center hover:bg-gray-100 transition"
              >
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{user.name}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border">{user.role}</td>
                <td>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={()=>{DeleteUser(user._id)}}>DELETE</button>
                </td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

