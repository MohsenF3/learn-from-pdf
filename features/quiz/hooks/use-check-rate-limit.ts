import { tryCatch } from "@/lib/try-catch";
import * as React from "react";
import { RateLimitInfo } from "../lib/types";

export function useCheckRateLimit() {
  const [rateLimitInfo, setRateLimitInfo] =
    React.useState<RateLimitInfo | null>(null);

  React.useEffect(() => {
    let active = true;

    async function load() {
      const [data, error] = await tryCatch(
        fetch("/api/check-limit", { cache: "no-store" })
      );

      if (error) {
        return;
      }

      const result = await data.json();

      if (result.success && active) {
        setRateLimitInfo(result.data);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  return rateLimitInfo;
}
