// Ensure these imports are at the top of the file
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { downloadResumeAsPdfFromImage } from "@/utils/imageToPdf";
import {
  downloadResumeAsPdfWithWatermark,
  downloadResumeAsImageWithWatermark,
} from "@/utils/watermarkDownload";
import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeActions } from "@/components/ResumeActions";
import { AchievementsInput } from "@/components/AchievementsInput";
import { SkillsInput } from "@/components/SkillsInput";
import { LanguagesInput } from "@/components/LanguagesInput";
import { ATSSolutionTooltip } from "@/components/ATSSolutionTooltip";
import { ResumeEditLoader } from "@/components/ResumeEditLoader";
import { PricingModal } from "@/components/PricingModal";
import { AuthModal } from "@/components/AuthModal";
import { TemplateSelector } from "@/components/TemplateSelector";
import { ResumePreview } from "@/components/ResumePreview";
import { ResumePreviewModal } from "@/components/ResumePreviewModal";
import { WatermarkChoiceModal } from "@/components/WatermarkChoiceModal";
import { FreeDownloadExhaustedModal } from "@/components/FreeDownloadExhaustedModal";
// import { BuilderSidebar } from "@/components/BuilderSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResumes } from "@/hooks/useResumes";
import { useAuth } from "@/hooks/useAuth";
import { useDownloads } from "@/hooks/useDownloads";
import { useToast } from "@/hooks/use-toast";
import { ResumeData } from "@/types/resume";
import { TEMPLATES, getTemplateById } from "@/types/templates";
import {
  Plus,
  Trash2,
  Download,
  Save,
  Eye,
  EyeOff,
  Loader2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Crown,
  Star,
  Palette,
  Menu,
  X,
  Home,
  FileText,
  User,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { downloadResumeAsImage } from "@/utils/imageDownload";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ResumeFieldVisibility } from "@/components/ResumePreview";

// Dummy data for initial preview
const dummyResumeData: ResumeData = {
  fullName: "John Doe",
  email: "john.doe@email.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  website: "https://johndoe.com",
  linkedin: "LinkedIn",
  github: "GitHub",
  summary:
    "Experienced Software Engineer with 5+ years of expertise in full-stack development. Passionate about creating scalable web applications to deliver high-quality software solutions.",
  achievements: [
    "Led development of microservices architecture that improved system performance by 40%",
    "Mentored 5 junior developers and established coding best practices",
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
      year: "2019",
      grade: "3.8 GPA",
    },
  ],
  skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python"],
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
      name: "E-commerce Platform",
      description:
        "Built a full-stack e-commerce platform with React, Node.js, and Stripe integration. Implemented user authentication, product catalog, and order management system.",
      technologies: "React, Node.js, Express, MongoDB, Stripe API",
      link: "Link",
    },
  ],
};

