import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "lucide-react";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${longUrl}`);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="my-10 sm:my-16 text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-yellow-400 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-center font-extrabold">
        The only URL Shortener <br /> you&rsquo;ll ever need! 👇
      </h1>
      <form
        onSubmit={handleShorten}
        className="h-16 flex w-full md:w-3/4 bg-yellow-200 rounded-full outline-dotted outline-yellow-500"
      >
        <Input
          type="url"
          placeholder="Enter loooong URL here..."
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="font-semibold rounded-full h-full flex-1 py-4 px-4 text-xs md:text-base  bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none "
        />
        <Button
          disabled={!longUrl}
          type="submit"
          className="rounded-full h-full bg-yellow-300 text-yellow-900 border-l-2 border-yellow-500 hover:bg-yellow-500 hover:text-yellow-950"
        >
          <span className="text-base">Shorten!</span>
          <Link className="ml-2" />
        </Button>
      </form>
      <img
        src="/banner1.jpg" // replace with 2 in small screens
        className="w-[75%] my-11 rounded-md hidden md:block shadow-yellow-300 shadow-2xl"
      />
      <img
        src="/banner2.jpg" // replace with 2 in small screens
        className="my-11 rounded-md block md:hidden shadow-yellow-300 shadow-2xl"
      />
      <Accordion
        type="single"
        collapsible
        className="w-[425px] md:w-[900px] px-3 md:px-11 "
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-yellow-700">
            How does the Trimrr URL shortener works?
          </AccordionTrigger>
          <AccordionContent className="text-yellow-600">
            When you enter a long URL, our system generates a shorter version of
            that URL. This shortened URL redirects to the original long URL when
            accessed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-yellow-700">
            Do I need an account to use the app?
          </AccordionTrigger>
          <AccordionContent className="text-yellow-600">
            Yes. Creating an account allows you to manage your URLs, view
            analytics, and customize your short URLs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-yellow-700">
            What analytics are available for my shortened URLs?
          </AccordionTrigger>
          <AccordionContent className="text-yellow-600">
            You can view the number of clicks, geolocation data of the clicks
            and device types (mobile/desktop) for each of your shortened URLs.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LandingPage;
