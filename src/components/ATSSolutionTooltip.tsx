import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, CheckCircle } from "lucide-react";

interface ATSSolutionTooltipProps {
  children: React.ReactNode;
  className?: string;
}

export const ATSSolutionTooltip: React.FC<ATSSolutionTooltipProps> = ({
  children,
  className = "",
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`inline-flex items-center gap-1 cursor-help ${className}`}
          >
            {children}
            <InfoIcon className="h-3 w-3 text-blue-500 hover:text-blue-600" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-4 bg-white border border-gray-200 shadow-lg">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-sm">
              How to fix page overflow:
            </h4>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Reduce bullet points in work experience</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Shorten job descriptions to 2-3 lines max</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Remove older or less relevant experience</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Use concise, impactful language</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Hide optional sections (certifications, projects)</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-blue-600 font-medium">
                💡 Tip: Single-page resumes get 40% more recruiter attention
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
