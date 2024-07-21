import Header from "@/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <>
      <div className="flex justify-center items-center">
        <Header />
      </div>
      <main className="container">
        <Outlet />
      </main>
      <div className="p-5 text-center text-yellow-300 bg-gray-800 mt-5 select-none">
        Crafted with 💖 by Prince Jain
      </div>
    </>
  );
};

export default AppLayout;
