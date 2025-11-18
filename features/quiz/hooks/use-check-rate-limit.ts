import React from "react";
import { checkQuizLimit } from "../actions";
import { RateLimitInfo } from "../lib/types";

export function useCheckRateLimit() {
  const [rateLimitInfo, setRateLimitInfo] =
    React.useState<RateLimitInfo | null>(null);

  // Check rate limit on mount
  React.useEffect(() => {
    async function checkLimit() {
      const result = await checkQuizLimit();
      if (result.success) {
        setRateLimitInfo(result.data);
      }
    }
    checkLimit();
  }, []);

  return rateLimitInfo;
}
