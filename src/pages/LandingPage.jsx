import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "lucide-react";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const [typedText, setTypedText] = useState("");

  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${longUrl}`);
  };

  useEffect(() => {
    const text = "Enter your long URL here...";
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index <= text.length) {
        setTypedText(text.substring(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1 className="my-5 sm:my-8 text-4xl md:text-6xl text-yellow-400 drop-shadow-[0_1.0px_1.0px_rgba(0,0,0,0.8)] text-center font-extrabold">
        The Only <br className="md:hidden" />
        <span className="text-yellow-400 text-5xl md:text-7xl drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)]">
          URL Shortener
        </span>
        <br /> you&rsquo;ll Ever Need!👇
      </h1>
      <h2 className="mb-5 sm:mb-8 text-xl md:text-xl text-yellow-500 text-center font-bold">
        Simplify sharing and tracking of your links with our powerful URL
        shortening service.
        <br /> Shorten Your Links, Amplify Your Reach
      </h2>
      <form
        onSubmit={handleShorten}
        className="h-16 flex w-full md:w-3/4 bg-yellow-200 rounded-full outline-dotted outline-yellow-500"
      >
        <Input
          type="url"
          placeholder={typedText}
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="font-semibold rounded-full h-full flex-1 py-4 px-4 text-base bg-yellow-200 text-yellow-900 placeholder:text-yellow-600 ring-0 focus:ring-0 shadow-none focus:shadow-none focus:outline-none border-none focus:border-none "
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
        src="/banner1.jpg" // replace with 2 for small screens
        className="w-[75%] my-11 rounded-md hidden md:block shadow-yellow-300 shadow-2xl"
        alt="Banner 1"
      />
      <img
        src="/banner2.jpg" // replace with 2 for small screens
        className="my-11 rounded-md block md:hidden shadow-yellow-300 shadow-2xl"
        alt="Banner 2"
      />
      <Accordion
        type="single"
        collapsible
        className="w-[400px] md:w-[900px] px-3 md:px-12"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-yellow-700">
            How does the Trimrr URL shortener work?
          </AccordionTrigger>
          <AccordionContent className="text-yellow-600">
            Trimrr generates short URLs for your long links. These shorter URLs
            are easier to share and manage, redirecting users seamlessly to the
            original long URL.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-yellow-700">
            Do I need an account to use the service?
          </AccordionTrigger>
          <AccordionContent className="text-yellow-600">
            Yes, creating an account with Trimrr allows you to track analytics,
            customize your shortened URLs, and manage your links effectively.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-yellow-700">
            What analytics are available for shortened URLs?
          </AccordionTrigger>
          <AccordionContent className="text-yellow-600">
            Trimrr provides detailed analytics including click counts,
            geolocation data of the clicks, and device type statistics (mobile
            vs desktop) for each shortened URL you create.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LandingPage;
