import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Error from "@/components/Error";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { QRCode } from "react-qrcode-logo";
import { UrlState } from "@/context";
import { createUrl } from "@/db/apiUrl";
import { Link, Loader } from "lucide-react";

function CreateLink() {
  const { user } = UrlState();

  const navigate = useNavigate();
  const ref = useRef();

  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
    short_url: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
      short_url: Math.random().toString(36).substr(2, 6),
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...formValues, user_id: user.id });

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const createNewLink = async () => {
    setErrors([]);
    try {
      await schema.validate(formValues, { abortEarly: false });

      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      await fnCreateUrl(blob);
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) {
          setSearchParams({});
          setFormValues({
            ...formValues,
            title: "",
            longUrl: "",
            short_url: "",
          });
          setErrors({
            title: null,
            longUrl: null,
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="rounded-full h-12 text-lg font-bold bg-yellow-300 text-yellow-900 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-yellow-950">
          Create New <Link className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            Create New Shorten Url
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center">
          {formValues?.longUrl && (
            <QRCode
              ref={ref}
              size={200}
              value={`${import.meta.env.VITE_BASE_URL}/${
                formValues.customUrl || formValues?.short_url
              }`}
              bgColor="yellow"
              fgColor="rgb(162, 98, 7)"
              ecLevel="M"
              qrStyle="dots"
            />
          )}
        </div>

        <Input
          className="font-medium rounded-full h-full flex-1 p-4 text-base  bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none "
          id="title"
          placeholder="Short Link's Title"
          value={formValues.title}
          onChange={handleChange}
        />
        {errors.title && (
          <span className="text-sm text-destructive ml-5 -mt-3">
            {errors.title}
          </span>
        )}
        <Input
          className="font-medium rounded-full h-full flex-1 p-4 text-base  bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none "
          id="longUrl"
          placeholder="Enter your Loooong URL"
          value={formValues.longUrl}
          onChange={handleChange}
        />
        {errors.longUrl && (
          <span className="text-sm text-destructive ml-5 -mt-3">
            {errors.longUrl}
          </span>
        )}

        {/* <Input
          className="font-medium rounded-full h-full flex-1 p-4 text-base  bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none "
          id="short_url"
          value={formValues.short_url}
          onChange={handleChange}
        />
        {errors.short_url && (
          <span className="text-sm text-destructive ml-5 -mt-3">
            {errors.short_url}
          </span>
        )} */}

        <div className="flex rounded-full h-full flex-1 p-4 text-base  bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none ">
          <span className="inline-flex items-center font-bold">trimrr.in/</span>
          <input
            value={formValues.customUrl}
            onChange={handleChange}
            type="text"
            id="customUrl"
            name="customUrl"
            className="font-medium rounded-full h-full bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none "
            placeholder=" custom url"
          />
        </div>
        {error && <Error message={errors.message} />}
        <DialogFooter className="sm:justify-start flex flex-row gap-x-2 mt-2">
          <DialogClose asChild>
            <Button
              type="button"
              className="rounded-md h-10 w-full text-lg font-bold bg-neutral-100 text-yellow-900 border-2 border-yellow-500 hover:bg-yellow-300 hover:text-yellow-950"
              onClick={() => {
                setFormValues({
                  ...formValues,
                  title: "",
                  longUrl: "",
                  short_url: "",
                });
                setErrors({
                  title: null,
                  longUrl: null,
                });
              }}
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            className=" h-10 w-full text-lg font-bold bg-yellow-400 text-yellow-900 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-yellow-950"
            onClick={createNewLink}
            disabled={loading}
          >
            {loading ? <Loader size={10} color="white" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLink;
