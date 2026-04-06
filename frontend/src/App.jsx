import React from "react";
import AppRouter from "./router/AppRouter";
import { ToastContainer, Zoom } from "react-toastify";
import GlobalLoader from "./component/GlobalLoader";

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
      <GlobalLoader />
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