import React, { useState } from "react";
import {
  Home,
  Calendar,
  Users,
  DollarSign,
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Features/authSlice";
import { toast, Bounce } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch authentication state from Redux store
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const navItems = [
    { icon: <Home className="w-5 h-5" />, title: "Home", path: "/" },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Appointments",
      path: "/appointments",
    },
    { icon: <Users className="w-5 h-5" />, title: "Clients", path: "/clients" },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Finance",
      path: "/finance",
    },
  ];

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      const response = await fetch("http://localhost:4000/api/auth/logout-user", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status >= 400 && response.status < 500) {
        const error = await response.json();
        toast.error(error.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        return;
      }

      const data = await response.json();
      toast.success("Logged out successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

      // Dispatch logout action to reset Redux state
      dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Redirect to login page
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Server Error - Please Try again later.");
    }
  };

  const NavItems = () => (
    <>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-2 rounded transition-colors duration-200 ${
                  isActive ? "bg-indigo-600" : "hover:bg-indigo-600"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-10 border-t border-indigo-600">
        {isAuthenticated ? (
          <>
            <div className="mb-4">
              <p className="text-sm text-indigo-200">Signed in as</p>
              <p className="font-medium">{user?.name || "User"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center p-2 w-full rounded transition-colors duration-200 hover:bg-indigo-600"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center p-2 w-full rounded transition-colors duration-200 hover:bg-indigo-600"
            >
              <LogIn className="w-5 h-5 mr-3" />
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center p-2 w-full rounded transition-colors duration-200 hover:bg-indigo-600"
            >
              <UserPlus className="w-5 h-5 mr-3" />
              Sign Up
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <nav className="hidden md:block w-64 bg-indigo-500 text-white min-h-screen fixed left-0 top-0 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">Clinic Management</h1>
        <NavItems />
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-500 text-white p-4 fixed w-full top-0 left-0 z-20 h-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-indigo-600 rounded transition-colors duration-200 mr-4"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <h1 className="text-xl font-bold">Clinic Management</h1>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10">
          {/* Overlay Background */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Mobile Menu */}
          <nav className="fixed left-0 top-0 w-64 bg-indigo-500 text-white h-screen p-6 pt-20 flex flex-col z-20">
            <NavItems />
          </nav>
        </div>
      )}

      {/* Main Content Container */}
      <div className="flex-1 md:ml-64">
        {/* Mobile Header Spacing */}
        <div className="h-16 md:hidden" />
        <div className="p-6">
          {/* Your page content goes here */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;