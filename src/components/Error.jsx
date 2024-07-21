/* eslint-disable react/prop-types */

import { AlertTriangle, Cross, X } from "lucide-react";
import { useEffect, useState } from "react";

const Error = ({ message }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => setOpen(false), 5000);

    return () => clearTimeout(timerId);
  }, []);

  if (!open) return null;

  return (
    <div className="flex justify-between items-center p-3 border rounded-md bg-destructive text-white font-semibold">
      <div className="flex gap-x-2 items-center justify-center">
        <AlertTriangle />
        <span>{message}</span>
      </div>
      <X className="cursor-pointer" onClick={() => setOpen(false)} />
    </div>
  );
};

export default Error;
