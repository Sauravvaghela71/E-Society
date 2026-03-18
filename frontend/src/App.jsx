import React, { useEffect } from "react"
import AppRouter from "./router/AppRouter"
import { ToastContainer, Zoom } from "react-toastify"

// Session Guard: on every page load, if there is no valid token,
// wipe the auth keys so the user is never falsely shown as logged-in.
function clearStaleSession() {
  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // If isLoggedIn flag is set but there is no actual token → stale/corrupt session
  if (isLoggedIn === "true" && !token) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  }
}

// Run immediately (synchronously) before React renders anything
clearStaleSession();

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
