import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// PDF download WITH watermark (for free users)
export const downloadResumeAsPdfWithWatermark = async (
  element: HTMLElement,
  options: { filename?: string; quality?: number; scale?: number } = {},
): Promise<void> => {
  const { filename = "resume", quality = 0.98, scale = 2 } = options;

  try {
    // DON'T hide watermarks - this is the key difference
    console.log("📄 Generating PDF with watermark for free user");

    // Force element to be visible if needed
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
      element.style.top = "-9999px";
      element.style.left = "-9999px";
      element.style.zIndex = "-1";
      element.style.width = "210mm";
      element.style.height = "auto";
      needsRestore = true;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    // Get final computed dimensions after layout
    const finalRect = element.getBoundingClientRect();

    // Generate canvas WITH watermarks visible
    let canvas;
    try {
      canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        removeContainer: true,
        imageTimeout: 45000,
        width: Math.ceil(finalRect.width),
        height: Math.ceil(finalRect.height),
        scrollX: 0,
        scrollY: 0,
        logging: false,
      });
    } catch (error) {
      if (error.message?.includes("timeout") || error.name === "TimeoutError") {
        console.warn(
          "PDF canvas generation timed out, retrying with reduced settings...",
        );
        canvas = await html2canvas(element, {
          scale: 1,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          removeContainer: true,
          imageTimeout: 60000,
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

    // Restore original styles
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

    // Validate canvas
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Canvas generation failed - invalid dimensions");
    }

    console.log(
      `✅ Canvas created WITH watermark: ${canvas.width}x${canvas.height}`,
    );

    // Convert canvas to image data
    const imgData = canvas.toDataURL("image/jpeg", quality);

    // Create A4-sized PDF
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: false,
      precision: 2,
    });

    // A4 dimensions - full bleed
    const a4Width = 210;
    const a4Height = 297;

    // Convert canvas dimensions to mm
    const pxToMm = (px: number) => px * 0.264583;
    const contentWidthMm = pxToMm(canvas.width);
    const contentHeightMm = pxToMm(canvas.height);

    // Calculate scaling to fit A4
    const scaleX = a4Width / contentWidthMm;
    const scaleY = a4Height / contentHeightMm;
    const pdfScale = Math.min(scaleX, scaleY, 1.0);

    // Use full A4 if content fits
    const useFullA4 = contentWidthMm <= a4Width && contentHeightMm <= a4Height;
    const actualWidth = useFullA4 ? a4Width : contentWidthMm * pdfScale;
    const actualHeight = useFullA4 ? a4Height : contentHeightMm * pdfScale;

    // Add image to PDF
    pdf.addImage(
      imgData,
      "JPEG",
      0,
      0,
      actualWidth,
      actualHeight,
      undefined,
      "FAST",
    );

    console.log(
      `🎯 PDF created WITH watermark: ${actualWidth.toFixed(1)}mm × ${actualHeight.toFixed(1)}mm`,
    );

    // Save PDF
    pdf.save(`${filename}_watermark.pdf`);
    console.log("💾 PDF with watermark downloaded successfully");
  } catch (error) {
    console.error("PDF with watermark generation failed:", error);
    throw new Error(
      `Failed to download resume as PDF with watermark: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

// Image download WITH watermark (for free users)
export const downloadResumeAsImageWithWatermark = async (
  element: HTMLElement,
  options: {
    filename?: string;
    format?: "png" | "jpeg";
    quality?: number;
    scale?: number;
  } = {},
): Promise<void> => {
  const {
    filename = "resume",
    format = "png",
    quality = 0.98,
    scale = 2,
  } = options;

  try {
    // DON'T hide watermarks - this is the key difference
    console.log("🖼️ Generating Image with watermark for free user");

    const isMobile = window.innerWidth < 768;

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
      element.style.top = "-9999px";
      element.style.left = "-9999px";
      element.style.zIndex = "-1";
      element.style.width = "210mm";
      element.style.height = "auto";
      needsRestore = true;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    // Get final computed dimensions after layout
    const finalRect = element.getBoundingClientRect();

    // Generate canvas WITH watermarks visible
    let canvas;
    try {
      canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        removeContainer: true,
        imageTimeout: 45000,
        width: Math.ceil(finalRect.width),
        height: Math.ceil(finalRect.height),
        scrollX: 0,
        scrollY: 0,
        logging: false,
      });
    } catch (error) {
      if (error.message?.includes("timeout") || error.name === "TimeoutError") {
        console.warn(
          "Canvas generation timed out, retrying with reduced settings...",
        );
        canvas = await html2canvas(element, {
          scale: 1,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          removeContainer: true,
          imageTimeout: 60000,
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

    // Restore original styles
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

    // Validate canvas
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Canvas generation failed - invalid dimensions");
    }

    console.log(
      `✅ Canvas created WITH watermark: ${canvas.width}x${canvas.height}`,
    );

    // Convert canvas to blob
    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
    const blob = await new Promise<Blob | null>((resolve, reject) => {
      try {
        canvas.toBlob(
          (result) => {
            if (!result) {
              reject(new Error("Canvas toBlob returned null"));
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
    link.download = `${filename}_watermark.${format}`;

    // Trigger download
    document.body.appendChild(link);

    if (isMobile) {
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

    console.log("💾 Image with watermark downloaded successfully");
  } catch (error) {
    console.error("Image with watermark download failed:", error);
    throw new Error(
      `Failed to download resume as image with watermark: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
