import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ResumeData } from "@/types/resume";

interface DownloadedResume {
  id: string;
  title: string;
  resume_data: ResumeData;
  template_id: string;
  downloaded_at: string;
}

export const useDownloadedResumeOperations = () => {
  const { toast } = useToast();

  const saveDownloadedResume = async (
    resumeData: ResumeData,
    title: string,
    templateId: string,
    userId?: string,
    downloadedResumeId?: string,
  ) => {
    if (!userId) return null;

    try {
      const payload = {
        user_id: userId,
        title: title,
        resume_data: resumeData as any,
        template_id: templateId,
        downloaded_at: new Date().toISOString(),
      };

      let data, error;
      if (downloadedResumeId) {
        // Update existing downloaded resume
        ({ data, error } = await supabase
          .from("downloaded_resumes")
          .update(payload)
          .eq("id", downloadedResumeId)
          .select()
          .single());
      } else {
        // Insert new downloaded resume
        ({ data, error } = await supabase
          .from("downloaded_resumes")
          .insert(payload)
          .select()
          .single());
      }

      if (error) throw error;

      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error saving downloaded resume:", errorMessage, error);
      return null;
    }
  };

  const deleteDownloadedResume = async (resumeId: string, userId?: string) => {
    try {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Delete the resume from the database
      const { error } = await supabase
        .from("downloaded_resumes")
        .delete()
        .eq("id", resumeId)
        .eq("user_id", userId);

      if (error) {
        const errorMessage = error.message || "Unknown database error";
        console.error("Error deleting downloaded resume:", errorMessage, error);
        throw new Error(`Failed to delete downloaded resume: ${errorMessage}`);
      }

      toast({
        title: "Success",
        description: "Downloaded resume deleted successfully",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error in deleteDownloadedResume:", errorMessage, error);
      toast({
        title: "Error",
        description: `Failed to delete downloaded resume: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const loadDownloadedResumeForEditing = (
    downloadedResume: DownloadedResume,
  ) => {
    return {
      resumeData: downloadedResume.resume_data,
      title: downloadedResume.title,
      templateId: downloadedResume.template_id,
      isFromDownloaded: true,
      downloadedResumeId: downloadedResume.id,
    };
  };

  return {
    saveDownloadedResume,
    deleteDownloadedResume,
    loadDownloadedResumeForEditing,
  };
};
