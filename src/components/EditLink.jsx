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
import { useState } from "react";
import Error from "@/components/Error";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { UrlState } from "@/context";
import { updateUrl } from "@/db/apiUrl";
import { Loader, Pencil } from "lucide-react";

const EditLink = ({ urlData, fetchUrl }) => {
  const { user } = UrlState();

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: urlData?.title,
    longUrl: urlData?.original_url,
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading: updateLoading,
    error,
    data,
    fn: fnEditUrl,
  } = useFetch(updateUrl, { ...formValues, user_id: user.id, id: urlData?.id });

  const updateLink = async () => {
    setErrors([]);
    try {
      await schema.validate(formValues, { abortEarly: false });

      await fnEditUrl();
      fetchUrl();
      setFormValues({
        title: urlData?.title,
        longUrl: urlData?.original_url,
      });
      //   navigate(0);
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
      onOpenChange={(res) => {
        if (!res) {
          setFormValues({
            title: urlData?.title,
            longUrl: urlData.original_url,
          });
          setErrors({
            title: null,
            longUrl: null,
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          title="Update Short Url"
          size="sm"
          variant="icon"
          // onClick={() => setOpen(true)}
          disabled={updateLoading}
          className="bg-inherit hover:bg-yellow-300 border border-yellow-700 text-yellow-700"
        >
          Modify
          <Pencil color="rgb(161 98 7)" size={16} className="ml-1" />
        </Button>
        {/* <Button className="rounded-full h-12 text-lg font-bold bg-yellow-300 text-yellow-900 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-yellow-950">
          Update
        </Button> */}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            Update Shorten Url
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={updateLink} className="flex flex-col gap-y-3">
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
          {error && <Error message={errors.message} />}
          <DialogFooter className="sm:justify-start flex flex-row gap-x-2 mt-2">
            <DialogClose asChild>
              <Button
                type="button"
                className="rounded-md h-10 w-full text-lg font-bold bg-neutral-100 text-yellow-900 border-2 border-yellow-500 hover:bg-yellow-300 hover:text-yellow-950"
                onClick={() => {
                  setErrors({
                    title: null,
                    longUrl: null,
                  });
                }}
              >
                Close
              </Button>
            </DialogClose>
            {/* <DialogClose asChild> */}
            <Button
              type="submit"
              className=" h-10 w-full text-lg font-bold bg-yellow-400 text-yellow-900 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-yellow-950"
              // disabled={updateLoading}
            >
              {updateLoading ? (
                <>
                  Updating
                  <Loader
                    strokeWidth={3}
                    className="ml-2 animate-spin"
                    size={20}
                    color="rgb(161 98 7)"
                  />
                </>
              ) : (
                "Update"
              )}
            </Button>
            {/* </DialogClose> */}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default EditLink;
