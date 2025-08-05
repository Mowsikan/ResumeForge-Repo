import { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Download,
  Save,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { ResumePreview } from "@/components/ResumePreview";
import { ATSSolutionTooltip } from "@/components/ATSSolutionTooltip";
import { ResumeData } from "@/types/resume";
import { useIsMobile } from "@/hooks/use-mobile";
import { downloadResumeAsPdfFromImage } from "@/utils/imageToPdf";
import { toast } from "@/hooks/use-toast";

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  template: string;
  visibleFields: Record<string, boolean>;
  templateDisplayName: string;
  onDownload: () => void;
  onSave: () => void;
  isDownloading?: boolean;
  isSaving?: boolean;
  canDownload?: boolean;
  userDisplayName?: string;
  // New props for direct modal download functionality
  resumeTitle?: string;
  onDownloadCredit?: () => Promise<boolean>;
  onSaveDownloadedResume?: (
    data: ResumeData,
    title: string,
    template: string,
    id?: string,
  ) => Promise<void>;
  downloadedResumeId?: string;
  // Mobile-style download functions
  onMobileStylePdfDownload?: () => Promise<void>;
  onMobileStyleImageDownload?: () => Promise<void>;
  isDownloadingImage?: boolean;
  // Watermark choice functions
  onShowWatermarkChoice?: (type: "PDF" | "Image") => void;
}

