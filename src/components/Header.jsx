import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Sparkles, Undo2 } from "lucide-react";
import UserButton from "./UserButton";
import { UrlState } from "@/context";

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = UrlState();

  return (
    <nav className="h-18 w-full px-8 py-1 mt-2 flex justify-between items-center">
      {/* bg-gray-800 w-[400px] md:w-[700px] lg:w-[900px] rounded-full mt-2  */}
      <Link to="/">
        <img src="/logo.png" className="w-24" alt="logo" />
      </Link>
      <div>
        {user ? (
          <UserButton name={user?.name} email={user?.email} />
        ) : (
          <Button
            onClick={() =>
              pathname === "/auth" ? navigate("/") : navigate("/auth")
            }
            variant="ghost"
            className="h-14 border-2 font-bold text-base outline-dotted hover:outline-dashed bg-yellow-300 border-none rounded-full  hover:bg-yellow-400 text-slate-900"
          >
            {pathname === "/auth" ? "Back to Home" : "Get Started"}
            {pathname != "/auth" ? (
              <Sparkles className="ml-3 fill-yellow-500" />
            ) : (
              <Undo2 className="ml-2" />
            )}
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Header;
