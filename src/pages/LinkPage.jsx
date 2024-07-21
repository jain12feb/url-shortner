import React, { useEffect, useState } from "react";
import {
  CheckCheck,
  CircleAlert,
  Copy,
  Download,
  Link2,
  LinkIcon,
  Loader,
  Trash2,
  Undo2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl, getUrl } from "@/db/apiUrl";
import { getClicksForUrl } from "@/db/apiClick";
import { UrlState } from "@/context";
import DeviceStats from "@/components/DeviceStats";
import LocationStats from "@/components/LocationStats";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";
import DateWiseStats from "@/components/DateWiseStats";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CountUp from "react-countup";
import EditLink from "@/components/EditLink";

function generateRandomStats(count) {
  const browsers = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];
  const cities = ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai"];
  const countries = ["India", "USA", "UK", "Australia", "Canada"];
  const deviceTypes = ["desktop", "mobile", "tablet", "others"];
  const operatingSystems = ["Windows", "MacOS", "Linux", "iOS", "Android"];

  const randomStats = [];

  for (let i = 1; i <= count; i++) {
    const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomCountry =
      countries[Math.floor(Math.random() * countries.length)];
    const randomDeviceType =
      deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    const randomOS =
      operatingSystems[Math.floor(Math.random() * operatingSystems.length)];

    const randomCreatedAt = getRandomDate(new Date(2020, 0, 1), new Date());
    const randomIPAddress = getRandomIPAddress();
    const randomLatitude = getRandomCoordinate(-90, 90).toFixed(4);
    const randomLongitude = getRandomCoordinate(-180, 180).toFixed(4);

    const randomRecord = {
      browser: randomBrowser,
      city: randomCity,
      country: randomCountry,
      created_at: randomCreatedAt.toISOString(),
      device_model: null, // You can modify this if needed
      device_type: randomDeviceType,
      id: i,
      ip_address: randomIPAddress,
      latitude: randomLatitude,
      longitude: randomLongitude,
      os: randomOS,
      url_id: i, // You can modify this if needed
    };

    randomStats.push(randomRecord);
  }

  return randomStats;
}

// Helper functions
function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function getRandomIPAddress() {
  return Array.from(Array(4), () => Math.floor(Math.random() * 256)).join(".");
}

function getRandomCoordinate(min, max) {
  return Math.random() * (max - min) + min;
}

// Example usage:
// const randomStatsData = generateRandomStats(1000);

