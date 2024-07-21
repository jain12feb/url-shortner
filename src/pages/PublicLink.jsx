import { storeClicks } from "@/db/apiClick";
import { getLongUrl } from "@/db/apiUrl";
import useFetch from "@/hooks/use-fetch";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const PublicLink = () => {
  const { id } = useParams();

  const { loading, data, fn, error: err1 } = useFetch(getLongUrl, id);

  const {
    loading: loadingStats,
    fn: fnStats,
    error: err2,
  } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  if (err1 || err2) {
    console.log(err1 || err2);
  }

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (loading || loadingStats) {
    return (
      <Loader
        className="flex justify-center items-center animate-spin stroke-yellow-700 min-h-screen mx-auto"
        size={100}
      />
    );
  }

  return null;
};

export default PublicLink;
