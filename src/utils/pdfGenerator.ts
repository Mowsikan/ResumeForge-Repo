import html2pdf from "html2pdf.js";

export interface PDFOptions {
  filename?: string;
  quality?: number;
  scale?: number;
}

export const generatePDF = async (
  element: HTMLElement,
  options: PDFOptions = {},
): Promise<void> => {
  const { filename = "resume.pdf", quality = 0.98, scale = 2 } = options;
  const customFormat: [number, number] = [210, 297];

  // Store original styles
  const originalStyle = element.style.cssText;
  const originalClassList = element.className;

  // Inject styles to force single-page output
  const style = document.createElement("style");
  style.innerHTML = `
    .resumify-pdf-single-page {
      max-height: 1050px !important;
      min-height: 1050px !important;
      height: 1050px !important;
      overflow: hidden !important;
      page-break-after: avoid !important;
      page-break-inside: avoid !important;
      transform-origin: top left !important;
      box-sizing: border-box !important;
    }
    .resumify-pdf-single-page * {
      page-break-inside: avoid !important;
    }
  `;
  document.head.appendChild(style);

  // Apply single-page class and inline styles
  element.classList.add("resumify-pdf-single-page");
  element.style.cssText += `
    max-height: 1050px !important;
    height: 1050px !important;
    overflow: hidden !important;
  `;

  const pdfOptions = {
    margin: 0,
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
    },
    jsPDF: {
      unit: "mm",
      format: customFormat,
      orientation: "portrait",
      compress: true,
      precision: 16,
      putOnlyUsedFonts: true,
    },
    pagebreak: {
      mode: ["avoid-all", "css", "legacy"],
      before: ".page-break-before",
      after: ".page-break-after",
      avoid: [".no-page-break", ".resumify-pdf-single-page"],
    },
  };

  try {
    await html2pdf().from(element).set(pdfOptions).save();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("PDF generation failed:", errorMessage, error);
    throw new Error(`Failed to generate PDF: ${errorMessage}`);
  } finally {
    // Restore original styles
    document.head.removeChild(style);
    element.className = originalClassList;
    element.style.cssText = originalStyle;
  }
};

export const previewPDF = async (
  element: HTMLElement,
  options: PDFOptions = {},
): Promise<Blob> => {
  const { quality = 0.98, scale = 2 } = options;
  const customFormat: [number, number] = [210, 297];

  // Store original styles
  const originalStyle = element.style.cssText;
  const originalClassList = element.className;

  // Inject styles to force single-page output
  const style = document.createElement("style");
  style.innerHTML = `
    .resumify-pdf-single-page {
      max-height: 1050px !important;
      min-height: 1050px !important;
      height: 1050px !important;
      overflow: hidden !important;
      page-break-after: avoid !important;
      page-break-inside: avoid !important;
      transform-origin: top left !important;
      box-sizing: border-box !important;
    }
    .resumify-pdf-single-page * {
      page-break-inside: avoid !important;
    }
  `;
  document.head.appendChild(style);

  // Apply single-page class and inline styles
  element.classList.add("resumify-pdf-single-page");
  element.style.cssText += `
    max-height: 1050px !important;
    height: 1050px !important;
    overflow: hidden !important;
  `;

  const pdfOptions = {
    margin: 0,
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
    },
    jsPDF: {
      unit: "mm",
      format: customFormat,
      orientation: "portrait",
      compress: true,
      precision: 16,
      putOnlyUsedFonts: true,
    },
    pagebreak: {
      mode: ["avoid-all", "css", "legacy"],
      before: ".page-break-before",
      after: ".page-break-after",
      avoid: [".no-page-break", ".resumify-pdf-single-page"],
    },
  };

  try {
    const pdfBlob: Blob = await new Promise((resolve, reject) => {
      (html2pdf() as any)
        .from(element)
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
    console.error("PDF preview failed:", errorMessage, error);
    throw new Error(`Failed to generate PDF preview: ${errorMessage}`);
  } finally {
    // Restore original styles
    document.head.removeChild(style);
    element.className = originalClassList;
    element.style.cssText = originalStyle;
  }
};
