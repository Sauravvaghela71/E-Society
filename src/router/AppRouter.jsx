import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import Login from "../component/User/Login";
import Signup from "../component/User/Signup";
import  UserNavbar from "../component/User/UserNavbar";
import { AdminSidebar } from "../component/Admin/AdminSidebar";
import { AllUserList } from "../component/Admin/AllUserList";
import Resident from "../component/User/Resident";
import MaintainanceSetting from "../component/User/MaintainanceSetting";

const router = createBrowserRouter([
    {path:"/",element:<Login/>},
    {path:"/signup",element:<Signup/>},

    {path:"/user",element:<UserNavbar/>,
        children:[
            {path:"resident",element:<Resident/>},
            {path:"Maintainancesetting",element:<MaintainanceSetting/>}
        ]
    },
    {
        path:"/admin",element:<AdminSidebar/>,
        children:[
            {path:"allusers",element:<AllUserList/>}
        ]
    }
])

const AppRouter = ()=>{
    return <RouterProvider router={router}></RouterProvider>
}
export default AppRouter