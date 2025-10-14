import React, { useState, useEffect } from "react";
import SideDrawer from "../../components/SideMenu"
import { Navigate, Outlet } from "react-router";
import { getAccessTokenFromLocalStorage } from "../../services/LocalStorageService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function DashboardLayout() {
  const accessToken = getAccessTokenFromLocalStorage();
  const [isExpired, setIsExpired] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (accessToken) {
      try {
        const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
        const isTokenExpired = tokenPayload.exp * 1000 < Date.now();

        if (isTokenExpired) {
          setIsExpired(true);
          Swal.fire({
            title: "Session Expired",
            text: "Please login again to access your dashboard.",
            icon: "warning",
            confirmButtonText: "Login",
          }).then(() => {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
          });
        }
      } catch (err) {
        console.error("Invalid token:", err);
        setIsExpired(true);
        toast.error("Invalid token, please login again!");
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }
  }, [accessToken]);

  if (!accessToken || isExpired) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex bg-[#1F242C]">
      {/* Side Drawer */}
      <SideDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />

      {/* Right content */}
      <div
        className={`flex-1 min-h-screen py-16 bg-[#1F242C]  transition-all duration-300 ${
          isDrawerOpen ? "ml-64" : "mx-auto "
        }`}
      >
        <div className="p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
