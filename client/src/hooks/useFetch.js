import { useEffect, useState } from "react";
import api from "../services/api";

// Loads data from the API when a page opens.
// ignore404: treat "not found" as "nothing saved yet" instead of an error.
export default function useFetch(url, { ignore404 = false } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    api
      .get(url)
      .then((res) => {
        if (!active) return;
        setData(res.data);
        setError("");
      })
      .catch((err) => {
        if (!active) return;
        if (ignore404 && err.response?.status === 404) {
          setData(null);
          setError("");
        } else {
          setError(err.response?.data?.message || "Something went wrong. Try again.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [url, ignore404, tick]);

  const reload = () => {
    setLoading(true);
    setTick((t) => t + 1);
  };

  return { data, setData, loading, error, reload };
}
