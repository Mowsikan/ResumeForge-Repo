import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Template } from "@/types/templates";
import { ResumeData } from "@/types/resume";
import { ResumePreview } from "./ResumePreview";

// Sample resume data for template previews
const CARD_SAMPLE_RESUME: ResumeData = {
  fullName: "John Doe",
  email: "john.doe@email.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  website: "https://johndoe.com",
  linkedin: "https://linkedin.com/in/johndoe",
  github: "https://github.com/johndoe",
  summary:
    "Experienced Software Engineer with 5+ years of expertise in full-stack development. Passionate about creating scalable web applications and leading cross-functional teams to deliver high-quality software solutions.",
  achievements: [
    "Led development of microservices architecture that improved system performance by 40%",
    "Mentored 5 junior developers and established coding best practices",
    "Reduced application load time by 60% through optimization techniques",
  ],
  experience: [
    {
      position: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      duration: "Jan 2021 - Present",
      description:
        "Lead full-stack development of enterprise web applications using React, Node.js, and AWS. Collaborate with product managers and designers to deliver user-centric solutions. Implement CI/CD pipelines and maintain 99.9% uptime.",
    },
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      school: "University of Technology",
      year: "2020",
      grade: "3.8 GPA",
    },
  ],
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"],
  languages: ["English (Native)", "Spanish (Conversational)"],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2022",
    },
  ],
  projects: [
    {
      name: "E-Commerce Platform",
      description:
        "Built a full-stack e-commerce platform with React, Node.js, and Stripe integration. Implemented user authentication, product catalog, and order management system.",
      technologies: "React, Node.js, Stripe",
      link: "https://github.com/johndoe/ecommerce-platform",
    },
  ],
};

// Helper: Map template id to accent color for border/badge
const TEMPLATE_ACCENTS: Record<string, string> = {
  "classic-professional": "border-blue-500 bg-blue-50 text-blue-700",
  "modern-simple": "border-gray-400 bg-gray-50 text-gray-700",
  "strategic-blue": "border-blue-600 bg-blue-100 text-blue-800",
  "financial-professional": "border-green-500 bg-green-50 text-green-700",
  "creative-profile":
    "border-purple-500 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700",
  "skills-dashboard": "border-teal-500 bg-teal-50 text-teal-700",
  "executive-summary": "border-gray-600 bg-gray-100 text-gray-800",
  "minimal-professional": "border-gray-300 bg-white text-gray-600",
  "developer-portfolio": "border-green-400 bg-gray-900 text-green-400",
  "academic-research": "border-gray-500 bg-gray-50 text-gray-700",
  "startup-vision":
    "border-orange-500 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700",
  // NEW TEMPLATES ACCENTS
  "corporate-elite": "border-indigo-600 bg-indigo-50 text-indigo-800",
  "contemporary-flex": "border-slate-500 bg-slate-50 text-slate-700",
  "enterprise-focus": "border-blue-700 bg-blue-50 text-blue-800",
  "wealth-advisor": "border-emerald-600 bg-emerald-50 text-emerald-800",
  "artistic-portfolio": 
    "border-pink-500 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700",
  "code-architect": "border-cyan-500 bg-cyan-50 text-cyan-800",
  "leadership-vision": "border-amber-600 bg-amber-50 text-amber-800",
  "clean-slate": "border-zinc-300 bg-zinc-50 text-zinc-600",
  "fullstack-pro": "border-lime-500 bg-lime-50 text-lime-800",
  "research-scholar": "border-violet-500 bg-violet-50 text-violet-700",
  "innovation-hub": 
    "border-red-500 bg-gradient-to-r from-red-100 to-orange-100 text-red-700",
  "medical-professional": "border-rose-500 bg-rose-50 text-rose-700",
  "clinical-excellence": "border-teal-500 bg-teal-50 text-teal-700",
};

