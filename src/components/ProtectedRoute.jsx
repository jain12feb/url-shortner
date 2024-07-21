/* eslint-disable react/prop-types */

import { UrlState } from "@/context";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  const { loading, isAuthenticated } = UrlState();

  useEffect(() => {
    if (!isAuthenticated && loading === false) navigate("/auth");
  }, [isAuthenticated, loading]);

  if (loading)
    return (
      <Loader
        className="flex justify-center items-center animate-spin stroke-yellow-700 h-[72.8vh] mx-auto"
        size={100}
      />
    );

  if (isAuthenticated) return children;
};

export default ProtectedRoute;
