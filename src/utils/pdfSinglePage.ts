import html2pdf from "html2pdf.js";

export interface SinglePagePDFOptions {
  filename?: string;
  quality?: number;
  scale?: number;
  maxHeight?: number;
}

export const generateSinglePagePDF = async (
  element: HTMLElement,
  options: SinglePagePDFOptions = {},
): Promise<void> => {
  const {
    filename = "resume.pdf",
    quality = 0.98,
    scale = 2,
    maxHeight = 1050,
  } = options;

  // Store original styles
  const originalStyle = element.style.cssText;
  const originalClassList = element.className;

  // Create a clone of the element to avoid modifying the original
  const clonedElement = element.cloneNode(true) as HTMLElement;
  clonedElement.style.position = "absolute";
  clonedElement.style.left = "-10000px";
  clonedElement.style.top = "0";
  clonedElement.style.zIndex = "-1000";
  document.body.appendChild(clonedElement);

  // Inject comprehensive single-page styles
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
    
    .resumify-single-page h1,
    .resumify-single-page h2,
    .resumify-single-page h3,
    .resumify-single-page h4,
    .resumify-single-page h5,
    .resumify-single-page h6 {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    
    .resumify-single-page p,
    .resumify-single-page div,
    .resumify-single-page section {
      orphans: 2 !important;
      widows: 2 !important;
    }
  `;
  document.head.appendChild(style);

  // Apply single-page class and styles to cloned element
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

  const customFormat: [number, number] = [210, 297]; // A4 format

  const pdfOptions = {
    margin: [5, 5, 5, 5], // Small margins
    filename,
    image: {
      type: "jpeg",
      quality,
    },
    html2canvas: {
      scale,
      useCORS: true,
      letterRendering: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      height: maxHeight,
      windowHeight: maxHeight,
      scrollX: 0,
      scrollY: 0,
    },
    jsPDF: {
      unit: "mm",
      format: customFormat,
      orientation: "portrait",
      compress: true,
      precision: 16,
      putOnlyUsedFonts: true,
      hotfixes: ["px_scaling"],
    },
    pagebreak: {
      mode: ["avoid-all", "css"],
      avoid: [".resumify-single-page", ".no-page-break"],
    },
  };

  try {
    await html2pdf().from(clonedElement).set(pdfOptions).save();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Single-page PDF generation failed:", errorMessage, error);
    throw new Error(`Failed to generate single-page PDF: ${errorMessage}`);
  } finally {
    // Clean up
    document.head.removeChild(style);
    document.body.removeChild(clonedElement);
  }
};

export const previewSinglePagePDF = async (
  element: HTMLElement,
  options: SinglePagePDFOptions = {},
): Promise<Blob> => {
  const { quality = 0.98, scale = 2, maxHeight = 1050 } = options;

  // Store original styles
  const originalStyle = element.style.cssText;
  const originalClassList = element.className;

  // Create a clone of the element to avoid modifying the original
  const clonedElement = element.cloneNode(true) as HTMLElement;
  clonedElement.style.position = "absolute";
  clonedElement.style.left = "-10000px";
  clonedElement.style.top = "0";
  clonedElement.style.zIndex = "-1000";
  document.body.appendChild(clonedElement);

  // Inject comprehensive single-page styles
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

  // Apply single-page class and styles to cloned element
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

  const customFormat: [number, number] = [210, 297]; // A4 format

  const pdfOptions = {
    margin: [5, 5, 5, 5], // Small margins
    image: {
      type: "jpeg",
      quality,
    },
    html2canvas: {
      scale,
      useCORS: true,
      letterRendering: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      height: maxHeight,
      windowHeight: maxHeight,
      scrollX: 0,
      scrollY: 0,
    },
    jsPDF: {
      unit: "mm",
      format: customFormat,
      orientation: "portrait",
      compress: true,
      precision: 16,
      putOnlyUsedFonts: true,
      hotfixes: ["px_scaling"],
    },
    pagebreak: {
      mode: ["avoid-all", "css"],
      avoid: [".resumify-single-page", ".no-page-break"],
    },
  };

  try {
    const pdfBlob: Blob = await new Promise((resolve, reject) => {
      (html2pdf() as any)
        .from(clonedElement)
        .set(pdfOptions)
        .toPdf()
        .get("pdf")
        .then((pdf: any) => {
          resolve(pdf.output("blob"));
        })
        .catch(reject);
    });
    return pdfBlob;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Single-page PDF preview failed:", errorMessage, error);
    throw new Error(
      `Failed to generate single-page PDF preview: ${errorMessage}`,
    );
  } finally {
    // Clean up
    document.head.removeChild(style);
    document.body.removeChild(clonedElement);
  }
};
