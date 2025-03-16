import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";

const Layout = () => {
  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 p-8">
        <Outlet /> 
      </div>
    </div>
  );
};

export default Layout;