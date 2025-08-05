import { ResumeData } from "./resume";

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  previewImage?: string;
}

export const TEMPLATES: Template[] = [
  {
    id: "classic-professional",
    name: "Classic Professional",
    description:
      "Traditional clean layout with left sidebar for contact info and skills",
    category: "Professional",
  },
  {
    id: "modern-simple",
    name: "Modern Simple",
    description:
      "Clean, minimal design with simple typography and clear sections",
    category: "Modern",
  },
  {
    id: "strategic-blue",
    name: "Strategic Blue",
    description:
      "Blue-themed template with strategic overview and core competencies",
    category: "Business",
  },
  {
    id: "financial-professional",
    name: "Financial Professional",
    description:
      "Green-themed professional layout perfect for finance and business roles",
    category: "Finance",
  },
  {
    id: "creative-profile",
    name: "Creative Profile",
    description:
      "Purple gradient design with creative styling and project highlights",
    category: "Creative",
  },
  {
    id: "skills-dashboard",
    name: "Skills Dashboard",
    description:
      "Modern design with skill percentage bars and blue gradient header",
    category: "Tech",
  },
  {
    id: "executive-summary",
    name: "Executive Summary",
    description:
      "Clean two-column layout with executive focus and certifications",
    category: "Executive",
  },
  {
    id: "minimal-professional",
    name: "Minimal Professional",
    description:
      "Very clean, minimal single-column design with optimal spacing",
    category: "Minimal",
  },
  {
    id: "developer-portfolio",
    name: "Developer Portfolio",
    description:
      "Dark theme with code-style formatting and technical project showcase",
    category: "Developer",
  },
  {
    id: "academic-research",
    name: "Academic Research",
    description:
      "Traditional academic format with research interests and publications",
    category: "Academic",
  },
  {
    id: "startup-vision",
    name: "Startup Vision",
    description:
      "Orange gradient with modern icons and startup-style project ventures",
    category: "Startup",
  },
  // NEW TEMPLATES - Second template for each industry
  {
    id: "corporate-elite",
    name: "Corporate Elite",
    description:
      "Premium executive layout with sophisticated design and emphasis on leadership",
    category: "Professional",
  },
  {
    id: "contemporary-flex",
    name: "Contemporary Flex",
    description:
      "Flexible modern design with dynamic sections and contemporary styling",
    category: "Modern",
  },
  {
    id: "enterprise-focus",
    name: "Enterprise Focus",
    description:
      "Enterprise-grade template with structured sections and business metrics",
    category: "Business",
  },
  {
    id: "wealth-advisor",
    name: "Wealth Advisor",
    description:
      "Elegant financial template with charts, metrics, and professional credibility",
    category: "Finance",
  },
  {
    id: "artistic-portfolio",
    name: "Artistic Portfolio",
    description:
      "Creative showcase template with vibrant colors and portfolio emphasis",
    category: "Creative",
  },
  {
    id: "code-architect",
    name: "Code Architect",
    description:
      "Technical template with code snippets, GitHub integration, and tech stacks",
    category: "Tech",
  },
  {
    id: "leadership-vision",
    name: "Leadership Vision",
    description:
      "Executive template focused on leadership achievements and strategic vision",
    category: "Executive",
  },
  {
    id: "clean-slate",
    name: "Clean Slate",
    description:
      "Ultra-minimal template with maximum white space and selective highlighting",
    category: "Minimal",
  },
  {
    id: "fullstack-pro",
    name: "FullStack Pro",
    description:
      "Comprehensive developer template with project showcases and tech expertise",
    category: "Developer",
  },
  {
    id: "research-scholar",
    name: "Research Scholar",
    description:
      "Academic template with publication focus, research interests, and citations",
    category: "Academic",
  },
  {
    id: "innovation-hub",
    name: "Innovation Hub",
    description:
      "Dynamic startup template with growth metrics, venture highlights, and innovation focus",
    category: "Startup",
  },
  {
    id: "medical-professional",
    name: "Medical Professional",
    description:
      "Healthcare-focused template with clinical experience and medical certifications",
    category: "Healthcare",
  },
  {
    id: "clinical-excellence",
    name: "Clinical Excellence",
    description:
      "Modern healthcare template with patient care focus and medical achievements",
    category: "Healthcare",
  },
];

export const getTemplateById = (id: string): Template | undefined => {
  return TEMPLATES.find((template) => template.id === id);
};

export const getTemplatesByCategory = (category: string): Template[] => {
  return TEMPLATES.filter((template) => template.category === category);
};

export const getAllCategories = (): string[] => {
  return [...new Set(TEMPLATES.map((template) => template.category))];
};

export interface TemplateRendererProps {
  templateId: string;
  resumeData: ResumeData;
  visibleFields?: Record<string, boolean>;
}
