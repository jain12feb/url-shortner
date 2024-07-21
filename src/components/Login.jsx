import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Error from "./Error";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { login } from "@/db/apiAuth";
import * as Yup from "yup";
import { UrlState } from "@/context";
import { LoaderPinwheel } from "lucide-react";

const Login = () => {
  const { fetchUser, user } = UrlState();

  const navigate = useNavigate();

  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { loading, error, fn: fnLogin, data } = useFetch(login, formData);

  useEffect(() => {
    if (user) navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    if (error === null && data) {
      fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data, user]);

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });

      await schema.validate(formData, { abortEarly: false });

      await fnLogin();
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };
  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-yellow-700">Login to your account</CardTitle>
        <CardDescription className="text-yellow-600">
          Enter your email & password below to login to your account. After sign
          in, you&apos;ll be logged in.
        </CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Input
              name="email"
              className="font-medium rounded-full h-full flex-1 p-4 text-base  bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none "
              type="email"
              placeholder="john.dae@example.com"
              onChange={handleInputChange}
            />
          </div>
          {errors.email && (
            <span className="text-sm text-destructive ml-5">
              {errors.email}
            </span>
          )}
          <div className="space-y-1">
            <Input
              name="password"
              className="font-medium rounded-full h-full flex-1 p-4 text-base  bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none "
              type="password"
              placeholder="********"
              onChange={handleInputChange}
            />
          </div>
          {errors.password && (
            <span className="text-sm text-destructive ml-5">
              {errors.password}
            </span>
          )}
          {/* {errors.password && <Error message={errors.password} />} */}
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <Button
            //   onClick={handleLogin}
            type="submit"
            disabled={loading}
            className="rounded-full h-16 w-full text-lg font-bold bg-yellow-300 text-yellow-900 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-yellow-950"
          >
            {loading ? <LoaderPinwheel className="animate-spin" /> : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;
