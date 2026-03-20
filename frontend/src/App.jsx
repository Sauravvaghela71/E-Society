import React from "react";
import AppRouter from "./router/AppRouter";
import { ToastContainer, Zoom } from "react-toastify";

// ✅ Clean stale session
function clearStaleSession() {
  const token = sessionStorage.getItem("token");
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true" && !token) {
    sessionStorage.clear();
  }
}

clearStaleSession();

function App() {
  return (
    <>
      <AppRouter />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="colored"
        transition={Zoom}
      />
    </>
  );
}

export default App;