import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX, FiFileText, FiUsers } from "react-icons/fi";

export default function Sidebar() {
  const tabs = [
    { to: "post", label: "Bài viết", icon: <FiFileText className="mr-2" /> },
    { to: "group", label: "Nhóm", icon: <FiUsers className="mr-2" /> },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-24 left-4 z-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded"
        aria-label="Mở menu"
      >
        <FiMenu size={28} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-white w-64 z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:hidden shadow-lg`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Đóng menu"
            className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded"
          >
            <FiX size={28} />
          </button>
        </div>
        <nav className="flex flex-col space-y-2 p-4">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md font-medium focus:outline-none transition-all ${isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              {tab.icon}
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <aside className="hidden md:flex md:flex-col md:w-64 md:h-screen bg-white border-r border-gray-300 p-4">
        <nav className="flex flex-col space-y-2">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex items-center text-left px-4 py-2 rounded-md font-medium focus:outline-none transition-all ${isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              {tab.icon}
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
