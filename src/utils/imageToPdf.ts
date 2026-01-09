import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ImageToPdfOptions {
  filename?: string;
  quality?: number;
  scale?: number;
}

// Generate canvas using the same logic as successful image download
const generateCanvasFromElement = async (
  element: HTMLElement,
  options: ImageToPdfOptions = {},
): Promise<HTMLCanvasElement> => {
  const { quality = 0.98, scale = 2 } = options;

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
        "PDF canvas generation timed out, retrying with reduced settings...",
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
  originalParentStyles.forEach(({ element: parentEl, display, visibility }) => {
    parentEl.style.display = display;
    parentEl.style.visibility = visibility;
  });

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
    `Canvas successfully created for PDF: ${canvas.width}x${canvas.height}`,
  );

  return canvas;
};

export const downloadResumeAsPdfFromImage = async (
  element: HTMLElement,
  options: ImageToPdfOptions = {},
): Promise<void> => {
  const { filename = "resume", quality = 0.98 } = options;

  try {
    // Generate canvas using the same successful approach as image download
    const canvas = await generateCanvasFromElement(element, options);

    // Convert canvas to image data with high quality for printing
    const imgData = canvas.toDataURL("image/jpeg", quality);

    // Create A4-sized PDF optimized for printing
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: false, // Disable compression for better print quality
      precision: 2, // Higher precision for exact measurements
    });

    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;

    // NO MARGINS - fill the entire A4 page for perfect printing
    // This ensures the resume fills the entire A4 sheet without white borders
    const printableWidth = a4Width; // Full width
    const printableHeight = a4Height; // Full height

    // Convert canvas dimensions to mm for comparison
    const pxToMm = (px: number) => px * 0.264583;
    const contentWidthMm = pxToMm(canvas.width);
    const contentHeightMm = pxToMm(canvas.height);

    // Since the resume is designed to be A4 size (210mm x 297mm), we should use it at full size
    // Calculate scaling to fit exactly to A4 dimensions
    const scaleX = printableWidth / contentWidthMm;
    const scaleY = printableHeight / contentHeightMm;

    // Use the smaller scale to ensure content fits, or use 1.0 if content is already A4-sized
    const scale = Math.min(scaleX, scaleY, 1.0);

    // Calculate final dimensions after scaling
    const finalWidth = contentWidthMm * scale;
    const finalHeight = contentHeightMm * scale;

    // Position at top-left (0,0) for full-bleed A4 printing
    const x = 0;
    const y = 0;

    // If content is smaller than A4, stretch it to fill A4 for better utilization
    const useFullA4 = contentWidthMm <= a4Width && contentHeightMm <= a4Height;
    const actualWidth = useFullA4 ? a4Width : finalWidth;
    const actualHeight = useFullA4 ? a4Height : finalHeight;

    try {
      pdf.addImage(
        imgData,
        "JPEG",
        x,
        y,
        actualWidth,
        actualHeight,
        undefined,
        "FAST",
      );

      console.log(
        `📄 PDF Details for A4 Printing:`,
        `\n• PDF Size: ${actualWidth.toFixed(1)}mm × ${actualHeight.toFixed(1)}mm`,
        `\n• Canvas Size: ${canvas.width}px × ${canvas.height}px`,
        `\n• Content Size: ${contentWidthMm.toFixed(1)}mm × ${contentHeightMm.toFixed(1)}mm`,
        `\n• Scale Applied: ${scale.toFixed(2)}x`,
        `\n• A4 Standard: 210mm × 297mm`,
        `\n• Full Bleed: ${actualWidth === a4Width && actualHeight === a4Height ? "YES ✅" : "NO ❌"}`,
      );
    } catch (error) {
      console.error("jsPDF addImage failed:", error);
      throw new Error("Failed to add image to PDF. Please try again.");
    }

    try {
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error("jsPDF save failed:", error);
      throw new Error("Failed to save PDF. Please try again.");
    }

    console.log("PDF successfully generated from image");
  } catch (error) {
    console.error("PDF from image generation failed:", error);
    throw new Error(
      `Failed to download resume as PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
