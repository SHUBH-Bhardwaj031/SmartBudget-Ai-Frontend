import React, { useState } from "react";
import { FaHome, FaPlusCircle, FaListUl, FaRobot, FaUser } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { Link, useLocation } from "react-router";
import { useAuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

function SideDrawer() {
  const [isOpen, setIsOpen] = useState(false); // drawer state
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
    <>
      {/* Hamburger / toggle button */}
      <button
        className="fixed top-5 left-5 z-50 p-2 bg-gray-800 text-white rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Side Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#1B1F24] text-white z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex gap-2 p-6 text-2xl font-bold text-white border-b border-gray-700">
          {user && (
            <>
              <FaUser size={24} color="gray" />
              <span className="text-lg font-medium">{user.username}</span>
            </>
          )}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center space-x-4 px-4 py-3 rounded-md transition duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)} // close drawer on click
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}

          {user && (
            <button
              className="flex items-center space-x-4 px-4 w-full py-3 rounded-md transition duration-200 text-gray-300 hover:bg-red-600 hover:text-white"
              onClick={handleLogout}
            >
              <span className="text-lg">
                <BiLogOut />
              </span>
              <span className="text-sm font-medium cursor-pointer">Logout</span>
            </button>
          )}
        </nav>
      </div>
    </>
  );
}

export default SideDrawer;
