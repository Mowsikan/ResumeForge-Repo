import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePurchases } from "@/hooks/usePurchases";
import { logError } from "@/utils/errorUtils";
import { withSilentNetworkRetry } from "@/utils/networkUtils";
import { shouldAttemptApiCall } from "@/utils/supabaseHealth";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  free_downloads_remaining: number;
  email: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export const useDownloads = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get premium download info from existing hook
  const { 
    canDownload: canDownloadPremium, 
    totalDownloadsRemaining: premiumDownloadsRemaining,
    consumeDownload: consumePremiumDownload,
    loading: premiumLoading,
    refreshPurchases
  } = usePurchases();

  // Calculate total downloads (free + premium)
  const freeDownloadsRemaining = profile?.free_downloads_remaining || 0;
  const totalDownloadsRemaining = freeDownloadsRemaining + premiumDownloadsRemaining;
  
  // User can download if they have either free or premium downloads
  const canDownload = freeDownloadsRemaining > 0 || canDownloadPremium;

  const fetchProfile = async () => {
    if (!user?.id) {
      console.log("No user ID available, skipping profile fetch");
      setLoading(false);
      setProfile(null);
      return;
    }

    try {
      console.log("Fetching profile for user:", user.id);

      // Check connectivity
      let canConnect = false;
      try {
        canConnect = await shouldAttemptApiCall();
      } catch (connectError) {
        console.debug("Connectivity check failed:", connectError);
        canConnect = false;
      }

      if (!canConnect) {
        console.debug("Connectivity check failed, skipping profile fetch");
        setProfile(null);
        setLoading(false);
        return;
      }

      const result = await withSilentNetworkRetry(async () => {
        const response = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (response.error) throw response.error;
        return response;
      }, "Fetching user profile");

      if (!result) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data } = result;
      console.log("Fetched profile:", data);
      setProfile(data);
    } catch (error) {
      setProfile(null);
      if (import.meta.env.DEV) {
        console.debug("Profile fetching failed (suppressed):", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const consumeFreeDownload = async () => {
    if (!user || !profile || profile.free_downloads_remaining <= 0) {
      return false;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          free_downloads_remaining: profile.free_downloads_remaining - 1,
        })
        .eq("id", user.id);

      if (error) throw error;

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        free_downloads_remaining: prev.free_downloads_remaining - 1
      } : null);

      console.log("Free download consumed. Remaining:", profile.free_downloads_remaining - 1);
      return true;
    } catch (error) {
      logError("Error consuming free download", error);
      return false;
    }
  };

  const consumeDownload = async () => {
    // First try to use free downloads, then premium
    if (freeDownloadsRemaining > 0) {
      const success = await consumeFreeDownload();
      if (success) {
        // Show appropriate message based on remaining downloads
        const remaining = (profile?.free_downloads_remaining || 1) - 1;
        if (remaining === 0) {
          toast({
            title: "Free download used! 🎉",
            description: "You've used your 1 free download without watermark. Upgrade to premium for unlimited clean downloads!",
            variant: "default",
          });
        } else {
          toast({
            title: "Free download successful! ✨",
            description: `Download completed! You have ${remaining} free download(s) remaining.`,
            variant: "default",
          });
        }
        return true;
      }
      return false;
    } else if (canDownloadPremium) {
      return await consumePremiumDownload();
    }
    return false;
  };

  // Set up real-time subscription for profile changes
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel("profile_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Profile updated via real-time:", payload);
          fetchProfile();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    canDownload,
    loading: loading || premiumLoading,
    freeDownloadsRemaining,
    premiumDownloadsRemaining,
    totalDownloadsRemaining,
    consumeDownload,
    refreshProfile: fetchProfile,
    refreshPurchases,
  };
};
