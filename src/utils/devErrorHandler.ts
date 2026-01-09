/**
 * Development environment error handling utilities
 */

/**
 * Handle Vite HMR connection errors gracefully
 */
export const handleViteHMRErrors = () => {
  if (import.meta.env.DEV) {
    // Override console.error to filter out known HMR connection issues
    const originalConsoleError = console.error;

    console.error = (...args) => {
      const message = args.join(" ").toLowerCase();

      // Filter out known development-only errors that don't affect functionality
      const isDevelopmentOnlyError =
        (message.includes("failed to fetch") && message.includes("vite")) ||
        (message.includes("failed to fetch") &&
          message.includes("supabasehealth")) ||
        (message.includes("failed to fetch") &&
          message.includes("shouldattemptapicall")) ||
        (message.includes("failed to fetch") && message.includes("resumes")) ||
        (message.includes("failed to fetch") &&
          message.includes("purchases")) ||
        (message.includes("failed to fetch") &&
          message.includes("downloaded")) ||
        message.includes("hmr") ||
        message.includes("fullstory") ||
        (message.includes("websocket") && message.includes("ping"));

      if (!isDevelopmentOnlyError) {
        originalConsoleError.apply(console, args);
      }
    };

    // Handle unhandled rejections that might be from HMR
    window.addEventListener("unhandledrejection", (event) => {
      const error = event.reason;
      if (error instanceof Error) {
        const message = error.message.toLowerCase();

        // Suppress known development errors
        if (
          message.includes("failed to fetch") &&
          (message.includes("vite") ||
            message.includes("hmr") ||
            message.includes("supabase") ||
            message.includes("shouldattemptapicall") ||
            message.includes("resumes") ||
            message.includes("purchases") ||
            message.includes("downloaded"))
        ) {
          event.preventDefault();
          console.debug(
            "Suppressed network connectivity error:",
            error.message,
          );
        }
      }
    });
  }
};

/**
 * Handle global fetch errors for development
 */
export const handleGlobalFetchErrors = () => {
  if (import.meta.env.DEV) {
    // Override fetch to catch and handle errors more gracefully
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        return await originalFetch(...args);
      } catch (error: any) {
        // Suppress noisy network errors in development
        if (
          error.message?.includes("Failed to fetch") &&
          (args[0]?.toString().includes("supabase") ||
            args[0]?.toString().includes("/rest/v1/"))
        ) {
          console.debug(
            "Network connectivity issue (suppressed):",
            error.message,
          );
          throw error; // Still throw so the calling code can handle it
        }
        throw error;
      }
    };
  }
};

/**
 * Handle global network error suppression
 */
export const handleGlobalNetworkErrors = () => {
  // Add global error event listener
  window.addEventListener("error", (event) => {
    const error = event.error;
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (
        message.includes("failed to fetch") &&
        (message.includes("resumes") ||
          message.includes("purchases") ||
          message.includes("downloaded") ||
          message.includes("supabase"))
      ) {
        event.preventDefault();
        console.debug("Suppressed global network error:", error.message);
      }
    }
  });
};

/**
 * Initialize development error handling
 */
export const initDevErrorHandling = () => {
  if (import.meta.env.DEV) {
    handleViteHMRErrors();
    handleGlobalFetchErrors();
    handleGlobalNetworkErrors();

    // Log that dev error handling is active
    console.log("Development error handling initialized");
  }
};
