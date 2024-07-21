/* eslint-disable react/prop-types */
import {
  CheckCheck,
  Copy,
  Download,
  Link2,
  LinkIcon,
  Loader,
  CircleAlert,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/db/apiUrl";
import { useState } from "react";
import moment from "moment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const LinkCard = ({ url = [], fetchUrls }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const downloadImage = () => {
    const imageUrl = url?.qr_code;
    const fileName = url?.title; // Desired file name for the downloaded image

    // Create an anchor element
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    // Append the anchor to the body
    document.body.appendChild(anchor);

    // Trigger the download by simulating a click event
    anchor.click();

    // Remove the anchor from the document
    document.body.removeChild(anchor);
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-5 px-4 py-6 bg-yellow-200 rounded-3xl">
        <img
          src={url?.qr_code}
          className="h-40 sm:h-32 object-contain ring ring-yellow-900 rounded"
          alt="qr code"
        />
        <div className="flex flex-col flex-1 gap-1 items-center sm:items-start">
          <Link
            to={`/link/${url?.id}`}
            className="text-3xl font-extrabold hover:underline cursor-pointer text-yellow-700"
          >
            {url?.title}
          </Link>
          <a
            target="_blank"
            href={
              BASE_URL +
              "/" +
              (url?.custom_url ? url?.custom_url : url.short_url)
            }
            className="flex items-center gap-1 font-bold hover:underline cursor-pointer text-yellow-600"
          >
            <Link2 className="p-1" />
            {BASE_URL +
              "/" +
              (url?.custom_url ? url?.custom_url : url.short_url)}
          </a>
          <a
            target="_blank"
            href={url?.original_url}
            className="text-sm flex items-center gap-1 font-semibold hover:underline cursor-pointer text-yellow-600"
          >
            <LinkIcon className="p-1" />
            {url?.original_url}
          </a>
          <span className="flex items-end font-normal text-sm flex-1 text-yellow-700">
            {moment(new Date(url?.created_at)).calendar()}
          </span>
        </div>
        <div className="flex gap-x-5 mt-2">
          {isCopied ? (
            <CheckCheck className="stroke-yellow-700" />
          ) : (
            <div title="Copy Short Url">
              <Copy
                className="cursor-pointer stroke-yellow-700"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${BASE_URL}/${url?.short_url}`
                  );
                  setIsCopied(true);

                  setTimeout(() => {
                    setIsCopied(false);
                  }, 2000);
                }}
              />
            </div>
          )}

          <div title="Download QR Code">
            <Download
              className="cursor-pointer stroke-yellow-700"
              onClick={downloadImage}
            />
          </div>

          {loadingDelete ? (
            <Loader className="animate-spin" size={5} color="rgb(161 98 7)" />
          ) : (
            <div title="Delete Link">
              <Trash2
                className="cursor-pointer stroke-yellow-700"
                // onClick={() => fnDelete().then(() => fetchUrls())}
                onClick={() => setOpen(true)}
                disabled={loadingDelete}
              />
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent className="bg-yellow-50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-yellow-700 flex items-center">
              <CircleAlert className="mr-2" />
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => fnDelete().then(() => fetchUrls())}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LinkCard;
