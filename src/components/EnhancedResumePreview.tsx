import { useState, useRef, useEffect, useCallback } from "react";
import { ResumePreview } from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  AlertTriangle,
} from "lucide-react";
import { ResumeData } from "@/types/resume";
import { useIsMobile } from "@/hooks/use-mobile";

interface EnhancedResumePreviewProps {
  data: ResumeData;
  template: string;
  className?: string;
  visibleFields: Record<string, boolean>;
}

export const EnhancedResumePreview = ({
  data,
  template,
  className,
  visibleFields,
}: EnhancedResumePreviewProps) => {
  const [zoom, setZoom] = useState(0.6);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeContentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.3));
  const resetZoom = useCallback(
    () => setZoom(isMobile ? 0.4 : 0.6),
    [isMobile],
  );

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setZoom(isMobile ? 0.5 : 0.8);
    } else {
      setZoom(isMobile ? 0.4 : 0.6);
    }
  }, [isFullscreen, isMobile]);

  // Set initial zoom based on device
  useEffect(() => {
    setZoom(isMobile ? 0.4 : 0.6);
  }, [isMobile]);

  // Check for page overflow to show ATS warning
  useEffect(() => {
    const checkOverflow = () => {
      if (resumeContentRef.current) {
        // A4 page height at 96 DPI is approximately 1123px
        // We'll use a slightly smaller value to account for margins
        const maxPageHeight = 1050;
        const contentHeight = resumeContentRef.current.scrollHeight;
        setIsOverflowing(contentHeight > maxPageHeight);
      }
    };

    // Check overflow after a short delay to ensure content is rendered
    const timeoutId = setTimeout(checkOverflow, 100);

    // Also check on window resize
    window.addEventListener("resize", checkOverflow);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [data, template, visibleFields]);

  // Handle keyboard shortcuts
  useEffect(() => {
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
      if (e.key === "Escape" && isFullscreen) {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const getTemplateDisplayName = (templateId: string) => {
    const templates: Record<string, string> = {
      modern: "Modern Professional",
      professional: "Professional Elite",
      sidebar: "Sidebar Professional",
      recruiter: "Recruiter Focused",
      creative: "Creative Designer",
      executive: "Executive",
      minimal: "Minimal",
      technical: "Technical",
    };
    return templates[templateId] || "Modern Professional";
  };

  return (
    <div
      ref={containerRef}
      className={`${className} ${isFullscreen ? "fixed inset-0 z-50 bg-white" : ""}`}
    >
      <Card className="h-full">
        <CardHeader className={`${isMobile ? "pb-2" : "pb-3"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className={`${isMobile ? "text-base" : "text-lg"}`}>
                {isMobile ? "Preview" : "Live Preview"}
              </CardTitle>
              {!isMobile && (
                <Badge variant="outline" className="text-xs">
                  {getTemplateDisplayName(template)}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <div
                className={`flex items-center gap-1 border rounded-md p-1 ${isMobile ? "scale-90" : ""}`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={zoomOut}
                  disabled={zoom <= 0.3}
                  className={`${isMobile ? "h-6 w-6" : "h-7 w-7"} p-0`}
                >
                  <ZoomOut className={`${isMobile ? "w-3 h-3" : "w-3 h-3"}`} />
                </Button>
                <span
                  className={`${isMobile ? "text-xs" : "text-xs"} font-mono ${isMobile ? "min-w-[2.5rem]" : "min-w-[3rem]"} text-center`}
                >
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={zoomIn}
                  disabled={zoom >= 2}
                  className={`${isMobile ? "h-6 w-6" : "h-7 w-7"} p-0`}
                >
                  <ZoomIn className={`${isMobile ? "w-3 h-3" : "w-3 h-3"}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetZoom}
                  className={`${isMobile ? "h-6 w-6" : "h-7 w-7"} p-0`}
                >
                  <RotateCcw
                    className={`${isMobile ? "w-3 h-3" : "w-3 h-3"}`}
                  />
                </Button>
              </div>
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="h-7 w-7 p-0"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3 h-3" />
                  ) : (
                    <Maximize2 className="w-3 h-3" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Mobile template badge */}
          {isMobile && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {getTemplateDisplayName(template)}
              </Badge>
            </div>
          )}
        </CardHeader>

        {/* ATS Warning Message */}
        {isOverflowing && (
          <div className="px-4 pb-2">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>ATS Optimization Alert:</strong> Your resume content
                exceeds one page.
                <strong>
                  Single-page resumes have up to 40% higher ATS (Applicant
                  Tracking System) success rates
                </strong>
                and are preferred by 76% of recruiters. Consider condensing your
                content for better visibility.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div
          ref={previewRef}
          className={`relative bg-gray-100 flex justify-center items-center overflow-auto ${isMobile ? "mobile-scroll" : ""}`}
          style={{
            height: isFullscreen
              ? "calc(100vh - 60px)"
              : isMobile
                ? "calc(100vh - 160px)"
                : "600px",
          }}
        >
          <div
            className="transition-transform duration-200"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: isMobile ? "top left" : "top center",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <div
              ref={resumeContentRef}
              className="relative"
              style={{
                maxHeight: "1050px", // A4 page constraint
                overflow: "hidden",
                width: "210mm", // A4 width
                minHeight: "297mm", // A4 height
              }}
            >
              <ResumePreview
                data={data}
                template={template}
                visibleFields={visibleFields}
              />

              {/* Strict single page restriction - no overflow content shown */}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
