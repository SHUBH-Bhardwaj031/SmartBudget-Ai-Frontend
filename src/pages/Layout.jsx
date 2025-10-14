import React from "react";
import { Outlet, useLocation } from "react-router";
import Header from "../components/Header";
import { ToastContainer } from "react-toastify";
import Footers from "../components/Footer";

function Layout() {
  const location = useLocation();

  // Agar current route /dashboard se start hota hai to Header hide kar do
  const hideHeader = location.pathname.startsWith("/dashboard");
  const hideFooter= location.pathname.startsWith("/dashboard/chatbot")

  return (
    <div>
      <ToastContainer />
      {!hideHeader && <Header />}
      <Outlet />
     {!hideFooter && <Footers/>}
    </div>
  );
}

export default Layout;