const LinkPage = () => {
  const [copied, setCopied] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [hovering, setHovering] = useState(false);
  const [open, setOpen] = useState(false);

  const downloadImage = () => {
    const imageUrl = url?.qr_code;
    const fileName = url?.title;

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
  const navigate = useNavigate();
  const { user } = UrlState();
  const { id } = useParams();

  const handleMouseEnter = () => {
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  const {
    loading,
    data: url,
    fn: fetchUrl,
    error,
  } = useFetch(getUrl, { id, user_id: user?.id });
  const {
    loading: loadingStats,
    data: stats,
    fn: fetchStats,
  } = useFetch(getClicksForUrl, id);
  const { loading: loadingDelete, fn: deleteLink } = useFetch(deleteUrl, id);

  useEffect(() => {
    fetchUrl();
  }, []);

  useEffect(() => {
    if (!error && !loading) {
      fetchStats();
    }
  }, [loading, error]);

  if (error) {
    console.log(error);
    navigate("/dashboard");
    return null; // Ensure to handle errors gracefully
  }

  const link = url?.custom_url ? url?.custom_url : url?.short_url;

  if (loading || loadingStats) {
    return (
      <Loader
        className="flex justify-center items-center animate-spin stroke-yellow-700 h-[72.8vh] mx-auto"
        size={100}
      />
    );
  }

  return (
    <>
      <div className="flex justify-between items-center my-5">
        <Button
          size="icon"
          variant="icon"
          title="Back to dashboard"
          onClick={() => navigate("/dashboard")}
          // className="my-5 ml-5 sm:ml-10 h-10 text-lg font-bold bg-yellow-400 text-yellow-900 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-yellow-950"
        >
          <Undo2 className="stroke-yellow-900" />
        </Button>
        {loadingDelete ? (
          <Loader className="animate-spin" size={5} color="rgb(161 98 7)" />
        ) : (
          <div className="flex items-center">
            <Button
              title="Delete Short Url"
              size="icon"
              variant="icon"
              onClick={() => setOpen(true)}
              disabled={loadingDelete}
            >
              <Trash2 color="rgb(161 98 7)" />
            </Button>
            <EditLink urlData={url} fetchUrl={fetchUrl} />
          </div>
        )}
      </div>
      <div className="flex gap-8 flex-col justify-between">
        <div className="flex flex-col sm:flex-row justify-around items-center gap-8 rounded-lg sm:w-full">
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl sm:text-7xl font-extrabold text-yellow-700">
              {url?.title}
            </h1>
            <p className="text-base text-yellow-600 font-normal">
              Created At: {moment(new Date(url?.created_at)).calendar()}
            </p>
            <div className="flex items-center gap-x-4">
              <a
                href={BASE_URL + "/" + link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-lg sm:text-2xl text-yellow-600 font-bold hover:underline cursor-pointer "
              >
                <Link2 className="p-1" />
                {BASE_URL + "/" + link}
              </a>
              {copied ? (
                <CheckCheck className="stroke-yellow-600" />
              ) : (
                <Copy
                  className="cursor-pointer stroke-yellow-600"
                  onClick={() => {
                    window.navigator.clipboard.writeText(BASE_URL + "/" + link);
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 2000);
                  }}
                />
              )}
            </div>
            <a
              href={url?.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base sm:text-lg flex items-center gap-1 hover:underline cursor-pointer font-semibold text-yellow-600"
            >
              <LinkIcon className="p-1" />
              {url?.original_url}
            </a>
          </div>
          {/* <div className="flex flex-col justify-between gap-8 bg-yellow-200 text-yellow-700 border-none rounded-3xl"> */}
          <Card className="bg-yellow-200 text-yellow-700 border-none rounded-3xl p-10 sm:p-9 text-center">
            <CardHeader>
              <CardTitle>Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <CountUp
                className="font-semibold text-4xl md:text-5xl"
                end={stats?.length || 0}
              />
            </CardContent>
          </Card>
          {/* </div> */}

          <div
            className="flex flex-col justify-center items-center relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={url?.qr_code}
              className="w-full self-center sm:self-start rounded-lg ring-2 ring-yellow-500 object-contain "
              alt="QR Code"
            />
            {hovering && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-6 bg-white/75 rounded-lg text-yellow-700 h-full w-full justify-center items-center">
                <Download
                  size={40}
                  className="cursor-pointer"
                  onClick={downloadImage}
                />
              </div>
            )}
          </div>
        </div>

        {stats && stats.length ? (
          <>
            <Separator className="my-4 bg-yellow-700" />
            <DateWiseStats stats={stats} />
            <Separator className="my-4 bg-yellow-700" />
            <div className="flex flex-col sm:flex-row gap-2">
              <LocationStats stats={stats} />
              <div className="block md:hidden">
                <Separator className="mb-10 bg-yellow-700" />
              </div>
              <DeviceStats stats={stats} />
            </div>
          </>
        ) : (
          <div>
            {loadingStats === false ? (
              <div className="flex flex-col items-center justify-center gap-3 my-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  data-name="Layer 1"
                  width="147.63626"
                  height="132.17383"
                  viewBox="0 0 647.63626 632.17383"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <path
                    d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z"
                    transform="translate(-276.18187 -133.91309)"
                    // fill="#f2f2f2"
                    fill="rgb(254 240 138)"
                  />
                  <path
                    d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z"
                    transform="translate(-276.18187 -133.91309)"
                    fill="rgb(161 98 7)"
                  />
                  <path
                    d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z"
                    transform="translate(-276.18187 -133.91309)"
                    fill="rgb(161 98 7)"
                  />
                  <circle
                    cx="190.15351"
                    cy="24.95465"
                    r={20}
                    fill="rgb(161 98 7)"
                  />
                  <circle
                    cx="190.15351"
                    cy="24.95465"
                    r="12.66462"
                    fill="#fff"
                  />
                  <path
                    d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z"
                    transform="translate(-276.18187 -133.91309)"
                    // fill="#e6e6e6"
                    fill="rgb(254 240 138)"
                  />
                  <path
                    d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z"
                    transform="translate(-276.18187 -133.91309)"
                    fill="rgb(161 98 7)"
                  />
                  <path
                    d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z"
                    transform="translate(-276.18187 -133.91309)"
                    fill="rgb(161 98 7)"
                  />
                  <circle
                    cx="433.63626"
                    cy="105.17383"
                    r={20}
                    fill="rgb(161 98 7)"
                  />
                  <circle
                    cx="433.63626"
                    cy="105.17383"
                    r="12.18187"
                    fill="#fff"
                  />
                </svg>

                <h1 className="text-4xl font-extrabold text-yellow-700">
                  No Clicks Found
                </h1>
                <p className="text-lg text-yellow-700">
                  Share or visit your short url to see stats
                </p>
              </div>
            ) : (
              <Loader
                className="flex justify-center items-center animate-spin stroke-yellow-700 h-full mx-auto"
                size={100}
              />
            )}
          </div>
        )}
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent className="bg-yellow-50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-yellow-700 flex items-center">
              <CircleAlert className="mr-2" />
              Are you absolutely sure?{" "}
            </AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteLink().then(() => {
                  navigate("/dashboard");
                })
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LinkPage;
