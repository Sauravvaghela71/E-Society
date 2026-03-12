import React from "react"
import AppRouter from "./router/AppRouter"
import { ToastContainer, Zoom } from "react-toastify"
function App() {

  
  

  return (
    <>
      <AppRouter/>
          <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              transition={Zoom}
          />
     
    </>
  )
}

export default App
