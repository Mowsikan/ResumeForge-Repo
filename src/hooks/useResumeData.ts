import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ResumeData } from "@/types/resume";
import { transformDatabaseResume } from "@/utils/resumeDataUtils";
import { logError, formatUserErrorMessage } from "@/utils/errorUtils";
import { withNetworkRetry, withSilentNetworkRetry } from "@/utils/networkUtils";
import { shouldAttemptApiCall } from "@/utils/supabaseHealth";

interface Resume {
  id: string;
  title: string;
  resume_data: ResumeData;
  template_id: string;
  created_at: string;
  updated_at: string;
}

interface DownloadedResume {
  id: string;
  title: string;
  resume_data: ResumeData;
  template_id: string;
  downloaded_at: string;
}

export const useResumeData = (userId?: string) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [downloadedResumes, setDownloadedResumes] = useState<
    DownloadedResume[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchResumes = async () => {
    if (!userId) return;

    try {
      // Check if we should attempt API calls with enhanced error handling
      let canConnect = false;
      try {
        canConnect = await shouldAttemptApiCall();
      } catch (connectError) {
        console.debug("Connectivity check failed:", connectError);
        canConnect = false;
      }

      if (!canConnect) {
        console.debug("Connectivity check failed, skipping resumes fetch");
        setResumes([]);
        setLoading(false);
        return;
      }

      const result = await withSilentNetworkRetry(async () => {
        const response = await supabase
          .from("resumes")
          .select("*")
          .order("updated_at", { ascending: false });

        if (response.error) throw response.error;
        return response;
      }, "Fetching resumes");

      if (!result) {
        // Silent failure - just set empty state
        setResumes([]);
        setLoading(false);
        return;
      }

      const { data } = result;

      const typedResumes = (data || []).map(transformDatabaseResume);
      setResumes(typedResumes);
    } catch (error) {
      // Completely silent error handling for better UX
      setResumes([]);

      // Only debug logging in development
      if (import.meta.env.DEV) {
        console.debug("Resume fetching failed (suppressed):", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDownloadedResumes = async () => {
    if (!userId) return;

    try {
      // Check if we should attempt API calls with enhanced error handling
      let canConnect = false;
      try {
        canConnect = await shouldAttemptApiCall();
      } catch (connectError) {
        console.debug("Connectivity check failed:", connectError);
        canConnect = false;
      }

      if (!canConnect) {
        console.debug(
          "Connectivity check failed, skipping downloaded resumes fetch",
        );
        setDownloadedResumes([]);
        return;
      }

      const result = await withSilentNetworkRetry(async () => {
        const response = await supabase
          .from("downloaded_resumes")
          .select("*")
          .order("downloaded_at", { ascending: false });

        if (response.error) throw response.error;
        return response;
      }, "Fetching downloaded resumes");

      if (!result) {
        // Silent failure - just set empty state
        setDownloadedResumes([]);
        return;
      }

      const { data } = result;
      const typedDownloadedResumes = (data || []).map(transformDatabaseResume);
      setDownloadedResumes(typedDownloadedResumes);
    } catch (error) {
      // Completely silent error handling for better UX
      setDownloadedResumes([]);

      // Only debug logging in development
      if (import.meta.env.DEV) {
        console.debug(
          "Downloaded resumes fetching failed (suppressed):",
          error,
        );
      }
    }
  };

  useEffect(() => {
    if (userId) {
      fetchResumes();
      fetchDownloadedResumes();
    }
  }, [userId]);

  return {
    resumes,
    downloadedResumes,
    loading,
    refreshResumes: fetchResumes,
    refreshDownloadedResumes: fetchDownloadedResumes,
  };
};
