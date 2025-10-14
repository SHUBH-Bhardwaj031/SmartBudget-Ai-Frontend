import React from "react";
import { Staggered } from "react-bits";
import { FaHome, FaPlusCircle, FaListUl, FaRobot, MdDelete, BiLogOut, FaUser } from "react-icons/all";
import { Link, useLocation } from "react-router";
import { useAuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

function SideDrawer({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { user, logoutUser } = useAuthContext();

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/dashboard" },
    { name: "Add Expense", icon: <FaPlusCircle />, path: "/dashboard/add-expense" },
    { name: "View Expense", icon: <FaListUl />, path: "/dashboard/expenses" },
    { name: "Chatbot", icon: <FaRobot />, path: "/dashboard/chatbot" },
    { name: "Recycle Bin", icon: <MdDelete />, path: "/dashboard/recycle" },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#000",
      confirmButtonText: "Yes, Logout!",
    });
    if (result.isConfirmed) {
      logoutUser();
    }
  };

  return (
    <div
      className={`fixed top-16 left-0 h-screen w-64 bg-[#1B1F24] text-white shadow-lg flex flex-col transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* User Info */}
      <div className="flex items-center gap-2 p-6 text-xl font-bold border-b border-gray-700">
        {user && (
          <>
            <FaUser size={24} color="gray" />
            <span className="text-lg font-medium">{user.username}</span>
          </>
        )}
      </div>

      {/* Menu Items with Staggered Animation */}
      <Staggered
        duration={0.3}
        delay={0.1}
        easing="ease-in-out"
      >
        <nav className="flex-1 px-2 py-4 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center space-x-4 px-4 py-3 rounded-md transition duration-200 ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}

          {user && (
            <button
              className="flex items-center space-x-4 px-4 py-3 w-full rounded-md text-gray-300 hover:bg-red-600 hover:text-white"
              onClick={handleLogout}
            >
              <BiLogOut size={20} />
              <span className="text-sm font-medium cursor-pointer">Logout</span>
            </button>
          )}
        </nav>
      </Staggered>
    </div>
  );
}

export default SideDrawer;
