import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useSearchParams } from "react-router-dom";
import Login from "@/components/Login";
import Register from "@/components/Register";
import { UrlState } from "@/context";

const Auth = () => {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = UrlState();
  const longLink = searchParams.get("createNew");

  useEffect(() => {
    if (isAuthenticated && !loading)
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
  }, [isAuthenticated, loading, navigate]);
  return (
    <div className="flex flex-col items-center gap-y-8 mt-8">
      <h1 className="text-2xl md:text-5xl text-center font-extrabold text-yellow-400 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        {searchParams.get("createNew")
          ? "Hold up! Let's login first 🔐"
          : "Onboarding with Trimrr"}
      </h1>
      <div>
        <Tabs defaultValue="sign-in" className="w-[400px] md:w-[500px]">
          <TabsList className="grid w-full h-16 grid-cols-2 bg-yellow-200 text-yellow-600 rounded-full">
            <TabsTrigger
              className="rounded-full h-12 text-lg font-bold"
              value="sign-in"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              className="rounded-full h-12 text-lg font-bold"
              value="sign-up"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <Login />
          </TabsContent>
          <TabsContent value="sign-up">
            <Register />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
