import html2canvas from "html2canvas";

export interface SinglePageImageOptions {
  filename?: string;
  quality?: number;
  scale?: number;
  maxHeight?: number;
}

export const generateSinglePageImage = async (
  element: HTMLElement,
  options: SinglePageImageOptions = {},
): Promise<void> => {
  const {
    filename = "resume.png",
    quality = 0.98,
    scale = 2,
    maxHeight = 1050,
  } = options;

  // Create a clone of the element to avoid modifying the original
  const clonedElement = element.cloneNode(true) as HTMLElement;
  clonedElement.style.position = "absolute";
  clonedElement.style.left = "-10000px";
  clonedElement.style.top = "0";
  clonedElement.style.zIndex = "-1000";
  document.body.appendChild(clonedElement);

  // Inject single-page styles (reuse from pdfSinglePage)
  const style = document.createElement("style");
  style.innerHTML = `
    .resumify-single-page {
      max-height: ${maxHeight}px !important;
      height: ${maxHeight}px !important;
      min-height: ${maxHeight}px !important;
      overflow: hidden !important;
      page-break-after: avoid !important;
      page-break-inside: avoid !important;
      page-break-before: avoid !important;
      transform-origin: top left !important;
      box-sizing: border-box !important;
      font-size: 12px !important;
      line-height: 1.2 !important;
    }
    .resumify-single-page * {
      page-break-inside: avoid !important;
      page-break-after: avoid !important;
      page-break-before: avoid !important;
      max-height: none !important;
    }
  `;
  document.head.appendChild(style);

  clonedElement.classList.add("resumify-single-page");
  clonedElement.style.cssText += `
    max-height: ${maxHeight}px !important;
    height: ${maxHeight}px !important;
    overflow: hidden !important;
    position: static !important;
    left: auto !important;
    top: auto !important;
    z-index: auto !important;
  `;

  try {
    const canvas = await html2canvas(clonedElement, {
      scale,
      useCORS: true,
      backgroundColor: "#fff",
      logging: false,
      height: maxHeight,
      windowHeight: maxHeight,
      scrollX: 0,
      scrollY: 0,
    });
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png", quality);
    link.click();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Single-page image export failed:", errorMessage, error);
    throw new Error(`Failed to generate single-page image: ${errorMessage}`);
  } finally {
    document.head.removeChild(style);
    document.body.removeChild(clonedElement);
  }
};
