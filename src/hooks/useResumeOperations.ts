import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ResumeData } from "@/types/resume";

export const useResumeOperations = () => {
  const { toast } = useToast();

  const saveResume = async (
    resumeData: ResumeData,
    title?: string,
    resumeId?: string,
    templateId?: string,
    userId?: string,
  ) => {
    if (!userId) return null;

    try {
      const payload = {
        user_id: userId,
        title: title || "Untitled Resume",
        resume_data: resumeData as any,
        template_id: templateId || "modern",
        updated_at: new Date().toISOString(),
      };

      console.log("Saving resume with payload:", payload);

      let result;
      if (resumeId) {
        const { data, error } = await supabase
          .from("resumes")
          .update(payload)
          .eq("id", resumeId)
          .select()
          .single();

        if (error) throw error;
        result = data;
        console.log("Resume updated successfully:", result);
      } else {
        const { data, error } = await supabase
          .from("resumes")
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        result = data;
        console.log("Resume created successfully:", result);
      }

      // Note: Toast notifications are now handled in the component that calls this function
      // This allows for better control over when to show notifications (manual saves vs auto-saves)

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error saving resume:", errorMessage, error);
      toast({
        title: "Error",
        description: `Failed to save resume: ${errorMessage}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteResume = async (resumeId: string, userId?: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to delete resumes",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Deleting resume:", { resumeId, userId });

      const { error } = await supabase
        .from("resumes")
        .delete()
        .eq("id", resumeId)
        .eq("user_id", userId); // Also ensure user owns the resume

      if (error) {
        const errorMessage = error.message || "Unknown database error";
        console.error("Supabase delete error:", errorMessage, error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error deleting resume:", errorMessage, error);
      toast({
        title: "Error",
        description: `Failed to delete resume: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  return {
    saveResume,
    deleteResume,
  };
};
