import { supabase } from "@/integrations/supabase/client";

/**
 * Check if Supabase is reachable and responsive
 */
export const checkSupabaseHealth = async (): Promise<boolean> => {
  try {
    // Simple health check - just try to get the current timestamp
    const { data, error } = await supabase
      .from("purchases") // Use any table that exists
      .select("count")
      .limit(1)
      .single();

    // Even if we get an auth error, it means Supabase is reachable
    if (
      error &&
      !error.message.includes("JWT") &&
      !error.message.includes("auth")
    ) {
      return false;
    }

    return true;
  } catch (error) {
    console.warn("Supabase health check failed:", error);
    return false;
  }
};

/**
 * Check if we should attempt API calls based on connectivity
 */
export const shouldAttemptApiCall = async (retries = 1): Promise<boolean> => {
  // First check if browser is online
  if (!navigator.onLine) {
    console.debug("Browser is offline, skipping API call");
    return false;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(supabase.supabaseUrl + "/rest/v1/", {
        method: "HEAD",
        mode: "no-cors",
        signal: controller.signal,
        cache: "no-cache",
      });

      clearTimeout(timeoutId);
      return true;
    } catch (error: any) {
      // Only log on final attempt to reduce noise
      if (attempt === retries) {
        // Handle different types of network errors silently
        if (error.name === "AbortError" || error.name === "TimeoutError") {
          console.debug("Network connectivity check timed out after retries");
        } else if (
          error.message?.includes("Failed to fetch") ||
          error.message?.includes("NetworkError")
        ) {
          console.debug(
            "Network connectivity check failed - offline or network issues",
          );
        } else {
          console.debug("Connectivity check failed:", error.message);
        }
      }

      // Wait a bit before retrying (only if not the last attempt)
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  return false;
};
