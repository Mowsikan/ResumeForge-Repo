import html2canvas from "html2canvas";

interface ImageDownloadOptions {
  filename?: string;
  format?: "png" | "jpeg";
  quality?: number;
  scale?: number;
}

export const downloadResumeAsImage = async (
  element: HTMLElement,
  options: ImageDownloadOptions = {},
): Promise<void> => {
  const {
    filename = "resume",
    format = "png",
    quality = 0.98,
    scale = 2,
  } = options;

  try {
    // Hide watermarks temporarily
    const watermarkElements = element.querySelectorAll(
      ".absolute.inset-0.pointer-events-none, .absolute.top-1\\/4, .absolute.bottom-1\\/4",
    );
    watermarkElements.forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });

    // Use desktop canvas generation approach for all devices to preserve colors correctly
    const isMobile = window.innerWidth < 768;
    const standardScale = 2; // Use consistent scale for both mobile and desktop

    // Check if element is visible and has dimensions
    const elementRect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);

    // Store original styles to restore later
    const originalDisplay = element.style.display;
    const originalVisibility = element.style.visibility;
    const originalPosition = element.style.position;
    const originalZIndex = element.style.zIndex;
    const originalTop = element.style.top;
    const originalLeft = element.style.left;
    const originalWidth = element.style.width;
    const originalHeight = element.style.height;

    // Check if element or its parent container is hidden
    let parentElement = element.parentElement;
    const originalParentStyles: Array<{
      element: HTMLElement;
      display: string;
      visibility: string;
    }> = [];

    // Walk up the DOM tree and make parent elements visible if needed
    while (parentElement && parentElement !== document.body) {
      const parentComputedStyle = window.getComputedStyle(parentElement);
      if (
        parentComputedStyle.display === "none" ||
        parentComputedStyle.visibility === "hidden"
      ) {
        originalParentStyles.push({
          element: parentElement,
          display: parentElement.style.display,
          visibility: parentElement.style.visibility,
        });
        parentElement.style.display = "block";
        parentElement.style.visibility = "visible";
      }
      parentElement = parentElement.parentElement;
    }

    // Force element to be visible if needed
    let needsRestore = false;
    if (
      computedStyle.display === "none" ||
      computedStyle.visibility === "hidden" ||
      elementRect.width === 0 ||
      elementRect.height === 0
    ) {
      element.style.display = "block";
      element.style.visibility = "visible";
      element.style.position = "absolute";
      element.style.top = "-9999px"; // Position off-screen so user doesn't see it
      element.style.left = "-9999px";
      element.style.zIndex = "-1";

      // Force standard A4 dimensions for all devices to ensure consistency
      element.style.width = "210mm"; // A4 width
      element.style.height = "auto"; // Let height be calculated automatically
      element.style.minHeight = ""; // Remove any min-height constraints
      element.style.maxHeight = ""; // Remove any max-height constraints

      needsRestore = true;

      // Give DOM time to recalculate layout
      await new Promise((resolve) => setTimeout(resolve, 150)); // Slightly longer wait for consistency
    }

    // Get final computed dimensions after layout
    const finalRect = element.getBoundingClientRect();

    // Use standardized canvas generation for consistent output across all devices
    let canvas;
    try {
      canvas = await html2canvas(element, {
        scale: standardScale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        removeContainer: true,
        imageTimeout: 45000, // Increased timeout for slow devices (45 seconds)
        width: Math.ceil(finalRect.width),
        height: Math.ceil(finalRect.height),
        scrollX: 0,
        scrollY: 0,
        logging: false,
      });
    } catch (error) {
      // If canvas generation times out, try with reduced settings
      if (error.message?.includes("timeout") || error.name === "TimeoutError") {
        console.warn(
          "Canvas generation timed out, retrying with reduced settings...",
        );
        canvas = await html2canvas(element, {
          scale: 1, // Reduced scale for faster processing
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          removeContainer: true,
          imageTimeout: 60000, // Extended timeout for retry (60 seconds)
          width: Math.ceil(finalRect.width),
          height: Math.ceil(finalRect.height),
          scrollX: 0,
          scrollY: 0,
          logging: false,
        });
      } else {
        throw error;
      }
    }

    // Restore all original styles
    if (needsRestore) {
      element.style.display = originalDisplay;
      element.style.visibility = originalVisibility;
      element.style.position = originalPosition;
      element.style.zIndex = originalZIndex;
      element.style.top = originalTop;
      element.style.left = originalLeft;
      element.style.width = originalWidth;
      element.style.height = originalHeight;
    }

    // Restore parent elements' original styles
    originalParentStyles.forEach(
      ({ element: parentEl, display, visibility }) => {
        parentEl.style.display = display;
        parentEl.style.visibility = visibility;
      },
    );

    // Restore watermarks
    watermarkElements.forEach((el) => {
      (el as HTMLElement).style.display = "";
    });

    // Validate canvas before proceeding
    if (!canvas) {
      throw new Error(
        "Canvas generation failed - html2canvas returned null/undefined",
      );
    }

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error(
        `Canvas generation failed - invalid dimensions: ${canvas.width}x${canvas.height}`,
      );
    }

    console.log(
      `Canvas successfully created: ${canvas.width}x${canvas.height}`,
    );

    // Convert canvas to blob with error handling
    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";

    // Use Promise-based approach for better error handling
    const blob = await new Promise<Blob | null>((resolve, reject) => {
      try {
        canvas.toBlob(
          (result) => {
            if (!result) {
              reject(
                new Error(
                  "Canvas toBlob returned null - likely due to mobile memory constraints",
                ),
              );
              return;
            }
            resolve(result);
          },
          mimeType,
          quality,
        );
      } catch (error) {
        reject(
          new Error(
            `Canvas toBlob failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          ),
        );
      }
    });

    if (!blob) {
      throw new Error("Failed to generate image blob");
    }

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.${format}`;

    // Trigger download with mobile-specific handling
    document.body.appendChild(link);

    if (isMobile) {
      // For mobile, add a small delay to ensure proper handling
      setTimeout(() => {
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      }, 100);
    } else {
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error("Image download failed:", error);
    throw new Error(
      `Failed to download resume as image: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

export const previewResumeAsImage = async (
  element: HTMLElement,
  options: ImageDownloadOptions = {},
): Promise<string> => {
  const { scale = 1 } = options;

  try {
    // Hide watermarks temporarily
    const watermarkElements = element.querySelectorAll(
      ".absolute.inset-0.pointer-events-none, .absolute.top-1\\/4, .absolute.bottom-1\\/4",
    );
    watermarkElements.forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });

    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      removeContainer: true,
    });

    // Restore watermarks
    watermarkElements.forEach((el) => {
      (el as HTMLElement).style.display = "";
    });

    return canvas.toDataURL("image/png", 0.98);
  } catch (error) {
    console.error("Image preview failed:", error);
    throw new Error("Failed to generate image preview");
  }
};
