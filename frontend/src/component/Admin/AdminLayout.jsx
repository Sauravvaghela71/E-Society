import { Outlet } from "react-router-dom";
import { UserNavbar } from "./UserNavbar";
import AdminSidebar from "./AdminSidebar";
import HomePage from "../User/HomePage";

const AdminLayout = () => {
  return (
    <>
      {/* <UserNavbar /> */}

      <div className="flex min-h-screen bg-gray-100">

        <AdminSidebar />

        <div className="flex-1 ml-64 p-6">
          <Outlet />
        </div>

      </div>
    </>
  );
};

export default AdminLayout;