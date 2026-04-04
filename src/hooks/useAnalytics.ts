// src/hooks/useAnalytics.ts
import { useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

type EventType = "whatsapp_click" | "call_click" | "profile_view" | "website_click";

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

const shouldTrack = (eventType: EventType, providerId: string): boolean => {
  const key = `zs_${eventType}_${providerId}`;
  const last = localStorage.getItem(key);
  if (last && Date.now() - parseInt(last) < COOLDOWN_MS) return false;
  localStorage.setItem(key, String(Date.now()));
  return true;
};

export const useAnalytics = () => {
  const track = useCallback(async (eventType: EventType, providerId: string) => {
    if (!shouldTrack(eventType, providerId)) return;

    const column =
      eventType === "whatsapp_click" ? "click_to_whatsapp_count" :
      eventType === "call_click"     ? "click_to_call_count"     :
      eventType === "website_click"  ? "click_to_website_count"  :
                                       "profile_views";

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id ?? null;

    const [{ error: rpcError }, { error: insertError }] = await Promise.all([
      // 1. Increment the aggregate counter on providers table
      supabase.rpc("increment_provider_stat", {
        p_provider_id: providerId,
        p_column:      column,
      }),
      // 2. Insert a timestamped event row for granular reporting
      supabase.from("provider_lead_events").insert({
        provider_id: providerId,
        user_id:     userId,
        event_type:  eventType,
        // created_at is auto-set by Postgres
      }),
    ]);

    if (rpcError)    console.warn("[analytics] rpc:", rpcError.message);
    if (insertError) console.warn("[analytics] insert:", insertError.message);
  }, []);

  return { track };
};