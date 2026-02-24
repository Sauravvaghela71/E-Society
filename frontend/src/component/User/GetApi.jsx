import axios from "axios";
import React, { useEffect, useState } from "react";

export const GetApi = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getuser = async()=>{
      try {
      const response = await axios.get(
        "https://node5.onrender.com/user/user/"
      );

      console.log(response.data.data);
      setUsers(response.data.data);

      } catch (error) {
        console.log(error);
      }
    }
    getuser()
    
  }, []);

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
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className="text-center hover:bg-gray-100 transition"
              >
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{user.name}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};