export const ResumePreviewModal = ({
  isOpen,
  onClose,
  data,
  template,
  visibleFields,
  templateDisplayName,
  onDownload,
  onSave,
  isDownloading = false,
  isSaving = false,
  canDownload = true,
  userDisplayName = "Resume Preview",
  resumeTitle = "resume",
  onDownloadCredit,
  onSaveDownloadedResume,
  downloadedResumeId,
  onMobileStylePdfDownload,
  onMobileStyleImageDownload,
  isDownloadingImage = false,
  onShowWatermarkChoice,
}: ResumePreviewModalProps) => {
  const [zoom, setZoom] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isContentOverflowing, setIsContentOverflowing] = useState(false);
  const [isModalDownloading, setIsModalDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const resumeContentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Mobile-optimized zoom controls with smaller increments
  const zoomIn = () =>
    setZoom((prev) => Math.min(prev + (isMobile ? 0.05 : 0.1), 2));
  const zoomOut = () =>
    setZoom((prev) => Math.max(prev - (isMobile ? 0.05 : 0.1), 0.2));
  const resetZoom = () => setZoom(isMobile ? 0.45 : 0.8);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setZoom(1.0);
    } else {
      setZoom(isMobile ? 0.45 : 0.8);
    }
  };

  // Modal-based download handler (used by both mobile and desktop)
  const handleModalDownload = async () => {
    if (!canDownload || !resumeContentRef.current) {
      onDownload(); // Fallback to parent handler
      return;
    }

    setIsModalDownloading(true);

    try {
      // Use the modal's resume content for download
      const contentNode = resumeContentRef.current;

      // Move all content down by 2px for export only (wrap in a div)
      const originalContent = contentNode.firstElementChild;
      let wrapperDiv = null;
      let textNodes = [];
      if (originalContent) {
        wrapperDiv = document.createElement("div");
        wrapperDiv.style.width = "100%";
        wrapperDiv.appendChild(originalContent);
        contentNode.appendChild(wrapperDiv);
        // Select all text elements inside the wrapper
        textNodes = wrapperDiv.querySelectorAll(
          "p, h1, h2, h3, h4, h5, h6, span, li, a, label, strong, em, b, i, td, th, span[data-text]",
        );
        textNodes.forEach((el) => {
          el.style.transform = "translateY(-6px)";
        });
      }

      // Use modal-based download approach
      const downloadPromise = downloadResumeAsPdfFromImage(contentNode, {
        filename: resumeTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase(),
        quality: 0.98,
        scale: 2,
      });

      // Wrap in timeout to prevent hanging (2 minutes max)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("PDF download timed out after 2 minutes")),
          120000,
        );
      });

      await Promise.race([downloadPromise, timeoutPromise]);

      // Unwrap and cleanup after export
      if (wrapperDiv && originalContent) {
        textNodes.forEach((el) => {
          el.style.transform = "";
        });
        contentNode.removeChild(wrapperDiv);
        contentNode.appendChild(originalContent);
      }

      // Consume download credit if provided
      if (onDownloadCredit) {
        const consumed = await onDownloadCredit();
        if (!consumed) {
          throw new Error("Failed to process download credit");
        }
      }

      // Save to downloaded resumes if provided
      if (onSaveDownloadedResume) {
        await onSaveDownloadedResume(
          data,
          resumeTitle,
          template,
          downloadedResumeId,
        );
      }

      toast({
        title: "Success!",
        description: "Your resume PDF has been downloaded successfully.",
      });

      // Close modal after successful download
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Modal PDF download error:", errorMessage, error);

      toast({
        title: "Download Failed",
        description: errorMessage.includes("timeout")
          ? "Download timed out. Please try again with a stable connection."
          : "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsModalDownloading(false);
    }
  };

  // Calculate total pages based on content height
  useEffect(() => {
    if (previewRef.current && isOpen) {
      const contentHeight = previewRef.current.scrollHeight;
      const pageHeight = 297 * 3.78; // A4 height in pixels (297mm * 3.78)
      const calculatedPages = Math.ceil(contentHeight / pageHeight);
      setTotalPages(Math.max(1, calculatedPages));
    }
  }, [isOpen, data, template]);

  // Reset zoom and page when modal opens/closes - Mobile starts at 45%
  useEffect(() => {
    if (isOpen) {
      setZoom(isMobile ? 0.45 : 0.8);
      setIsFullscreen(false);
      setCurrentPage(1);
    }
  }, [isOpen, isMobile]);

  // Handle keyboard shortcuts with mobile-optimized controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "=":
          case "+":
            e.preventDefault();
            zoomIn();
            break;
          case "-":
            e.preventDefault();
            zoomOut();
            break;
          case "0":
            e.preventDefault();
            resetZoom();
            break;
        }
      }
      if (e.key === "Escape") {
        if (isFullscreen) {
          toggleFullscreen();
        } else {
          onClose();
        }
      }
      // Page navigation
      if (e.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
      if (e.key === "ArrowRight" && currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFullscreen, currentPage, totalPages, onClose]);

  // Check for page overflow to show ATS warning using DOM measurement (same as Builder.tsx)
  useEffect(() => {
    const checkOverflow = async () => {
      if (!resumeContentRef.current || !isOpen) {
        setIsContentOverflowing(false);
        return;
      }

      try {
        // Use the same DOM-based measurement system as Builder.tsx
        const overflow = await measureActualContentOverflow();
        setIsContentOverflowing(overflow);
      } catch (error) {
        console.warn("Error measuring content overflow in modal:", error);
        setIsContentOverflowing(false);
      }
    };

    if (isOpen && resumeContentRef.current) {
      // Longer delay to ensure content is fully rendered in modal context
      const timeoutId = setTimeout(checkOverflow, 1000);

      // Also check on window resize
      window.addEventListener("resize", checkOverflow);

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("resize", checkOverflow);
      };
    }
  }, [isOpen, data, template, visibleFields]);

  // Fallback simple overflow check
  const checkSimpleOverflow = (): boolean => {
    if (!resumeContentRef.current) return false;

    try {
      // Simple check using the actual scrollHeight of the resume content
      const contentHeight = resumeContentRef.current.scrollHeight;
      const a4HeightInPixels = 1123; // A4 height in pixels

      return contentHeight > a4HeightInPixels;
    } catch (error) {
      console.warn("Modal ATS: Fallback measurement failed:", error);
      return false;
    }
  };

  // DOM-based measurement for accurate overflow detection (same as Builder.tsx)
  const measureActualContentOverflow = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!resumeContentRef.current) {
        resolve(false);
        return;
      }

      try {
        // Create a temporary container for measurement
        const measurementContainer = document.createElement("div");
        measurementContainer.style.position = "absolute";
        measurementContainer.style.top = "-9999px";
        measurementContainer.style.left = "-9999px";
        measurementContainer.style.width = "210mm"; // A4 width
        measurementContainer.style.height = "auto"; // Allow natural height
        measurementContainer.style.overflow = "visible"; // Don't clip content
        measurementContainer.style.visibility = "hidden";
        measurementContainer.style.pointerEvents = "none";
        measurementContainer.style.zIndex = "-1";

        // Copy computed styles from the original container
        const originalContainerStyles = window.getComputedStyle(
          resumeContentRef.current,
        );
        measurementContainer.style.fontFamily =
          originalContainerStyles.fontFamily;
        measurementContainer.style.fontSize = originalContainerStyles.fontSize;
        measurementContainer.style.lineHeight =
          originalContainerStyles.lineHeight;
        measurementContainer.style.color = originalContainerStyles.color;
        measurementContainer.style.backgroundColor =
          originalContainerStyles.backgroundColor;

        // Apply the same class names as the actual preview container, removing overflow restrictions
        const className = resumeContentRef.current.className.replace(
          "overflow-hidden",
          "",
        );
        measurementContainer.className = className;

        // Clone the content from the actual preview (ResumePreview component)
        const originalContent = resumeContentRef.current.firstElementChild;
        if (!originalContent) {
          resolve(false);
          return;
        }

        const clonedContent = originalContent.cloneNode(true) as HTMLElement;

        // Remove any overflow restrictions from the cloned content and its children
        const removeOverflowRestrictions = (element: HTMLElement) => {
          element.style.overflow = "visible";
          element.style.height = "auto";
          element.style.maxHeight = "none";
          element.style.minHeight = "auto";
          // Recursively apply to all children
          Array.from(element.children).forEach((child) => {
            if (child instanceof HTMLElement) {
              removeOverflowRestrictions(child);
            }
          });
        };

        removeOverflowRestrictions(clonedContent);
        measurementContainer.appendChild(clonedContent);

        // Temporarily add to DOM for measurement
        document.body.appendChild(measurementContainer);

        // Wait multiple frames for styles to apply and layout to stabilize
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            try {
              // Get the actual rendered height
              const actualHeight = measurementContainer.scrollHeight;

              // A4 height is 297mm ≈ 1123px at 96 DPI
              // Convert 297mm to pixels: 297 * (96/25.4) �� 1123px
              const a4HeightInPixels = 1123;

              // Clean up
              document.body.removeChild(measurementContainer);

              // Resolve with overflow result
              const isOverflowing = actualHeight > a4HeightInPixels;

              // If DOM measurement fails or shows no overflow, try a fallback method
              if (!isOverflowing) {
                const fallbackOverflow = checkSimpleOverflow();
                resolve(fallbackOverflow);
              } else {
                resolve(isOverflowing);
              }
            } catch (cleanupError) {
              console.warn("Error during measurement cleanup:", cleanupError);
              // Clean up anyway
              try {
                document.body.removeChild(measurementContainer);
              } catch {}
              resolve(false);
            }
          });
        });
      } catch (error) {
        console.warn(
          "Error measuring content overflow, falling back to simple check:",
          error,
        );
        resolve(checkSimpleOverflow());
      }
    });
  };

  // Touch gesture support for mobile zoom
  const lastTouchDistance = useRef<number>(0);
  const [isGestureActive, setIsGestureActive] = useState(false);

  const getTouchDistance = useCallback((touches: TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2),
    );
  }, []);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 2) {
        setIsGestureActive(true);
        lastTouchDistance.current = getTouchDistance(e.touches);
      }
    },
    [getTouchDistance],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isGestureActive || e.touches.length !== 2) return;

      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches);
      const deltaDistance = currentDistance - lastTouchDistance.current;

      if (Math.abs(deltaDistance) > 10) {
        // Threshold to prevent jittery behavior
        const zoomDelta = deltaDistance > 0 ? 0.05 : -0.05;
        setZoom((prev) => Math.max(0.2, Math.min(2, prev + zoomDelta)));
        lastTouchDistance.current = currentDistance;
      }
    },
    [isGestureActive, getTouchDistance],
  );

  const handleTouchEnd = useCallback(() => {
    setIsGestureActive(false);
    lastTouchDistance.current = 0;
  }, []);

  // Add touch event listeners for mobile gesture support
  useEffect(() => {
    if (!isMobile || !previewRef.current) return;

    const element = previewRef.current;
    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`${
          isFullscreen
            ? "fixed inset-0 w-screen h-screen max-w-none max-h-none m-0 rounded-none"
            : isMobile
              ? "w-[100vw] max-w-[100vw] h-[100vh] max-h-[100vh] m-0 rounded-none"
              : "max-w-7xl w-[95vw] max-h-[95vh]"
        } p-0 overflow-hidden bg-gray-900`}
      >
        <VisuallyHidden>
          <DialogTitle>Resume Preview</DialogTitle>
        </VisuallyHidden>

        {/* Main content area with improved mobile layout */}
        <div
          className={`overflow-auto bg-gray-800 ${isMobile ? "mobile-scroll" : ""} `}
          style={{
            height: isFullscreen
              ? "calc(100vh - 80px)"
              : isMobile
                ? "calc(100vh)" // Account for header and controls
                : "calc(95vh - 120px)",
          }}
        >
          <div
            className={`${isMobile ? "p-4 pt-6" : "p-6"} flex justify-center items-center min-h-full`}
          >
            <div
              ref={previewRef}
              className="bg-white shadow-2xl transition-transform duration-200 relative"
              style={{
                maxWidth: isMobile ? "auto" : "210mm", // Constrain mobile width for better centering
                minHeight: isMobile ? "auto" : "297mm",
                transform: `scale(${zoom})`,
                transformOrigin: "center center", // Better centering for mobile
                margin: "0 auto", // Center horizontally
                marginBottom: isMobile && zoom < 0.6 ? "-150px" : "0", // Adjust spacing for mobile
                aspectRatio: "210/297", // Ensure proper aspect ratio
              }}
            >
              {/* Enhanced watermarks with better mobile positioning */}
              <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
                <div
                  className="text-gray-200 text-30xl font-bold transform rotate-45 opacity-30 select-none "
                  style={{
                    position: "relative",
                    left: isMobile ? "0px" : "auto",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    fontSize: isMobile ? "3.5rem" : "6rem",
                  }}
                >
                  PREVIEW
                </div>
              </div>

              <div
                ref={resumeContentRef}
                className="resume-template-content relative z-20 w-full"
                style={{
                  maxHeight: "1200px", // Increased to accommodate longer content - same as desktop
                  overflow: "visible", // Allow content to be visible for proper PDF capture
                  width: "210mm", // A4 width
                  minHeight: "297mm", // A4 height
                }}
              >
                <ResumePreview
                  data={data}
                  template={template}
                  visibleFields={visibleFields}
                />

                {/* Strict single page restriction - no overflow indicator */}
              </div>
            </div>
          </div>
        </div>

        {/* Small ATS Alert for Modal - mobile and desktop */}
        {isContentOverflowing && (
          <div
            className={`fixed z-50 ${isMobile ? "bottom-20 left-1/2 transform -translate-x-1/2 px-4" : "top-4 right-4"}`}
          >
            <Alert
              className={`${isMobile ? "max-w-sm" : "max-w-xs"} bg-orange-50/95 backdrop-blur-sm border-orange-200 shadow-lg`}
            >
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <AlertDescription className="text-orange-800 text-sm">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">⚠️ ATS Alert</span>
                  <span className="text-xs">Resume exceeds 1 page</span>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Enhanced floating zoom controls for mobile */}
        {isMobile && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            {/* Zoom Controls with improved design */}
            <div className="flex items-center gap-3 bg-gray-800/95 backdrop-blur-sm rounded-full px-5 py-3 shadow-xl border border-gray-600">
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomOut}
                disabled={zoom <= 0.2}
                className="h-9 w-9 p-0 text-white hover:bg-gray-600 rounded-full transition-all duration-200 disabled:opacity-50"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>

              <div className="flex flex-col items-center gap-1">
                <span className="text-white text-xs font-medium opacity-80">
                  Zoom
                </span>
                <span className="text-white text-sm font-mono bg-gray-700 px-2 py-1 rounded text-center min-w-[3.5rem]">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={zoomIn}
                disabled={zoom >= 2}
                className="h-9 w-9 p-0 text-white hover:bg-gray-600 rounded-full transition-all duration-200 disabled:opacity-50"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>

              <div className="w-px h-6 bg-gray-500 mx-1" />

              <Button
                variant="ghost"
                size="sm"
                onClick={resetZoom}
                title="Reset to 45%"
                className="h-9 w-9 p-0 text-white hover:bg-gray-600 rounded-full transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>

              <div className="w-px h-6 bg-gray-500 mx-1" />

              {/* Mobile Download Buttons */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!canDownload && onShowWatermarkChoice) {
                    onShowWatermarkChoice("PDF");
                  } else if (onMobileStylePdfDownload) {
                    onMobileStylePdfDownload();
                  }
                }}
                disabled={isDownloading}
                title="Download PDF"
                className="h-9 w-9 p-0 text-white hover:bg-gray-600 rounded-full transition-all duration-200 disabled:opacity-50"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!canDownload && onShowWatermarkChoice) {
                    onShowWatermarkChoice("Image");
                  } else if (onMobileStyleImageDownload) {
                    onMobileStyleImageDownload();
                  }
                }}
                disabled={isDownloadingImage}
                title="Download Image"
                className="h-9 w-9 p-0 text-white hover:bg-gray-600 rounded-full transition-all duration-200 disabled:opacity-50"
              >
                {isDownloadingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Desktop zoom controls */}
        {!isMobile && (
          <div className="absolute top-20 right-6 z-20 space-y-2">
            {/* Download Controls */}
            <div className="flex items-center gap-1 bg-gray-700 rounded-md p-1 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!canDownload && onShowWatermarkChoice) {
                    onShowWatermarkChoice("PDF");
                  } else if (onMobileStylePdfDownload) {
                    onMobileStylePdfDownload();
                  }
                }}
                disabled={isDownloading}
                className="h-7 px-3 text-white hover:bg-gray-600 flex items-center gap-1"
              >
                {isDownloading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Download className="w-3 h-3" />
                )}
                <span className="text-xs">PDF</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!canDownload && onShowWatermarkChoice) {
                    onShowWatermarkChoice("Image");
                  } else if (onMobileStyleImageDownload) {
                    onMobileStyleImageDownload();
                  }
                }}
                disabled={isDownloadingImage}
                className="h-7 px-3 text-white hover:bg-gray-600 flex items-center gap-1"
              >
                {isDownloadingImage ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Download className="w-3 h-3" />
                )}
                <span className="text-xs">IMG</span>
              </Button>
            </div>
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-gray-700 rounded-md p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomOut}
                disabled={zoom <= 0.3}
                className="h-7 w-7 p-0 text-white hover:bg-gray-600"
              >
                <ZoomOut className="w-3 h-3" />
              </Button>
              <span className="text-white text-xs font-mono min-w-[3rem] text-center px-2">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomIn}
                disabled={zoom >= 2}
                className="h-7 w-7 p-0 text-white hover:bg-gray-600"
              >
                <ZoomIn className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetZoom}
                className="h-7 w-7 p-0 text-white hover:bg-gray-600"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
              {!isFullscreen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="h-7 w-7 p-0 text-white hover:bg-gray-600"
                >
                  <Maximize2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Page Navigation Component
const ResumePageNavigation: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}> = ({ currentPage, totalPages, onPageChange, className = "" }) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="h-8 w-8 p-0 text-white hover:bg-gray-600"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <span className="text-white text-sm font-mono min-w-[4rem] text-center">
        {currentPage} / {totalPages}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-8 w-8 p-0 text-white hover:bg-gray-600"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
