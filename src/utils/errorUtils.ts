/**
 * Utility functions for consistent error handling across the application
 */

/**
 * Extracts a meaningful error message from various error types
 * @param error - The error object, string, or unknown value
 * @param fallback - Fallback message if no meaningful message can be extracted
 * @returns A string error message
 */
export const getErrorMessage = (
  error: unknown,
  fallback = "Unknown error occurred",
): string => {
  // Handle Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Handle objects with message property
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as any).message;
    if (typeof message === "string") {
      return message;
    }
  }

  // Handle network/fetch errors that might have special properties
  if (error && typeof error === "object") {
    // Check for common error properties
    const errorObj = error as any;

    if (errorObj.code && errorObj.details) {
      return `${errorObj.code}: ${errorObj.details}`;
    }

    if (errorObj.error_description) {
      return errorObj.error_description;
    }

    if (errorObj.statusText) {
      return errorObj.statusText;
    }
  }

  return fallback;
};

/**
 * Logs an error with consistent formatting
 * @param context - Context string describing where the error occurred
 * @param error - The error to log
 * @param additionalInfo - Optional additional information to log
 */
export const logError = (
  context: string,
  error: unknown,
  additionalInfo?: any,
): void => {
  const errorMessage = getErrorMessage(error);

  // Handle timeout errors with more appropriate logging level
  if (
    errorMessage.includes("timeout") ||
    errorMessage.includes("TimeoutError") ||
    (error instanceof Error && error.name === "TimeoutError")
  ) {
    console.warn(
      `${context}: Operation timed out (this may be due to slow network or device performance)`,
    );
    return;
  }

  console.error(`${context}: ${errorMessage}`);

  if (process.env.NODE_ENV === "development") {
    console.debug("Full error object:", error);
    if (additionalInfo) {
      console.debug("Additional info:", additionalInfo);
    }
  }
};

/**
 * Creates a user-friendly error message for display in toasts/UI
 * @param context - Context describing the operation that failed
 * @param error - The error that occurred
 * @returns A formatted error message for display
 */
export const formatUserErrorMessage = (
  context: string,
  error: unknown,
): string => {
  const errorMessage = getErrorMessage(error);

  // Handle common network errors
  if (
    errorMessage.includes("Failed to fetch") ||
    errorMessage.includes("Network request failed") ||
    errorMessage.includes("fetch is not defined") ||
    errorMessage.includes("TypeError: Failed to fetch") ||
    errorMessage.includes("NetworkError") ||
    errorMessage.includes("ERR_NETWORK") ||
    errorMessage.includes("ERR_INTERNET_DISCONNECTED")
  ) {
    return `${context}: Network connection error. Please check your internet connection and try again.`;
  }

  // Handle authentication errors
  if (
    errorMessage.includes("unauthorized") ||
    errorMessage.includes("authentication")
  ) {
    return `${context}: Authentication error. Please sign in again.`;
  }

  // Handle timeout errors
  if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
    return `${context}: Request timed out. Please try again.`;
  }

  // Handle CORS errors
  if (errorMessage.includes("CORS") || errorMessage.includes("cross-origin")) {
    return `${context}: Connection error. Please try refreshing the page.`;
  }

  // Handle general connection errors
  if (
    errorMessage.includes("connection") ||
    errorMessage.includes("ERR_NETWORK")
  ) {
    return `${context}: Connection error. Please check your internet connection.`;
  }

  return `${context}: ${errorMessage}`;
};