interface TemplateCardProps {
  template: Template;
  onSelect?: (templateId: string) => void;
  onUse?: (templateId: string) => void;
  showUseButton?: boolean;
  isSelected?: boolean;
  resumeData?: ResumeData;
  className?: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  onUse,
  showUseButton = true,
  isSelected = false,
  resumeData,
  className = "",
}) => {
  if (!template) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded">
        <b>Template not found</b>
      </div>
    );
  }

  const handleClick = () => {
    if (onSelect) {
      onSelect(template.id);
    }
  };

  const handleUse = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUse) {
      onUse(template.id);
    }
  };

  const isListView = className.includes("md:flex-row");
  const accent =
    TEMPLATE_ACCENTS[template.id] || "border-gray-200 bg-white text-gray-700";

  // Use provided resumeData or fallback to sample data for preview
  const previewData = resumeData || CARD_SAMPLE_RESUME;

  // Show all fields for the card preview (full resume)
  const cardVisibleFields = {
    fullName: true,
    email: true,
    phone: true,
    location: true,
    summary: true,
    skills: true,
    languages: true,
    certifications: true,
    experience: true,
    education: true,
    website: true,
    linkedin: true,
    github: true,
    achievements: true,
    projects: true,
  };

  return (
    <div
      className={`group cursor-pointer h-full ${className}`}
      onClick={handleClick}
    >
      <div
        className={`relative border-2 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full ${accent} ${isListView ? "md:flex md:items-center" : ""}`}
      >
        {/* Template Preview */}
        <div
          className={`relative overflow-hidden ${isListView ? "aspect-[3/4] md:aspect-[4/3] md:w-48 md:flex-shrink-0" : "aspect-[3/4]"}`}
        >
          {/* Template Preview Content */}
          <div className="absolute inset-0 p-1 sm:p-2">
            <div className="w-full h-full flex items-start justify-center">
              <div className="w-full h-full transform scale-[0.75] sm:scale-[0.80] origin-top-center">
                <div className="w-[133%] sm:w-[125%] h-[133%] sm:h-[125%] rounded shadow-sm bg-white overflow-hidden border border-gray-200">
                  <ResumePreview
                    data={previewData}
                    template={template.id}
                    visibleFields={cardVisibleFields}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Template Name Badge Overlay */}
          <div
            className={`absolute top-1 sm:top-2 left-1 sm:left-2 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-semibold shadow ${accent} bg-opacity-90`}
          >
            <span className="hidden sm:inline">{template.name}</span>
            <span className="sm:hidden">{template.name.split(" ")[0]}</span>
          </div>

          {/* Mobile-Friendly Use Button Overlay */}
          {showUseButton && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 md:group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
              <Button
                onClick={handleUse}
                className="
                  opacity-0 group-hover:opacity-100
                  transition-all duration-300
                  transform scale-90 group-hover:scale-100
                  bg-blue-600 hover:bg-blue-700 text-white
                  px-4 py-2 text-sm md:text-xs
                  rounded-lg md:rounded-md
                  shadow-lg
                "
                size={isListView ? "sm" : "default"}
              >
                <span className="hidden sm:inline">Use this template</span>
                <span className="sm:hidden">Use Template</span>
              </Button>
            </div>
          )}

          {/* Selected indicator */}
          {isSelected && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-blue-500 text-white text-xs shadow-lg">
                Selected
              </Badge>
            </div>
          )}

          {/* Mobile Quick Action Button */}
          <div className="absolute top-3 left-3 md:hidden">
            <Button
              onClick={handleUse}
              size="sm"
              className="bg-white/90 text-gray-700 hover:bg-white hover:text-blue-600 shadow-md rounded-full w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              +
            </Button>
          </div>
        </div>

        {/* Template Info */}
        <div className={`p-4 ${isListView ? "md:flex-1 md:pl-6" : ""}`}>
          <div className={isListView ? "md:text-left" : "text-center"}>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg mb-2 line-clamp-1">
              {template.name}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2 md:line-clamp-3">
              {template.description}
            </p>

            {/* Category Badge */}
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Badge variant="secondary" className="text-xs">
                {template.category}
              </Badge>

              {/* Mobile Use Button */}
              {showUseButton && (
                <Button
                  onClick={handleUse}
                  size="sm"
                  className="md:hidden bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded-full"
                >
                  Use
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