const Builder = () => {
  const { user } = useAuth();
  const { saveResume, saveDownloadedResume } = useResumes();
  const {
    canDownload,
    freeDownloadsRemaining,
    premiumDownloadsRemaining,
    totalDownloadsRemaining,
    consumeDownload,
    refreshProfile,
    refreshPurchases
  } = useDownloads();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const previewRef = useRef<HTMLDivElement>(null);

  // State management - Initialize with dummy data
  const [resumeData, setResumeData] = useState<ResumeData>(dummyResumeData);
  const [currentTemplate, setCurrentTemplate] = useState("modern-simple");
  const [resumeTitle, setResumeTitle] = useState("My Professional Resume");
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [downloadedResumeId, setDownloadedResumeId] = useState<string | null>(
    null,
  );
  const [isFromDownloaded, setIsFromDownloaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isContentOverflowing, setIsContentOverflowing] = useState(false);
  const [showWatermarkChoice, setShowWatermarkChoice] = useState(false);
  const [showFreeDownloadExhausted, setShowFreeDownloadExhausted] = useState(false);
  const [pendingDownloadType, setPendingDownloadType] = useState<
    "PDF" | "Image"
  >("PDF");
  const resumeContentRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("personal");

  // Mobile detection
  const isMobile = useIsMobile();

  // Preview controls state - Start with 100% zoom (1.0)
  const [zoom, setZoom] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Add state for visible fields (all true by default)
  const defaultVisibleFields = {
    fullName: true,
    email: true,
    phone: true,
    location: true,
    website: true,
    linkedin: true,
    github: true,
    summary: true,
    achievements: true,
    experience: true,
    education: true,
    skills: true,
    languages: true,
    certifications: true,
    projects: true,
  };
  const [visibleFields, setVisibleFields] =
    useState<Record<string, boolean>>(defaultVisibleFields);

  // Tab navigation and progress tracking
  const tabs = ["personal", "experience", "education", "skills", "additional"];

  // Resume level indicator - calculates completion percentage based on filled fields
  // Only considers fields that are currently visible (as toggled by ResumeFieldVisibility)
  const getResumeLevel = () => {
    let totalFields = 0;
    let filledFields = 0;

    // Essential fields (weighted more heavily) - only count if visible
    const essentialFields = [
      {
        field: resumeData.fullName,
        weight: 2,
        visible: visibleFields.fullName,
      },
      { field: resumeData.email, weight: 2, visible: visibleFields.email },
      { field: resumeData.phone, weight: 1, visible: visibleFields.phone },
      { field: resumeData.summary, weight: 2, visible: visibleFields.summary },
    ];

    essentialFields.forEach(({ field, weight, visible }) => {
      if (visible) {
        totalFields += weight;
        if (field && field.trim()) {
          filledFields += weight;
        }
      }
    });

    // Experience section - only count if visible
    if (visibleFields.experience) {
      totalFields += 3;
      if (resumeData.experience.length > 0) {
        const hasCompleteExperience = resumeData.experience.some(
          (exp) => exp.position && exp.company && exp.description,
        );
        filledFields += hasCompleteExperience ? 3 : 1;
      }
    }

    // Education section - only count if visible
    if (visibleFields.education) {
      totalFields += 2;
      if (resumeData.education.length > 0) {
        const hasCompleteEducation = resumeData.education.some(
          (edu) => edu.degree && edu.school,
        );
        filledFields += hasCompleteEducation ? 2 : 1;
      }
    }

    // Skills section - only count if visible
    if (visibleFields.skills) {
      totalFields += 2;
      if (resumeData.skills.length > 0) {
        filledFields += resumeData.skills.length >= 3 ? 2 : 1;
      }
    }

    // Optional sections - only count if visible
    let optionalSectionsCount = 0;
    if (visibleFields.projects) {
      optionalSectionsCount++;
      if (resumeData.projects.length > 0) filledFields += 1;
    }
    if (visibleFields.certifications) {
      optionalSectionsCount++;
      if (resumeData.certifications.length > 0) filledFields += 1;
    }
    if (visibleFields.languages) {
      optionalSectionsCount += 0.5;
      if (resumeData.languages.length > 0) filledFields += 0.5;
    }
    if (visibleFields.achievements) {
      optionalSectionsCount += 0.5;
      if (resumeData.achievements.length > 0) filledFields += 0.5;
    }
    totalFields += optionalSectionsCount;

    // Ensure we have at least 1 total field to avoid division by zero
    if (totalFields === 0) return 0;

    // Calculate percentage
    const percentage = Math.round((filledFields / totalFields) * 100);
    return Math.min(percentage, 100);
  };

  const getTabProgress = (tabId: string) => {
    switch (tabId) {
      case "personal":
        let personalScore = 0;
        let personalTotal = 0;

        // Only count visible personal fields
        if (visibleFields.fullName) {
          personalTotal += 1;
          if (resumeData.fullName && resumeData.fullName.trim())
            personalScore += 1;
        }
        if (visibleFields.email) {
          personalTotal += 1;
          if (resumeData.email && resumeData.email.trim()) personalScore += 1;
        }
        if (visibleFields.phone) {
          personalTotal += 1;
          if (resumeData.phone && resumeData.phone.trim()) personalScore += 1;
        }
        if (visibleFields.summary) {
          personalTotal += 1;
          if (resumeData.summary && resumeData.summary.trim())
            personalScore += 1;
        }
        if (visibleFields.location) {
          personalTotal += 1;
          if (resumeData.location && resumeData.location.trim())
            personalScore += 1;
        }

        return personalTotal > 0
          ? Math.round((personalScore / personalTotal) * 100)
          : 0;

      case "experience":
        if (!visibleFields.experience) return 100; // If not visible, consider complete
        if (resumeData.experience.length === 0) return 0;

        const completeExperiences = resumeData.experience.filter(
          (exp) =>
            exp.position &&
            exp.position.trim() &&
            exp.company &&
            exp.company.trim() &&
            exp.description &&
            exp.description.trim(),
        ).length;

        return resumeData.experience.length > 0
          ? Math.min(
              100,
              (completeExperiences /
                Math.max(1, resumeData.experience.length)) *
                100,
            )
          : 0;

      case "education":
        if (!visibleFields.education) return 100; // If not visible, consider complete
        if (resumeData.education.length === 0) return 0;

        const completeEducation = resumeData.education.filter(
          (edu) =>
            edu.degree && edu.degree.trim() && edu.school && edu.school.trim(),
        ).length;

        return resumeData.education.length > 0
          ? Math.min(
              100,
              (completeEducation / Math.max(1, resumeData.education.length)) *
                100,
            )
          : 0;

      case "skills":
        let skillsProgress = 0;
        let skillsTotal = 0;

        if (visibleFields.skills) {
          skillsTotal += 1;
          if (resumeData.skills.length > 0) {
            skillsProgress += resumeData.skills.length >= 3 ? 1 : 0.5;
          }
        }

        if (visibleFields.languages) {
          skillsTotal += 1;
          if (resumeData.languages.length > 0) {
            skillsProgress += resumeData.languages.length >= 2 ? 1 : 0.5;
          }
        }

        return skillsTotal > 0
          ? Math.round((skillsProgress / skillsTotal) * 100)
          : 100;

      case "additional":
        let additionalScore = 0;
        let additionalTotal = 0;

        // Only count visible additional sections
        if (visibleFields.projects) {
          additionalTotal += 1;
          if (resumeData.projects.length > 0) additionalScore += 1;
        }
        if (visibleFields.certifications) {
          additionalTotal += 1;
          if (resumeData.certifications.length > 0) additionalScore += 1;
        }
        if (visibleFields.achievements) {
          additionalTotal += 1;
          if (resumeData.achievements.length > 0) additionalScore += 1;
        }
        if (visibleFields.languages && !visibleFields.skills) {
          // Only count here if not already counted in skills tab
          additionalTotal += 1;
          if (resumeData.languages.length > 0) additionalScore += 1;
        }

        return additionalTotal > 0
          ? Math.round((additionalScore / additionalTotal) * 100)
          : 100;

      default:
        return 0;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "ArrowRight":
            e.preventDefault();
            const currentIndex = tabs.indexOf(currentTab);
            const nextIndex = (currentIndex + 1) % tabs.length;
            setCurrentTab(tabs[nextIndex]);
            break;
          case "ArrowLeft":
            e.preventDefault();
            const currentLeftIndex = tabs.indexOf(currentTab);
            const prevIndex =
              (currentLeftIndex - 1 + tabs.length) % tabs.length;
            setCurrentTab(tabs[prevIndex]);
            break;
          case "s":
            e.preventDefault();
            handleSave();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [currentTab, tabs]);



  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "Resume Builder";

    // Try to get full name from user metadata
    const fullName = user.user_metadata?.full_name;
    if (fullName) return fullName;

    // Fallback to email username
    if (user.email) {
      return user.email.split("@")[0];
    }

    return "User";
  };

  // Listen for payment success events
  useEffect(() => {
    const handlePaymentSuccess = () => {
      refreshPurchases();
      setShowPricingModal(false);
    };

    window.addEventListener("paymentSuccess", handlePaymentSuccess);
    return () =>
      window.removeEventListener("paymentSuccess", handlePaymentSuccess);
  }, [refreshPurchases]);

  // Load template from URL params
  useEffect(() => {
    const templateParam = searchParams.get("template");
    if (templateParam && getTemplateById(templateParam)) {
      setCurrentTemplate(templateParam);
    }
  }, [searchParams]);

  // Check for page overflow to show ATS warning
  useEffect(() => {
    const checkOverflow = async () => {
      // Use DOM-based measurement for accurate overflow detection
      const overflow = await measureActualContentOverflow();
      setIsContentOverflowing(overflow);
    };

    // Check overflow after a delay to ensure content is fully rendered
    const timeoutId = setTimeout(checkOverflow, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [resumeData, currentTemplate, visibleFields]);

  // Show mobile ATS optimization popup when content overflows
  useEffect(() => {
    if (isMobile && isContentOverflowing) {
      toast({
        title: "⚠️ ATS Optimization Alert",
        description:
          "Your resume exceeds one page. Most ATS systems favor single-page resumes for better scoring and parsing accuracy. Remove some content to fit on a single page for optimal results.",
        variant: "destructive",
        duration: 6000, // Show for 6 seconds
      });
    }
  }, [isMobile, isContentOverflowing, toast]);

  // DOM-based measurement for accurate overflow detection
  const measureActualContentOverflow = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!resumeContentRef.current) {
        resolve(false); // Fallback to no overflow if ref is not available
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

        // Apply the same class names as the actual preview container
        measurementContainer.className =
          resumeContentRef.current.className.replace("overflow-hidden", "");

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

        // Wait a tick for styles to apply and layout to stabilize
        requestAnimationFrame(() => {
          try {
            // Get the actual rendered height
            const actualHeight = measurementContainer.scrollHeight;

            // A4 height is 297mm ≈ 1123px at 96 DPI
            // Convert 297mm to pixels: 297 * (96/25.4) ≈ 1123px
            const a4HeightInPixels = 1123;

            // Clean up
            document.body.removeChild(measurementContainer);

            // Resolve with overflow result
            resolve(actualHeight > a4HeightInPixels);
          } catch (cleanupError) {
            console.warn("Error during measurement cleanup:", cleanupError);
            resolve(!checkContentFitsA4(resumeData));
          }
        });
      } catch (error) {
        console.warn(
          "Error measuring content overflow, falling back to estimation:",
          error,
        );
        resolve(!checkContentFitsA4(resumeData));
      }
    });
  };

  // A4 Content restriction system - Enhanced for better accuracy
  const checkContentFitsA4 = (newData: ResumeData) => {
    // Estimate content length based on character count and sections
    let estimatedHeight = 0;

    // Template-specific adjustments
    const templateMultiplier = getTemplateHeightMultiplier(currentTemplate);

    // Header section (name, contact) - varies by template
    const headerHeight = currentTemplate === "modern-simple" ? 120 : 100;
    estimatedHeight += headerHeight;

    // Summary section - more conservative estimation
    if (newData.summary) {
      const lines = Math.ceil(newData.summary.length / 80); // ~80 chars per line
      estimatedHeight += lines * 20 * templateMultiplier; // ~20px per line
    }

    // Experience section - more conservative
    if (newData.experience && visibleFields.experience) {
      newData.experience.forEach((exp) => {
        estimatedHeight += 50 * templateMultiplier; // Base height per experience (reduced)
        if (exp.description) {
          const lines = Math.ceil(exp.description.length / 90); // ~90 chars per line
          estimatedHeight += lines * 18 * templateMultiplier; // ~18px per line
        }
      });
    }

    // Education section - conservative
    if (newData.education && visibleFields.education) {
      estimatedHeight += newData.education.length * 35 * templateMultiplier; // Reduced from 50
    }

    // Skills section - conservative
    if (newData.skills && visibleFields.skills) {
      const skillLines = Math.ceil(newData.skills.length / 8); // ~8 skills per line
      estimatedHeight += skillLines * 25 * templateMultiplier; // ~25px per line
    }

    // Projects section - conservative
    if (newData.projects && visibleFields.projects) {
      newData.projects.forEach((project) => {
        estimatedHeight += 30 * templateMultiplier; // Base height per project (reduced)
        if (project.description) {
          const lines = Math.ceil(project.description.length / 85); // ~85 chars per line
          estimatedHeight += lines * 16 * templateMultiplier; // ~16px per line
        }
      });
    }

    // Certifications section - conservative
    if (newData.certifications && visibleFields.certifications) {
      estimatedHeight +=
        newData.certifications.length * 25 * templateMultiplier; // Reduced from 35
    }

    // Achievements section - conservative
    if (newData.achievements && visibleFields.achievements) {
      newData.achievements.forEach((achievement) => {
        const lines = Math.ceil(achievement.length / 75); // ~75 chars per line
        estimatedHeight += lines * 16 * templateMultiplier; // ~16px per line
      });
    }

    // Languages - conservative
    if (newData.languages?.length && visibleFields.languages) {
      estimatedHeight += 20 * templateMultiplier; // Reduced from 25
    }

    // Add some padding for spacing between sections
    const visibleSectionCount =
      Object.values(visibleFields).filter(Boolean).length;
    estimatedHeight += visibleSectionCount * 10; // 10px spacing between sections

    // A4 height limit (accounting for margins) - be more generous
    const maxPageHeight = 1050; // Increased from 1050 to be less strict
    return estimatedHeight <= maxPageHeight;
  };

  // Helper function to get template-specific height multipliers
  const getTemplateHeightMultiplier = (templateId: string) => {
    switch (templateId) {
      case "modern-simple":
        return 1.0; // Standard spacing
      case "minimal-professional":
        return 0.9; // Very clean, minimal spacing
      case "classic-professional":
        return 0.85; // Compact sidebar layout
      case "strategic-blue":
        return 0.9; // Compact with borders
      case "creative-profile":
        return 1.05; // More spacing for visual elements
      case "skills-dashboard":
        return 1.1; // Colorful boxes need more space
      case "executive-summary":
        return 0.95; // Professional and compact
      case "developer-portfolio":
        return 1.0; // Monospace but compact code style
      case "academic-research":
        return 1.0; // Standard academic formatting
      case "financial-professional":
        return 0.9; // Compact professional layout
      case "startup-vision":
        return 1.05; // Creative layout with more spacing
      default:
        return 1.0;
    }
  };

  const validateAndUpdateData = (newData: ResumeData) => {
    if (checkContentFitsA4(newData)) {
      setResumeData(newData);
      return true;
    } else {
      toast({
        title: "Content Limit Reached",
        description:
          "Your resume content exceeds one page. Please remove some content to add more.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDisabledFieldClick = () => {
    toast({
      title: "Single Page Optimization Required",
      description:
        "Please remove some content to add this section. ATS scores increase significantly when resumes fit on a single page.",
      variant: "destructive",
    });
  };

  const handleLoadResume = useCallback((data: any) => {
    // Ensure we're updating state properly with spread to trigger re-renders
    setResumeData((prev) => ({ ...prev, ...data.resumeData }));
    setResumeTitle(data.title || "My Professional Resume");
    if (data.templateId && getTemplateById(data.templateId)) {
      setCurrentTemplate(data.templateId);
    }
    setResumeId(data.resumeId || null);
    setDownloadedResumeId(data.downloadedResumeId || null);
    setIsFromDownloaded(data.isFromDownloaded || false);
  }, []);

  const handleSave = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveResume(
        resumeData,
        resumeTitle,
        resumeId,
        currentTemplate,
      );
      if (result && !resumeId) {
        setResumeId(result.id);
      }

      // Show success toast for manual saves
      toast({
        title: "Success",
        description: resumeId
          ? "Resume updated successfully"
          : "Resume saved successfully",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Save error:", errorMessage, error);
    } finally {
      setIsSaving(false);
    }
  };

  // Preview control functions - Updated for 100% default zoom
  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.3));
  const resetZoom = () => setZoom(1.0); // Reset to 100%

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setZoom(1.2); // Slightly larger for fullscreen
    } else {
      setZoom(1.0); // Back to 100%
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setCurrentTemplate(templateId);
    toast({
      title: "Template changed",
      description: `Switched to ${getTemplateById(templateId)?.name || "template"}`,
    });
  };

  const getTemplateDisplayName = (templateId: string) => {
    const template = getTemplateById(templateId);
    return template?.name || "Modern Simple";
  };

  const simulateProgress = (callback: () => void) => {
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setDownloadProgress(100);
      setTimeout(callback, 500);
    }, 2000);
  };

  const handleDownload = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!canDownload) {
      // Show different modals based on user's situation
      if (freeDownloadsRemaining === 0 && premiumDownloadsRemaining === 0) {
        // User has used free download but has no premium downloads
        setShowFreeDownloadExhausted(true);
      } else {
        // Fallback to watermark choice (shouldn't happen with new logic, but keeping for safety)
        setPendingDownloadType("PDF");
        setShowWatermarkChoice(true);
      }
      return;
    }

    // Desktop now uses modal-based approach exactly like mobile
    // This ensures identical download behavior and output
    if (!isMobile) {
      setShowPreviewModal(true);
      return;
    }

    // Mobile download execution - this is the perfect approach we want to copy
    await executeMobileStyleDownload();
  };

  // Mobile-style download execution that both mobile and desktop will use
  const executeMobileStyleDownload = async () => {
    setIsDownloading(true);

    try {
      // Create a temporary modal-like container for perfect mobile-style download
      const downloadContainer = document.createElement("div");
      downloadContainer.style.position = "absolute";
      downloadContainer.style.top = "-9999px";
      downloadContainer.style.left = "-9999px";
      downloadContainer.style.zIndex = "-1";
      downloadContainer.style.width = "210mm";
      downloadContainer.style.height = "auto";
      downloadContainer.style.background = "white";
      downloadContainer.className = "resume-template-content";

      document.body.appendChild(downloadContainer);

      // Create the mobile-style container structure
      const mobileStyleContainer = document.createElement("div");
      mobileStyleContainer.style.width = "210mm";
      mobileStyleContainer.style.minHeight = "297mm";
      mobileStyleContainer.style.background = "white";
      mobileStyleContainer.style.overflow = "visible";
      mobileStyleContainer.className =
        "resume-template-content relative w-full";

      // Clone the resume content exactly as mobile does
      const sourceContent = resumeContentRef.current?.firstElementChild;
      if (sourceContent) {
        const clonedContent = sourceContent.cloneNode(true) as HTMLElement;
        mobileStyleContainer.appendChild(clonedContent);
      }

      downloadContainer.appendChild(mobileStyleContainer);

      // Give DOM time to render properly like mobile
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Apply mobile-style text alignment fix
      const originalContent = mobileStyleContainer.firstElementChild;
      let wrapperDiv = null;
      let textNodes = [];
      if (originalContent) {
        wrapperDiv = document.createElement("div");
        wrapperDiv.style.width = "100%";
        wrapperDiv.appendChild(originalContent);
        mobileStyleContainer.appendChild(wrapperDiv);
        // Select all text elements inside the wrapper
        textNodes = wrapperDiv.querySelectorAll(
          "p, h1, h2, h3, h4, h5, h6, span, li, a, label, strong, em, b, i, td, th, span[data-text]",
        );
        textNodes.forEach((el) => {
          el.style.transform = "translateY(-6px)";
        });
      }

      // Use mobile-style download approach
      const downloadPromise = downloadResumeAsPdfFromImage(
        mobileStyleContainer,
        {
          filename: resumeTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase(),
          quality: 0.98,
          scale: 2,
        },
      );

      // Mobile-style timeout handling
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("PDF download timed out after 2 minutes")),
          120000,
        );
      });

      await Promise.race([downloadPromise, timeoutPromise]);

      // Mobile-style cleanup after export
      if (wrapperDiv && originalContent) {
        textNodes.forEach((el) => {
          el.style.transform = "";
        });
        mobileStyleContainer.removeChild(wrapperDiv);
        mobileStyleContainer.appendChild(originalContent);
      }

      // Cleanup container
      document.body.removeChild(downloadContainer);

      // Consume download credit
      const consumed = await consumeDownload();
      if (!consumed) {
        throw new Error("Failed to process download credit");
      }

      // Save to downloaded resumes
      await saveDownloadedResume(
        resumeData,
        resumeTitle,
        currentTemplate,
        downloadedResumeId,
      );

      toast({
        title: "Success!",
        description: "Your resume PDF has been downloaded successfully.",
      });
    } catch (error) {
      // Mobile-style error handling - cleanup any temporary containers
      try {
        const containers = document.querySelectorAll(
          'div[class*="resume-template-content"]',
        );
        containers.forEach((container) => {
          if (
            container.style.position === "absolute" &&
            container.style.top === "-9999px"
          ) {
            document.body.removeChild(container);
          }
        });
      } catch (cleanupError) {
        console.debug("Error during cleanup:", cleanupError);
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("PDF download error:", errorMessage, error);
      toast({
        title: "Download Failed",
        description: `There was an error downloading your resume PDF: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleImageDownload = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!canDownload) {
      // Show different modals based on user's situation
      if (freeDownloadsRemaining === 0 && premiumDownloadsRemaining === 0) {
        // User has used free download but has no premium downloads
        setShowFreeDownloadExhausted(true);
      } else {
        // Fallback to watermark choice (shouldn't happen with new logic, but keeping for safety)
        setPendingDownloadType("Image");
        setShowWatermarkChoice(true);
      }
      return;
    }

    // Desktop now uses modal-based approach exactly like mobile for images too
    // This ensures identical download behavior and output
    if (!isMobile) {
      setShowPreviewModal(true);
      return;
    }

    // Mobile image download execution - same perfect approach as PDF
    await executeMobileStyleImageDownload();
  };

  // Mobile-style image download execution that both mobile and desktop will use
  const executeMobileStyleImageDownload = async () => {
    setIsDownloadingImage(true);

    try {
      // Create a temporary modal-like container for perfect mobile-style download
      const downloadContainer = document.createElement("div");
      downloadContainer.style.position = "absolute";
      downloadContainer.style.top = "-9999px";
      downloadContainer.style.left = "-9999px";
      downloadContainer.style.zIndex = "-1";
      downloadContainer.style.width = "210mm";
      downloadContainer.style.height = "auto";
      downloadContainer.style.background = "white";
      downloadContainer.className = "resume-template-content";

      document.body.appendChild(downloadContainer);

      // Create the mobile-style container structure
      const mobileStyleContainer = document.createElement("div");
      mobileStyleContainer.style.width = "210mm";
      mobileStyleContainer.style.minHeight = "297mm";
      mobileStyleContainer.style.background = "white";
      mobileStyleContainer.style.overflow = "visible";
      mobileStyleContainer.className =
        "resume-template-content relative w-full";

      // Clone the resume content exactly as mobile does
      const sourceContent = resumeContentRef.current?.firstElementChild;
      if (sourceContent) {
        const clonedContent = sourceContent.cloneNode(true) as HTMLElement;
        mobileStyleContainer.appendChild(clonedContent);
      }

      downloadContainer.appendChild(mobileStyleContainer);

      // Give DOM time to render properly like mobile
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Apply mobile-style text alignment fix
      const originalContent = mobileStyleContainer.firstElementChild;
      let wrapperDiv = null;
      let textNodes = [];
      if (originalContent) {
        wrapperDiv = document.createElement("div");
        wrapperDiv.style.width = "100%";
        wrapperDiv.appendChild(originalContent);
        mobileStyleContainer.appendChild(wrapperDiv);
        // Select all text elements inside the wrapper
        textNodes = wrapperDiv.querySelectorAll(
          "p, h1, h2, h3, h4, h5, h6, span, li, a, label, strong, em, b, i, td, th, span[data-text]",
        );
        textNodes.forEach((el) => {
          el.style.transform = "translateY(-6px)";
        });
      }

      // Use mobile-style download approach
      const downloadPromise = downloadResumeAsImage(mobileStyleContainer, {
        filename: resumeTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase(),
        format: "png",
        quality: 0.98,
        scale: 2,
      });

      // Mobile-style timeout handling
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Image download timed out after 2 minutes")),
          120000,
        );
      });

      await Promise.race([downloadPromise, timeoutPromise]);

      // Mobile-style cleanup after export
      if (wrapperDiv && originalContent) {
        textNodes.forEach((el) => {
          el.style.transform = "";
        });
        mobileStyleContainer.removeChild(wrapperDiv);
        mobileStyleContainer.appendChild(originalContent);
      }

      // Cleanup container
      document.body.removeChild(downloadContainer);

      // Consume download credit
      const consumed = await consumeDownload();
      if (!consumed) {
        throw new Error("Failed to process download credit");
      }

      // Save to downloaded resumes
      await saveDownloadedResume(
        resumeData,
        resumeTitle,
        currentTemplate,
        downloadedResumeId,
      );

      toast({
        title: "Success!",
        description: "Your resume image has been downloaded successfully.",
      });
    } catch (error) {
      // Mobile-style error handling - cleanup any temporary containers
      try {
        const containers = document.querySelectorAll(
          'div[class*="resume-template-content"]',
        );
        containers.forEach((container) => {
          if (
            container.style.position === "absolute" &&
            container.style.top === "-9999px"
          ) {
            document.body.removeChild(container);
          }
        });
      } catch (cleanupError) {
        console.debug("Error during cleanup:", cleanupError);
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Image download error:", errorMessage, error);
      toast({
        title: "Download Failed",
        description: `There was an error downloading your resume image: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsDownloadingImage(false);
    }
  };

  // Handle watermark choice modal actions
  const handleDownloadWithWatermark = async () => {
    setShowWatermarkChoice(false);

    if (pendingDownloadType === "PDF") {
      await executeMobileStyleDownloadWithWatermark();
    } else {
      await executeMobileStyleImageDownloadWithWatermark();
    }
  };

  const handleOpenPricingFromWatermark = () => {
    setShowWatermarkChoice(false);
    setShowPricingModal(true);
  };

  const handleOpenPricingFromFreeExhausted = () => {
    setShowFreeDownloadExhausted(false);
    setShowPricingModal(true);
  };

  const handleShowWatermarkChoiceFromModal = (type: "PDF" | "Image") => {
    setShowPreviewModal(false);
    setPendingDownloadType(type);
    setShowWatermarkChoice(true);
  };

  // Watermark download functions (similar to regular downloads but with watermark enabled)
  const executeMobileStyleDownloadWithWatermark = async () => {
    setIsDownloading(true);

    try {
      // Create a temporary modal-like container for perfect mobile-style download
      const downloadContainer = document.createElement("div");
      downloadContainer.style.position = "absolute";
      downloadContainer.style.top = "-9999px";
      downloadContainer.style.left = "-9999px";
      downloadContainer.style.zIndex = "-1";
      downloadContainer.style.width = "210mm";
      downloadContainer.style.height = "auto";
      downloadContainer.style.background = "white";
      downloadContainer.className = "resume-template-content";

      document.body.appendChild(downloadContainer);

      // Create the mobile-style container structure
      const mobileStyleContainer = document.createElement("div");
      mobileStyleContainer.style.width = "210mm";
      mobileStyleContainer.style.minHeight = "297mm";
      mobileStyleContainer.style.background = "white";
      mobileStyleContainer.style.overflow = "visible";
      mobileStyleContainer.className =
        "resume-template-content relative w-full";

      // Clone the resume content with watermarks exactly as mobile does
      const sourceContent = resumeContentRef.current?.firstElementChild;
      if (sourceContent) {
        const clonedContent = sourceContent.cloneNode(true) as HTMLElement;
        mobileStyleContainer.appendChild(clonedContent);

        // Add watermark overlay to the cloned content (this is what makes it "with watermark")
        const watermarkOverlay = document.createElement("div");
        watermarkOverlay.className =
          "absolute inset-0 pointer-events-none z-50 flex items-center justify-center";

        const watermarkText = document.createElement("div");
        watermarkText.className =
          "text-gray-200 text-6xl font-bold transform rotate-45 opacity-30 select-none";
        watermarkText.style.textShadow = "2px 2px 4px rgba(0,0,0,0.1)";
        watermarkText.style.userSelect = "none";
        watermarkText.style.WebkitUserSelect = "none";
        watermarkText.style.MozUserSelect = "none";
        watermarkText.style.msUserSelect = "none";
        watermarkText.textContent = "PREVIEW";

        watermarkOverlay.appendChild(watermarkText);
        mobileStyleContainer.appendChild(watermarkOverlay);
      }

      downloadContainer.appendChild(mobileStyleContainer);

      // Give DOM time to render properly like mobile
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Apply mobile-style text alignment fix
      const originalContent = mobileStyleContainer.firstElementChild;
      let wrapperDiv = null;
      let textNodes = [];
      if (originalContent) {
        wrapperDiv = document.createElement("div");
        wrapperDiv.style.width = "100%";
        wrapperDiv.appendChild(originalContent);
        mobileStyleContainer.appendChild(wrapperDiv);
        // Select all text elements inside the wrapper
        textNodes = wrapperDiv.querySelectorAll(
          "p, h1, h2, h3, h4, h5, h6, span, li, a, label, strong, em, b, i, td, th, span[data-text]",
        );
        textNodes.forEach((el) => {
          el.style.transform = "translateY(-6px)";
        });
      }

      // Use special watermark-enabled download (doesn't hide watermarks)
      const downloadPromise = downloadResumeAsPdfWithWatermark(
        mobileStyleContainer,
        {
          filename: resumeTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase(),
          quality: 0.98,
          scale: 2,
        },
      );

      // Mobile-style timeout handling
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("PDF download timed out after 2 minutes")),
          120000,
        );
      });

      await Promise.race([downloadPromise, timeoutPromise]);

      // Mobile-style cleanup after export
      if (wrapperDiv && originalContent) {
        textNodes.forEach((el) => {
          el.style.transform = "";
        });
        mobileStyleContainer.removeChild(wrapperDiv);
        mobileStyleContainer.appendChild(originalContent);
      }

      // Cleanup container
      document.body.removeChild(downloadContainer);

      toast({
        title: "Success!",
        description: "Your resume PDF has been downloaded with watermark.",
      });
    } catch (error) {
      // Mobile-style error handling - cleanup any temporary containers
      try {
        const containers = document.querySelectorAll(
          'div[class*="resume-template-content"]',
        );
        containers.forEach((container) => {
          if (
            container.style.position === "absolute" &&
            container.style.top === "-9999px"
          ) {
            document.body.removeChild(container);
          }
        });
      } catch (cleanupError) {
        console.debug("Error during cleanup:", cleanupError);
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("PDF download error:", errorMessage, error);
      toast({
        title: "Download Failed",
        description: `There was an error downloading your resume PDF: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const executeMobileStyleImageDownloadWithWatermark = async () => {
    setIsDownloadingImage(true);

    try {
      // Create a temporary modal-like container for perfect mobile-style download
      const downloadContainer = document.createElement("div");
      downloadContainer.style.position = "absolute";
      downloadContainer.style.top = "-9999px";
      downloadContainer.style.left = "-9999px";
      downloadContainer.style.zIndex = "-1";
      downloadContainer.style.width = "210mm";
      downloadContainer.style.height = "auto";
      downloadContainer.style.background = "white";
      downloadContainer.className = "resume-template-content";

      document.body.appendChild(downloadContainer);

      // Create the mobile-style container structure
      const mobileStyleContainer = document.createElement("div");
      mobileStyleContainer.style.width = "210mm";
      mobileStyleContainer.style.minHeight = "297mm";
      mobileStyleContainer.style.background = "white";
      mobileStyleContainer.style.overflow = "visible";
      mobileStyleContainer.className =
        "resume-template-content relative w-full";

      // Clone the resume content with watermarks exactly as mobile does
      const sourceContent = resumeContentRef.current?.firstElementChild;
      if (sourceContent) {
        const clonedContent = sourceContent.cloneNode(true) as HTMLElement;
        mobileStyleContainer.appendChild(clonedContent);

        // Add watermark overlay to the cloned content (this is what makes it "with watermark")
        const watermarkOverlay = document.createElement("div");
        watermarkOverlay.className =
          "absolute inset-0 pointer-events-none z-50 flex items-center justify-center";

        const watermarkText = document.createElement("div");
        watermarkText.className =
          "text-gray-200 text-6xl font-bold transform rotate-45 opacity-30 select-none";
        watermarkText.style.textShadow = "2px 2px 4px rgba(0,0,0,0.1)";
        watermarkText.style.userSelect = "none";
        watermarkText.style.WebkitUserSelect = "none";
        watermarkText.style.MozUserSelect = "none";
        watermarkText.style.msUserSelect = "none";
        watermarkText.textContent = "PREVIEW";

        watermarkOverlay.appendChild(watermarkText);
        mobileStyleContainer.appendChild(watermarkOverlay);
      }

      downloadContainer.appendChild(mobileStyleContainer);

      // Give DOM time to render properly like mobile
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Apply mobile-style text alignment fix
      const originalContent = mobileStyleContainer.firstElementChild;
      let wrapperDiv = null;
      let textNodes = [];
      if (originalContent) {
        wrapperDiv = document.createElement("div");
        wrapperDiv.style.width = "100%";
        wrapperDiv.appendChild(originalContent);
        mobileStyleContainer.appendChild(wrapperDiv);
        // Select all text elements inside the wrapper
        textNodes = wrapperDiv.querySelectorAll(
          "p, h1, h2, h3, h4, h5, h6, span, li, a, label, strong, em, b, i, td, th, span[data-text]",
        );
        textNodes.forEach((el) => {
          el.style.transform = "translateY(-6px)";
        });
      }

      // Use special watermark-enabled download (doesn't hide watermarks)
      const downloadPromise = downloadResumeAsImageWithWatermark(
        mobileStyleContainer,
        {
          filename: resumeTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase(),
          format: "png",
          quality: 0.98,
          scale: 2,
        },
      );

      // Mobile-style timeout handling
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Image download timed out after 2 minutes")),
          120000,
        );
      });

      await Promise.race([downloadPromise, timeoutPromise]);

      // Mobile-style cleanup after export
      if (wrapperDiv && originalContent) {
        textNodes.forEach((el) => {
          el.style.transform = "";
        });
        mobileStyleContainer.removeChild(wrapperDiv);
        mobileStyleContainer.appendChild(originalContent);
      }

      // Cleanup container
      document.body.removeChild(downloadContainer);

      toast({
        title: "Success!",
        description: "Your resume image has been downloaded with watermark.",
      });
    } catch (error) {
      // Mobile-style error handling - cleanup any temporary containers
      try {
        const containers = document.querySelectorAll(
          'div[class*="resume-template-content"]',
        );
        containers.forEach((container) => {
          if (
            container.style.position === "absolute" &&
            container.style.top === "-9999px"
          ) {
            document.body.removeChild(container);
          }
        });
      } catch (cleanupError) {
        console.debug("Error during cleanup:", cleanupError);
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Image download error:", errorMessage, error);
      toast({
        title: "Download Failed",
        description: `There was an error downloading your resume image: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsDownloadingImage(false);
    }
  };

  const addExperience = () => {
    if (isContentOverflowing) {
      toast({
        title: "Cannot Add Experience",
        description:
          "Your resume content exceeds one page. Please remove some content before adding new items.",
        variant: "destructive",
      });
      return;
    }
    const newData = {
      ...resumeData,
      experience: [
        ...resumeData.experience,
        { position: "", company: "", duration: "", description: "" },
      ],
    };
    validateAndUpdateData(newData);
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newData = {
      ...resumeData,
      experience: resumeData.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp,
      ),
    };

    if (checkContentFitsA4(newData)) {
      setResumeData(newData);
    } else {
      toast({
        title: "Content Limit Reached",
        description:
          "This change would exceed the single page limit. Please reduce other content first.",
        variant: "destructive",
      });
    }
  };

  const removeExperience = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    if (isContentOverflowing) {
      toast({
        title: "Cannot Add Education",
        description:
          "Your resume content exceeds one page. Please remove some content before adding new items.",
        variant: "destructive",
      });
      return;
    }
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: "", school: "", year: "", grade: "" },
      ],
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newData = {
      ...resumeData,
      education: resumeData.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu,
      ),
    };

    if (checkContentFitsA4(newData)) {
      setResumeData(newData);
    } else {
      toast({
        title: "Content Limit Reached",
        description:
          "This change would exceed the single page limit. Please reduce other content first.",
        variant: "destructive",
      });
    }
  };

  const removeEducation = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addProject = () => {
    if (isContentOverflowing) {
      toast({
        title: "Cannot Add Project",
        description:
          "Your resume content exceeds one page. Please remove some content before adding new items.",
        variant: "destructive",
      });
      return;
    }
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: "", description: "", technologies: "", link: "" },
      ],
    }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    const newData = {
      ...resumeData,
      projects: resumeData.projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj,
      ),
    };

    if (checkContentFitsA4(newData)) {
      setResumeData(newData);
    } else {
      toast({
        title: "Content Limit Reached",
        description:
          "This change would exceed the single page limit. Please reduce other content first.",
        variant: "destructive",
      });
    }
  };

  const removeProject = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const addCertification = () => {
    if (isContentOverflowing) {
      toast({
        title: "Cannot Add Certification",
        description:
          "Your resume content exceeds one page. Please remove some content before adding new items.",
        variant: "destructive",
      });
      return;
    }
    setResumeData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { name: "", issuer: "", year: "" },
      ],
    }));
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const newData = {
      ...resumeData,
      certifications: resumeData.certifications.map((cert, i) =>
        i === index ? { ...cert, [field]: value } : cert,
      ),
    };

    if (checkContentFitsA4(newData)) {
      setResumeData(newData);
    } else {
      toast({
        title: "Content Limit Reached",
        description:
          "This change would exceed the single page limit. Please reduce other content first.",
        variant: "destructive",
      });
    }
  };

  const removeCertification = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  // Show mobile ATS optimization popup when content overflows
  useEffect(() => {
    if (isMobile && isContentOverflowing) {
      toast({
        title: "⚠️ ATS Optimization Alert",
        description:
          "Your resume exceeds one page. Most ATS systems favor single-page resumes for better scoring and parsing accuracy. Remove some content to fit on a single page for optimal results.",
        variant: "destructive",
        duration: 15000, // Show for 15 seconds
      });
    }
  }, [isMobile, isContentOverflowing, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <ResumeEditLoader onLoadResume={handleLoadResume} />

      {/* Inline Sidebar Component */}
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-xl z-50 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${isMobile ? "w-80" : "w-64"}
      `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/LOGO-RESUMIFY.png"
                alt="Resumify"
                className="h-8 w-8"
              />
              <h2 className="text-xl font-bold text-gray-900">
                Resum
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  ify
                </span>
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.email}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {canDownload ? (
                    <div className="flex items-center gap-1">
                      {freeDownloadsRemaining > 0 && (
                        <Badge
                          variant="outline"
                          className="text-blue-600 border-blue-200 bg-blue-50 text-xs"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          {freeDownloadsRemaining} Free
                        </Badge>
                      )}
                      {premiumDownloadsRemaining > 0 && (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200 bg-green-50 text-xs"
                        >
                          <Crown className="w-3 h-3 mr-1" />
                          {premiumDownloadsRemaining === 999999
                            ? "Unlimited"
                            : `${premiumDownloadsRemaining} Premium`}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-orange-600 border-orange-200 bg-orange-50 text-xs"
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      No Downloads
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 h-auto"
            asChild
          >
            <a href="/">
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </a>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 h-auto"
            asChild
          >
            <a href="/my-resumes">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Saved Resumes</span>
            </a>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 h-auto"
            asChild
          >
            <a href="/downloaded">
              <Download className="w-5 h-5" />
              <span className="font-medium">Downloads</span>
            </a>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 h-auto"
            onClick={() => setShowTemplateSelector(true)}
          >
            <Palette className="w-5 h-5" />
            <span className="font-medium">Templates</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 h-auto"
            onClick={() => setShowPreviewModal(true)}
          >
            <Eye className="w-5 h-5" />
            <span className="font-medium">Preview</span>
          </Button>

          <Button
            variant="ghost"
            className={`
              w-full justify-start gap-3 px-3 py-2 h-auto
              ${isSaving || !user ? "opacity-50 cursor-not-allowed" : ""}
            `}
            onClick={handleSave}
            disabled={isSaving || !user}
          >
            <Save className="w-5 h-5" />
            <span className="font-medium">Save Resume</span>
            {isSaving && (
              <div className="ml-auto">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </Button>

          <Button
            variant="ghost"
            className={`
              w-full justify-start gap-3 px-3 py-2 h-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md transition-all duration-200
              ${!canDownload ? "opacity-50 cursor-not-allowed" : ""}
            `}
            onClick={handleDownload}
            disabled={!canDownload}
          >
            <Download className="w-5 h-5" />
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm">Download PDF</span>
              <span className="text-xs text-red-100">Print ready</span>
            </div>
          </Button>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              © 2025 Resumify. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Simple Sidebar */}
      {sidebarOpen && (
        <>
          {/* Mobile Overlay */}
          {isMobile && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`
            fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg z-50 transition-transform duration-300 ease-in-out
            ${isMobile ? "w-80" : "w-64"}
          `}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/LOGO-RESUMIFY.png"
                    alt="Resumify"
                    className="h-8 w-8"
                  />
                  <h2 className="text-xl font-bold text-gray-900">
                    Resum
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                      ify
                    </span>
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* User Info */}
            {user && (
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {canDownload ? (
                    <div className="flex items-center gap-1">
                      {freeDownloadsRemaining > 0 && (
                        <Badge
                          variant="outline"
                          className="text-blue-600 border-blue-200 bg-blue-50 text-xs"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          {freeDownloadsRemaining} Free
                        </Badge>
                      )}
                      {premiumDownloadsRemaining > 0 && (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200 bg-green-50 text-xs"
                        >
                          <Crown className="w-3 h-3 mr-1" />
                          {premiumDownloadsRemaining === 999999
                            ? "Unlimited"
                            : `${premiumDownloadsRemaining} Premium`}
                        </Badge>
                      )}
                    </div>
                  ) : (
                        <Badge
                          variant="outline"
                          className="text-orange-600 border-orange-200 bg-orange-50 text-xs"
                        >
                          <Crown className="w-3 h-3 mr-1" />
                          No Downloads
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-2 h-auto"
                asChild
              >
                <a href="/">
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </a>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-2 h-auto"
                asChild
              >
                <a href="/my-resumes">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Saved Resumes</span>
                </a>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-2 h-auto"
                asChild
              >
                <a href="/downloaded">
                  <Download className="w-5 h-5" />
                  <span className="font-medium">Downloads</span>
                </a>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-2 h-auto"
                onClick={() => setShowTemplateSelector(true)}
              >
                <Palette className="w-5 h-5" />
                <span className="font-medium">Templates</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-2 h-auto"
                onClick={() => setShowPreviewModal(true)}
              >
                <Eye className="w-5 h-5" />
                <span className="font-medium">Preview</span>
              </Button>

              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 px-3 py-2 h-auto ${
                  isSaving || !user ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSave}
                disabled={isSaving || !user}
              >
                <Save className="w-5 h-5" />
                <span className="font-medium">Save Resume</span>
                {isSaving && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </Button>

              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 px-3 py-2 h-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md transition-all duration-200 ${
                  !canDownload ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleDownload}
                disabled={!canDownload}
              >
                <Download className="w-5 h-5" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm">Download PDF</span>
                  <span className="text-xs text-red-100">Print ready</span>
                </div>
              </Button>
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  © 2025 Resumify. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${sidebarOpen && !isMobile ? "ml-64" : "ml-0"}`}
      >
        {/* Top Bar */}
        <div className="bg-white border-b sticky top-0 z-30 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Menu Toggle Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2"
              >
                <Menu className="w-5 h-5" />
              </Button>

              <h1 className="text-xl font-bold text-gray-900">
                Resume{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  Builder
                </span>
              </h1>
              {user && (
                <div className="flex items-center gap-1">
                  {canDownload ? (
                    <>
                      {freeDownloadsRemaining > 0 && (
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-1 text-blue-600 border-blue-200 bg-blue-50"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          {freeDownloadsRemaining} Free
                        </Badge>
                      )}
                      {premiumDownloadsRemaining > 0 && (
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-1 text-green-600 border-green-200 bg-green-50"
                        >
                          <Crown className="w-3 h-3 mr-1" />
                          {premiumDownloadsRemaining === 999999
                            ? "Unlimited"
                            : `${premiumDownloadsRemaining} Premium`}
                        </Badge>
                      )}
                    </>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-1 text-orange-600 border-orange-200 bg-orange-50"
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      No Downloads
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Actions */}
            {!isMobile && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? (
                    <EyeOff className="w-4 h-4 mr-2" />
                  ) : (
                    <Eye className="w-4 h-4 mr-2" />
                  )}
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !user}
                  variant="outline"
                  size="sm"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save
                </Button>
                {/* Download Options */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* PDF Download */}
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg transform hover:scale-[1.02] transition-all duration-200 min-w-[140px] group"
                    size="sm"
                  >
                    {isDownloading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                        <div className="flex flex-col items-start">
                          <span className="font-semibold text-sm">PDF</span>
                          <span className="text-xs text-red-100">
                            Print ready
                          </span>
                        </div>
                      </div>
                    )}
                  </Button>

                  {/* Image Download */}
                  <Button
                    onClick={handleImageDownload}
                    disabled={isDownloadingImage}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transform hover:scale-[1.02] transition-all duration-200 min-w-[140px] group"
                    size="sm"
                  >
                    {isDownloadingImage ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                        <div className="flex flex-col items-start">
                          <span className="font-semibold text-sm">Image</span>
                          <span className="text-xs text-blue-100">
                            High quality
                          </span>
                        </div>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Download Progress */}
          {isDownloading && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Generating PDF...</span>
                <span>{Math.round(downloadProgress)}%</span>
              </div>
              <Progress value={downloadProgress} className="h-2" />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-4">
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[calc(100vh-120px)] gap-4"
            key="builder-panels"
          >
            {/* Forms Input Panel */}
            <ResizablePanel
              id="forms-panel"
              defaultSize={!isMobile && showPreview ? 45 : 100}
              minSize={35}
              maxSize={isMobile ? 100 : 65}
              order={1}
            >
              <Card className="h-full shadow-lg border-2 border-blue-100">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 p-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Resume Builder
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Create your professional resume
                  </p>
                </div>
                <CardContent className="p-6 h-full overflow-y-auto">
                  <div className="space-y-6">
                    {/* Resume Actions */}
                    <ResumeActions
                      currentTemplate={currentTemplate}
                      onTemplateChange={handleTemplateChange}
                      onSave={handleSave}
                      onDownload={handleDownload}
                      onImageDownload={handleImageDownload}
                      onOpenTemplateSelector={() =>
                        setShowTemplateSelector(true)
                      }
                      isSaving={isSaving}
                      isDownloadingImage={isDownloadingImage}
                      title={resumeTitle}
                      onTitleChange={setResumeTitle}
                    />

                    {/* Resume Level Indicator - Desktop */}
                    {!isMobile && (
                      <div
                        className={`bg-gradient-to-r ${isContentOverflowing ? "from-orange-50 to-red-50 border-orange-200" : "from-blue-50 to-indigo-50 border-blue-200"} border rounded-lg p-4`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3
                            className={`text-sm font-semibold flex items-center gap-2 ${isContentOverflowing ? "text-orange-700" : "text-gray-700"}`}
                          >
                            {isContentOverflowing ? (
                              <AlertTriangle className="w-4 h-4 text-orange-600" />
                            ) : (
                              <Zap className="w-4 h-4 text-blue-600" />
                            )}
                            Resume Strength
                          </h3>
                          <span
                            className={`text-lg font-bold ${isContentOverflowing ? "text-orange-600" : "text-blue-600"}`}
                          >
                            {getResumeLevel()}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              isContentOverflowing
                                ? "bg-orange-500"
                                : getResumeLevel() >= 90
                                  ? "bg-green-500"
                                  : getResumeLevel() >= 70
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                            style={{ width: `${getResumeLevel()}%` }}
                          />
                        </div>
                        <div
                          className={`text-xs ${isContentOverflowing ? "text-orange-700" : "text-gray-600"}`}
                        >
                          {isContentOverflowing ? (
                            <ATSSolutionTooltip>
                              ⚠��� Content exceeds single page! ATS scores drop
                              significantly on multi-page resumes.
                            </ATSSolutionTooltip>
                          ) : getResumeLevel() >= 90 ? (
                            "🎉 Excellent! Your resume is ATS-optimized and complete"
                          ) : getResumeLevel() >= 70 ? (
                            "✨ Good progress! Add more details to reach 90%+"
                          ) : getResumeLevel() >= 50 ? (
                            "�� Keep building! You're halfway there"
                          ) : (
                            "��� Let's get started! Fill in your basic information"
                          )}
                        </div>
                      </div>
                    )}

                    {/* Form Tabs - Enhanced UX */}
                    <Tabs
                      value={currentTab}
                      onValueChange={setCurrentTab}
                      className="w-full"
                    >
                      <div className="sticky top-0 bg-white z-10 pb-2 border-b">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-700">
                            Resume Builder
                          </h3>
                        </div>

                        {/* Mobile Scrollable Tabs */}
                        <div className="block sm:hidden">
                          <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
                            <button
                              onClick={() => setCurrentTab("personal")}
                              className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-lg transition-all duration-200 ${
                                currentTab === "personal"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-50 text-gray-600 hover:bg-blue-50"
                              }`}
                            >
                              <User className="w-4 h-4" />
                              <span className="text-xs">Info</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${getTabProgress("personal")}%`,
                                  }}
                                />
                              </div>
                            </button>

                            <button
                              onClick={() => setCurrentTab("experience")}
                              className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-lg transition-all duration-200 ${
                                currentTab === "experience"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-50 text-gray-600 hover:bg-blue-50"
                              }`}
                            >
                              <FileText className="w-4 h-4" />
                              <span className="text-xs">Work</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${getTabProgress("experience")}%`,
                                  }}
                                />
                              </div>
                            </button>

                            <button
                              onClick={() => setCurrentTab("education")}
                              className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-lg transition-all duration-200 ${
                                currentTab === "education"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-50 text-gray-600 hover:bg-blue-50"
                              }`}
                            >
                              <Star className="w-4 h-4" />
                              <span className="text-xs">Edu</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${getTabProgress("education")}%`,
                                  }}
                                />
                              </div>
                            </button>

                            <button
                              onClick={() => setCurrentTab("skills")}
                              className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-lg transition-all duration-200 ${
                                currentTab === "skills"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-50 text-gray-600 hover:bg-blue-50"
                              }`}
                            >
                              <Zap className="w-4 h-4" />
                              <span className="text-xs">Skills</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${getTabProgress("skills")}%`,
                                  }}
                                />
                              </div>
                            </button>

                            <button
                              onClick={() => setCurrentTab("additional")}
                              className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-lg transition-all duration-200 ${
                                currentTab === "additional"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-50 text-gray-600 hover:bg-blue-50"
                              }`}
                            >
                              <Plus className="w-4 h-4" />
                              <span className="text-xs">More</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${getTabProgress("additional")}%`,
                                  }}
                                />
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Desktop Grid Tabs */}
                        <TabsList className="hidden sm:grid w-full grid-cols-3 md:grid-cols-5 gap-1 h-auto p-1 bg-gray-50 rounded-lg">
                          <TabsTrigger
                            value="personal"
                            className="text-sm py-3 px-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 relative"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>Personal</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${getTabProgress("personal")}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </TabsTrigger>
                          <TabsTrigger
                            value="experience"
                            className="text-sm py-3 px-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 relative"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>Experience</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${getTabProgress("experience")}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </TabsTrigger>
                          <TabsTrigger
                            value="education"
                            className="text-sm py-3 px-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 relative"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <Star className="w-4 h-4" />
                              <span>Education</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${getTabProgress("education")}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </TabsTrigger>
                          <TabsTrigger
                            value="skills"
                            className="text-sm py-3 px-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 relative"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <Zap className="w-4 h-4" />
                              <span>Skills</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${getTabProgress("skills")}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </TabsTrigger>
                          <TabsTrigger
                            value="additional"
                            className="text-sm py-3 px-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 relative"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <Plus className="w-4 h-4" />
                              <span>More</span>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                  className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${getTabProgress("additional")}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </TabsTrigger>
                        </TabsList>

                        {/* Resume Level Indicator - Mobile */}
                        {isMobile && (
                          <div
                            className={`mt-4 bg-gradient-to-r ${isContentOverflowing ? "from-orange-50 to-red-50 border-orange-200" : "from-blue-50 to-indigo-50 border-blue-200"} border rounded-lg p-3`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3
                                className={`text-sm font-semibold flex items-center gap-2 ${isContentOverflowing ? "text-orange-700" : "text-gray-700"}`}
                              >
                                {isContentOverflowing ? (
                                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                                ) : (
                                  <Zap className="w-4 h-4 text-blue-600" />
                                )}
                                Resume Strength
                              </h3>
                              <span
                                className={`text-lg font-bold ${isContentOverflowing ? "text-orange-600" : "text-blue-600"}`}
                              >
                                {getResumeLevel()}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  isContentOverflowing
                                    ? "bg-orange-500"
                                    : getResumeLevel() >= 90
                                      ? "bg-green-500"
                                      : getResumeLevel() >= 70
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                }`}
                                style={{ width: `${getResumeLevel()}%` }}
                              />
                            </div>
                            <div
                              className={`text-xs ${isContentOverflowing ? "text-orange-700" : "text-gray-600"}`}
                            >
                              {isContentOverflowing ? (
                                <ATSSolutionTooltip>
                                  ⚠️ Content exceeds single page! Remove content
                                  for better ATS scores.
                                </ATSSolutionTooltip>
                              ) : getResumeLevel() >= 90 ? (
                                "🎉 Excellent! ATS-optimized"
                              ) : getResumeLevel() >= 70 ? (
                                "✨ Good! Add more details"
                              ) : getResumeLevel() >= 50 ? (
                                "📝 Halfway there! Keep going"
                              ) : (
                                "🚀 Just getting started!"
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Personal Information */}
                      <TabsContent value="personal" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                              id="fullName"
                              value={resumeData.fullName}
                              onChange={(e) => {
                                const value = e.target.value;
                                const newData = {
                                  ...resumeData,
                                  fullName: value,
                                };
                                if (checkContentFitsA4(newData)) {
                                  setResumeData(newData);
                                } else {
                                  toast({
                                    title: "Content Limit Reached",
                                    description:
                                      "This change would exceed the single page limit. Please reduce other content first.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={resumeData.email}
                              onChange={(e) => {
                                const value = e.target.value;
                                const newData = { ...resumeData, email: value };
                                if (checkContentFitsA4(newData)) {
                                  setResumeData(newData);
                                } else {
                                  toast({
                                    title: "Content Limit Reached",
                                    description:
                                      "This change would exceed the single page limit. Please reduce other content first.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              placeholder="john@example.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={resumeData.phone}
                              onChange={(e) => {
                                const value = e.target.value;
                                const newData = { ...resumeData, phone: value };
                                if (checkContentFitsA4(newData)) {
                                  setResumeData(newData);
                                } else {
                                  toast({
                                    title: "Content Limit Reached",
                                    description:
                                      "This change would exceed the single page limit. Please reduce other content first.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={resumeData.location}
                              onChange={(e) => {
                                const value = e.target.value;
                                const newData = {
                                  ...resumeData,
                                  location: value,
                                };
                                if (checkContentFitsA4(newData)) {
                                  setResumeData(newData);
                                } else {
                                  toast({
                                    title: "Content Limit Reached",
                                    description:
                                      "This change would exceed the single page limit. Please reduce other content first.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              placeholder="New York, NY"
                            />
                          </div>
                          <div>
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              value={resumeData.website}
                              onChange={(e) => {
                                const value = e.target.value;
                                const newData = {
                                  ...resumeData,
                                  website: value,
                                };
                                if (checkContentFitsA4(newData)) {
                                  setResumeData(newData);
                                } else {
                                  toast({
                                    title: "Content Limit Reached",
                                    description:
                                      "This change would exceed the single page limit. Please reduce other content first.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              placeholder="https://johndoe.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                              id="linkedin"
                              value={resumeData.linkedin}
                              onChange={(e) => {
                                const value = e.target.value;
                                const newData = {
                                  ...resumeData,
                                  linkedin: value,
                                };
                                if (checkContentFitsA4(newData)) {
                                  setResumeData(newData);
                                } else {
                                  toast({
                                    title: "Content Limit Reached",
                                    description:
                                      "This change would exceed the single page limit. Please reduce other content first.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              placeholder="https://linkedin.com/in/johndoe"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="summary">Professional Summary</Label>
                          <Textarea
                            id="summary"
                            value={resumeData.summary}
                            onChange={(e) => {
                              const value = e.target.value;
                              const newData = { ...resumeData, summary: value };
                              validateAndUpdateData(newData);
                            }}
                            placeholder="Brief overview of your professional background and key achievements..."
                            rows={4}
                          />
                        </div>

                        <AchievementsInput
                          achievements={resumeData.achievements}
                          onChange={(achievements) =>
                            setResumeData((prev) => ({ ...prev, achievements }))
                          }
                        />

                        {/* Field Visibility Controls */}
                        <ResumeFieldVisibility
                          visibleFields={visibleFields}
                          onChange={setVisibleFields}
                        />
                      </TabsContent>

                      {/* Experience */}
                      <TabsContent value="experience" className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">
                            Work Experience
                          </h3>
                          <Button
                            onClick={addExperience}
                            size="sm"
                            disabled={isContentOverflowing}
                            className={
                              isContentOverflowing
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Experience
                          </Button>
                        </div>

                        {resumeData.experience.map((exp, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-medium">
                                Experience {index + 1}
                              </h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeExperience(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Position</Label>
                                <Input
                                  value={exp.position}
                                  onChange={(e) =>
                                    updateExperience(
                                      index,
                                      "position",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Software Engineer"
                                  disabled={isContentOverflowing}
                                  className={
                                    isContentOverflowing ? "opacity-50" : ""
                                  }
                                />
                              </div>
                              <div>
                                <Label>Company</Label>
                                <Input
                                  value={exp.company}
                                  onChange={(e) =>
                                    updateExperience(
                                      index,
                                      "company",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Tech Corp"
                                  disabled={isContentOverflowing}
                                  className={
                                    isContentOverflowing ? "opacity-50" : ""
                                  }
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Duration</Label>
                                <Input
                                  value={exp.duration}
                                  onChange={(e) =>
                                    updateExperience(
                                      index,
                                      "duration",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Jan 2020 - Present"
                                  disabled={isContentOverflowing}
                                  className={
                                    isContentOverflowing ? "opacity-50" : ""
                                  }
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                  value={exp.description}
                                  onChange={(e) =>
                                    updateExperience(
                                      index,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Describe your responsibilities and achievements..."
                                  rows={3}
                                  disabled={isContentOverflowing}
                                  className={
                                    isContentOverflowing ? "opacity-50" : ""
                                  }
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </TabsContent>

                      {/* Education */}
                      <TabsContent value="education" className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Education</h3>
                          <Button
                            onClick={addEducation}
                            size="sm"
                            disabled={isContentOverflowing}
                            className={
                              isContentOverflowing
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Education
                          </Button>
                        </div>

                        {resumeData.education.map((edu, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-medium">
                                Education {index + 1}
                              </h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeEducation(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Degree</Label>
                                <Input
                                  value={edu.degree}
                                  onChange={(e) =>
                                    updateEducation(
                                      index,
                                      "degree",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Bachelor of Science in Computer Science"
                                  disabled={isContentOverflowing}
                                  className={
                                    isContentOverflowing ? "opacity-50" : ""
                                  }
                                />
                              </div>
                              <div>
                                <Label>School</Label>
                                <Input
                                  value={edu.school}
                                  onChange={(e) =>
                                    updateEducation(
                                      index,
                                      "school",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="University of Technology"
                                  disabled={isContentOverflowing}
                                  className={
                                    isContentOverflowing ? "opacity-50" : ""
                                  }
                                />
                              </div>
                              <div>
                                <Label>Year</Label>
                                <Input
                                  value={edu.year}
                                  onChange={(e) =>
                                    updateEducation(
                                      index,
                                      "year",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="2020"
                                  disabled={isContentOverflowing}
                                  className={
                                    isContentOverflowing ? "opacity-50" : ""
                                  }
                                />
                              </div>
                              <div>
                                <Label>Grade (Optional)</Label>
                                <Input
                                  value={edu.grade}
                                  onChange={(e) =>
                                    updateEducation(
                                      index,
                                      "grade",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="3.8 GPA"
                                  disabled={isContentOverflowing}
                                  className={
                                    isContentOverflowing ? "opacity-50" : ""
                                  }
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </TabsContent>

                      {/* Skills */}
                      <TabsContent value="skills" className="space-y-4">
                        <SkillsInput
                          skills={resumeData.skills}
                          onChange={(skills) =>
                            setResumeData((prev) => ({ ...prev, skills }))
                          }
                          disabled={isContentOverflowing}
                          onDisabledClick={handleDisabledFieldClick}
                        />

                        <LanguagesInput
                          languages={resumeData.languages}
                          onChange={(languages) =>
                            setResumeData((prev) => ({ ...prev, languages }))
                          }
                          disabled={isContentOverflowing}
                          onDisabledClick={handleDisabledFieldClick}
                        />
                      </TabsContent>

                      {/* Additional */}
                      <TabsContent value="additional" className="space-y-6">
                        {/* Projects */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Projects</h3>
                            <Button
                              onClick={addProject}
                              size="sm"
                              disabled={isContentOverflowing}
                              className={
                                isContentOverflowing
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Project
                            </Button>
                          </div>

                          {resumeData.projects.map((project, index) => (
                            <Card key={index} className="p-4 mb-4">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="font-medium">
                                  Project {index + 1}
                                </h4>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeProject(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Project Name</Label>
                                  <Input
                                    value={project.name}
                                    onChange={(e) =>
                                      updateProject(
                                        index,
                                        "name",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="E-commerce Platform"
                                    disabled={isContentOverflowing}
                                    className={
                                      isContentOverflowing ? "opacity-50" : ""
                                    }
                                  />
                                </div>
                                <div>
                                  <Label>Technologies</Label>
                                  <Input
                                    value={project.technologies}
                                    onChange={(e) =>
                                      updateProject(
                                        index,
                                        "technologies",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="React, Node.js, MongoDB"
                                    disabled={isContentOverflowing}
                                    className={
                                      isContentOverflowing ? "opacity-50" : ""
                                    }
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <Label>Description</Label>
                                  <Textarea
                                    value={project.description}
                                    onChange={(e) =>
                                      updateProject(
                                        index,
                                        "description",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Describe the project and your role..."
                                    rows={3}
                                    disabled={isContentOverflowing}
                                    className={
                                      isContentOverflowing ? "opacity-50" : ""
                                    }
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <Label>Link (Optional)</Label>
                                  <Input
                                    value={project.link}
                                    onChange={(e) =>
                                      updateProject(
                                        index,
                                        "link",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="https://github.com/username/project"
                                    disabled={isContentOverflowing}
                                    className={
                                      isContentOverflowing ? "opacity-50" : ""
                                    }
                                  />
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>

                        {/* Certifications */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                              Certifications
                            </h3>
                            <Button
                              onClick={addCertification}
                              size="sm"
                              disabled={isContentOverflowing}
                              className={
                                isContentOverflowing
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Certification
                            </Button>
                          </div>

                          {resumeData.certifications.map((cert, index) => (
                            <Card key={index} className="p-4 mb-4">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="font-medium">
                                  Certification {index + 1}
                                </h4>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeCertification(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Certification Name</Label>
                                  <Input
                                    value={cert.name}
                                    onChange={(e) =>
                                      updateCertification(
                                        index,
                                        "name",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="AWS Certified Solutions Architect"
                                    disabled={isContentOverflowing}
                                    className={
                                      isContentOverflowing ? "opacity-50" : ""
                                    }
                                  />
                                </div>
                                <div>
                                  <Label>Issuer</Label>
                                  <Input
                                    value={cert.issuer}
                                    onChange={(e) =>
                                      updateCertification(
                                        index,
                                        "issuer",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Amazon Web Services"
                                    disabled={isContentOverflowing}
                                    className={
                                      isContentOverflowing ? "opacity-50" : ""
                                    }
                                  />
                                </div>
                                <div>
                                  <Label>Year</Label>
                                  <Input
                                    value={cert.year}
                                    onChange={(e) =>
                                      updateCertification(
                                        index,
                                        "year",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="2023"
                                    disabled={isContentOverflowing}
                                    className={
                                      isContentOverflowing ? "opacity-50" : ""
                                    }
                                  />
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>

            {/* Enhanced Preview Panel with Watermark - Desktop Only (but maintains size on mobile for PDF capture) */}
            <ResizablePanel
              id="preview-panel"
              defaultSize={!isMobile && showPreview ? 55 : 55}
              minSize={!isMobile && showPreview ? 35 : 55}
              maxSize={!isMobile && showPreview ? 100 : 55}
              order={2}
              style={{ display: !isMobile && showPreview ? "block" : "none" }} // Hide on mobile but maintain panel size for PDF capture
            >
              <Card
                className={`shadow-xl border-2 border-emerald-100 bg-white/95 backdrop-blur-sm ${isFullscreen ? "fixed inset-0 z-50 bg-white" : ""}`}
              >
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-b border-emerald-200 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-800">
                          Live Preview
                        </h3>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs bg-white border-green-300 text-green-700"
                      >
                        {getTemplateDisplayName(currentTemplate)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 border rounded-md p-1 bg-white">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={zoomOut}
                          disabled={zoom <= 0.3}
                          className="h-7 w-7 p-0"
                        >
                          <ZoomOut className="w-3 h-3" />
                        </Button>

                        <span className="text-xs font-mono min-w-[3rem] text-center">
                          {Math.round(zoom * 100)}%
                        </span>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={zoomIn}
                          disabled={zoom >= 2}
                          className="h-7 w-7 p-0"
                        >
                          <ZoomIn className="w-3 h-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetZoom}
                          className="h-7 w-7 p-0"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      </div>

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
                    </div>
                  </div>
                </div>

                {/* ATS Warning Message */}
                {isContentOverflowing && (
                  <div className="px-4 py-2 border-b">
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        <ATSSolutionTooltip className="block">
                          <strong>ATS Optimization Alert:</strong> Your resume
                          content exceeds one page.
                          <strong className="block mt-1">
                            Single-page resumes have up to 40% higher ATS
                            (Applicant Tracking System) success rates
                          </strong>
                          and are preferred by 76% of recruiters. Consider
                          condensing your content for better visibility.
                        </ATSSolutionTooltip>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                <CardContent className="p-0 h-full w-full overflow-auto bg-gray-100">
                  <div className="h-full w-full flex justify-center items-start py-0">
                    <div
                      ref={previewRef}
                      className="w-full resume-preview bg-white shadow-xl transition-transform duration-200 border border-gray-200 relative"
                      style={{
                        width: "210mm",
                        minHeight: "297mm",
                        transform: `scale(${zoom})`,
                        transformOrigin: "top center",
                        marginBottom: zoom < 0.6 ? "-200px" : "0",
                      }}
                    >
                      {/* Watermark Overlay */}
                      <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
                        <div
                          className="text-gray-200 text-6xl font-bold transform rotate-45 opacity-30 select-none"
                          style={{
                            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            MozUserSelect: "none",
                            msUserSelect: "none",
                          }}
                        >
                          PREVIEW
                        </div>
                      </div>

                      <div
                        ref={resumeContentRef}
                        className="resume-template-content relative w-full"
                        style={{
                          maxHeight: "1200px", // Increased to accommodate longer content
                          overflow: "visible", // Allow content to be visible for proper PDF capture
                          width: "210mm", // A4 width
                          minHeight: "297mm", // A4 height - same as mobile
                        }}
                      >
                        <ResumePreview
                          data={resumeData}
                          template={currentTemplate}
                          visibleFields={visibleFields}
                        />

                        {/* Strict single page restriction - no overflow content shown */}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Mobile Floating Action Button for Preview */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowPreviewModal(true)}
            size="lg"
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 mobile-fab"
          >
            <Eye className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Modals */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleTemplateChange}
        currentTemplateId={currentTemplate}
        resumeData={resumeData}
      />

      {/* Preview Modal - Used by desktop for mobile-style downloads and preview */}
      <ResumePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        data={resumeData}
        template={currentTemplate}
        visibleFields={visibleFields}
        templateDisplayName={getTemplateDisplayName(currentTemplate)}
        onDownload={handleDownload}
        onSave={handleSave}
        isDownloading={isDownloading}
        isSaving={isSaving}
        canDownload={canDownload}
        userDisplayName={user?.email || "Resume Preview"}
        resumeTitle={resumeTitle}
        onDownloadCredit={consumeDownload}
        onSaveDownloadedResume={saveDownloadedResume}
        downloadedResumeId={downloadedResumeId}
        onMobileStylePdfDownload={executeMobileStyleDownload}
        onMobileStyleImageDownload={executeMobileStyleImageDownload}
        isDownloadingImage={isDownloadingImage}
        onShowWatermarkChoice={handleShowWatermarkChoiceFromModal}
      />

      {/* Watermark Choice Modal */}
      <WatermarkChoiceModal
        isOpen={showWatermarkChoice}
        onClose={() => setShowWatermarkChoice(false)}
        onDownloadWithWatermark={handleDownloadWithWatermark}
        onOpenPricing={handleOpenPricingFromWatermark}
        downloadType={pendingDownloadType}
      />

      {/* Free Download Exhausted Modal */}
      <FreeDownloadExhaustedModal
        isOpen={showFreeDownloadExhausted}
        onClose={() => setShowFreeDownloadExhausted(false)}
        onOpenPricing={handleOpenPricingFromFreeExhausted}
      />
    </div>
  );
};

export default Builder;
