import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'

export const ResetPassword = () => {
    const token = useParams().token
    const submitHandler =(data)=>{
        data.token = token
        axios.put("url",data)
    }
  return (
    <div>
        <h1>RESET PASSWORD</h1>
        form -- new password.. submit --
    </div>
  )
}