/**
 * Network utility functions for improved error handling and resilience
 */
import { getErrorMessage, logError } from "./errorUtils";

/**
 * Checks if an error is a network-related error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("failed to fetch") ||
      message.includes("network request failed") ||
      message.includes("network error") ||
      message.includes("connection") ||
      message.includes("err_network") ||
      message.includes("err_internet_disconnected") ||
      error.name === "NetworkError" ||
      error.name === "TypeError" ||
      (error.name === "TypeError" && message.includes("fetch"))
    );
  }
  return false;
};

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on non-network errors
      if (!isNetworkError(error)) {
        throw error;
      }

      // Don't wait on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s...
      const delay = baseDelay * Math.pow(2, attempt);
      const errorMessage = getErrorMessage(error);

      // Only log retries in development mode to reduce noise
      if (import.meta.env.DEV) {
        console.log(
          `Network request failed (${errorMessage}), retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`,
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Wrapper for Supabase operations with retry logic
 */
// Track failed operations to avoid spam logging
const recentFailures = new Map<string, number>();

export const withNetworkRetry = async <T>(
  operation: () => Promise<T>,
  context: string = "Database operation",
): Promise<T> => {
  try {
    return await retryWithBackoff(operation, 2, 1000);
  } catch (error) {
    // Rate limit error logging to avoid spam
    const now = Date.now();
    const lastFailure = recentFailures.get(context) || 0;

    // Only log if it's been more than 30 seconds since last failure for this context
    if (now - lastFailure > 30000) {
      logError(`${context} failed after retries`, error);
      recentFailures.set(context, now);
    } else {
      // Silent failure - just log to console in dev mode
      if (import.meta.env.DEV) {
        console.debug(`${context} failed (rate limited logging):`, error);
      }
    }

    throw error;
  }
};

/**
 * Completely silent network operation - never throws errors, always returns null on failure
 */
export const withSilentNetworkRetry = async <T>(
  operation: () => Promise<T>,
  context: string = "Database operation",
): Promise<T | null> => {
  try {
    return await retryWithBackoff(operation, 2, 1000);
  } catch (error) {
    // Completely silent - only debug logging in development
    if (import.meta.env.DEV) {
      console.debug(`${context} failed silently:`, error);
    }
    return null;
  }
};

/**
 * Check if the app is online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Add online/offline event listeners
 */
export const addNetworkListeners = (
  onOnline?: () => void,
  onOffline?: () => void,
): (() => void) => {
  const handleOnline = () => {
    console.log("Network connection restored");
    onOnline?.();
  };

  const handleOffline = () => {
    console.log("Network connection lost");
    onOffline?.();
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
};
