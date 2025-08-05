import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Download, Palette, Image, Loader2 } from "lucide-react";
import { getTemplateById } from "@/types/templates";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResumeActionsProps {
  currentTemplate: string;
  onTemplateChange: (templateId: string) => void;
  onSave: () => void;
  onDownload: () => void;
  onImageDownload?: () => void;
  onOpenTemplateSelector: () => void;
  isSaving?: boolean;
  isDownloadingImage?: boolean;
  title: string;
  onTitleChange: (title: string) => void;
}

export const ResumeActions = ({
  currentTemplate,
  onTemplateChange,
  onSave,
  onDownload,
  onImageDownload,
  onOpenTemplateSelector,
  isSaving = false,
  isDownloadingImage = false,
  title,
  onTitleChange,
}: ResumeActionsProps) => {
  const currentTemplateData = getTemplateById(currentTemplate);
  const isMobile = useIsMobile();

  return (
    <div className={`space-y-4 ${isMobile ? "p-4" : ""}`}>
      <div>
        <Label
          htmlFor="resume-title"
          className="text-sm font-medium text-gray-700"
        >
          Resume Title
        </Label>
        <Input
          id="resume-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={`mt-1 ${isMobile ? "h-12" : ""}`}
          placeholder="Enter resume title"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700">Template</Label>
        <Button
          onClick={onOpenTemplateSelector}
          variant="outline"
          className={`w-full mt-1 justify-start ${isMobile ? "h-12" : ""}`}
        >
          <Palette className="w-4 h-4 mr-2" />
          {currentTemplateData?.name || "Modern Classic"}
          <span className="ml-auto text-xs text-gray-500">Change</span>
        </Button>
      </div>

      {/* Download Recommendation for Mobile */}
    
      
      <div className={`flex gap-2 ${isMobile ? "flex-col" : ""}`}>
        <Button
          onClick={onSave}
          disabled={isSaving}
          className={`${isMobile ? "w-full h-12" : "flex-1"} bg-gradient-primary hover:opacity-90`}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Resume"}
        </Button>

        {onImageDownload && (
          <div className="relative">
            <Button
              onClick={onImageDownload}
              disabled={isDownloadingImage}
              className={`${isMobile ? "w-full h-12" : "flex-1"} bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg`}
            >
              {isDownloadingImage ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Image className="w-4 h-4 mr-2" />
              )}
              <span className="font-medium">Image Download</span>
            </Button>
           
          </div>
        )}

       <Button
  onClick={onDownload}
  className={`${isMobile ? "w-full h-12" : "flex-1"} bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg`}
>
  <Download className="w-4 h-4 mr-2" />
  <span className="font-medium">PDF</span>
</Button>

      </div>
    </div>
  );
};
