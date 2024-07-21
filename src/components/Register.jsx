import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signup } from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";
import Error from "./Error";
import { LoaderPinwheel, SquareUserRound, X } from "lucide-react";
import { UrlState } from "@/context";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Register = () => {
  const [pp, setPp] = useState(null);
  const { fetchUser, user } = UrlState();
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));

    const file = files[0];

    if (file) {
      let reader = new FileReader();
      reader.onload = (ev) => {
        setPp(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { loading, error, fn: fnSignup, data } = useFetch(signup, formData);

  useEffect(() => {
    if (error === null && data) {
      fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, loading]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        profile_pic: Yup.mixed().required("Profile picture is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnSignup();
    } catch (error) {
      const newErrors = {};
      if (error?.inner) {
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });

        setErrors(newErrors);
      } else {
        setErrors({ api: error.message });
      }
    }
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-yellow-700">Create an account</CardTitle>
        <CardDescription className="text-yellow-600">
          Enter your email & password below to create your account. Click
          Register when you&apos;re done.
        </CardDescription>
        {error && <Error message={error?.message} />}
      </CardHeader>
      <form onSubmit={handleSignup}>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Input
              type="name"
              name="name"
              className="font-medium rounded-full h-full flex-1 p-4 text-base bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none "
              placeholder="John Dae"
              onChange={handleInputChange}
            />
          </div>
          {errors.name && (
            <span className="text-sm text-destructive ml-5">{errors.name}</span>
          )}
          <div className="space-y-1">
            <Input
              type="email"
              name="email"
              className="font-medium rounded-full h-full flex-1 p-4 text-base bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none "
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
              type="password"
              name="password"
              className="font-medium rounded-full h-full flex-1 p-4 text-base  bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none "
              placeholder="********"
              onChange={handleInputChange}
            />
          </div>
          {errors.password && (
            <span className="text-sm text-destructive ml-5">
              {errors.password}
            </span>
          )}
          <div className="space-y-1">
            <div className="font-medium cursor-pointer rounded-full h-[60px] flex-1 flex justify-between items-center px-4 py-2 text-base bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none ">
              <label
                htmlFor="profile_pic"
                className="flex justify-start items-center gap-2 cursor-pointer w-full"
              >
                {formData.profile_pic ? (
                  <Avatar>
                    <AvatarImage src={pp} className="object-contain" />
                    <AvatarFallback>PP</AvatarFallback>
                  </Avatar>
                ) : (
                  <SquareUserRound className="h-8 w-8" />
                )}
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 fill-white stroke-yellow-700"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg> */}
                <span className="text-yellow-700">
                  {formData.profile_pic
                    ? "Change Profile Picture"
                    : "Upload Profile Picture"}
                </span>
                <input
                  id="profile_pic"
                  name="profile_pic"
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </label>

              {formData.profile_pic && (
                <X
                  className="cursor-pointer"
                  color="red"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, profile_pic: null }));
                    const pp = document.getElementById("profile_pic");
                    pp.value = null;
                    // pp.click();
                  }}
                />
              )}
            </div>
            {/* <Input
              name="profile_pic"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="cursor-pointer rounded-full h-full flex-1 p-4 text-base bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none "
            /> */}
          </div>
          {errors.profile_pic && (
            <span className="text-sm text-destructive ml-5">
              {errors.profile_pic}
            </span>
          )}
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <Button
            disabled={loading}
            type="submit"
            className="rounded-full h-16 w-full text-lg font-bold bg-yellow-300 text-yellow-900 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-yellow-950"
          >
            {loading ? (
              <LoaderPinwheel className="animate-spin" />
            ) : (
              "Register Now"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Register;
