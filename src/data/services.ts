// src/data/services.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Static fallback (used if DB fetch fails or returns nothing)
export const SERVICES_BY_CATEGORY: { [key: string]: string[] } = {
  Plumbing: ["Pipe installation", "Pipe repair", "Leak repair", "Drain cleaning", "Geyser installation"],
  Electrical: ["Wiring", "Switch installation", "Fault finding", "DB board installation", "Lighting"],
  Carpentry: ["Furniture assembly", "Door fitting", "Cabinet making", "Flooring", "Repairs"],
  Painting: ["Interior painting", "Exterior painting", "Plastering", "Waterproofing", "Texture coating"],
  Cleaning: ["Domestic cleaning", "Office cleaning", "Carpet cleaning", "Post-construction cleaning", "Window cleaning"],
  Gardening: ["Lawn mowing", "Tree trimming", "Garden design", "Irrigation", "Weeding"],
};

export function useServicesByCategory(categoryName: string | undefined) {
  const [services, setServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryName) {
      setServices([]);
      return;
    }

    const fetchServices = async () => {
      setLoading(true);
      try {
        // Single query with join — avoids two round trips
        const { data: rows, error } = await supabase
          .from("services")
          .select("name, categories!inner(name)")
          .ilike("categories.name", categoryName)
          .eq("is_active", true)
          .order("name", { ascending: true });

        if (error) {
          console.error("Error fetching services:", error);
          setServices(SERVICES_BY_CATEGORY[categoryName] ?? []);
          return;
        }

        if (rows && rows.length > 0) {
          setServices(rows.map((r) => r.name));
        } else {
          // Fallback to static data if DB returns nothing
          setServices(SERVICES_BY_CATEGORY[categoryName] ?? []);
        }
      } catch (err) {
        console.error("Unexpected error fetching services:", err);
        setServices(SERVICES_BY_CATEGORY[categoryName] ?? []);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryName]);

  return { services, loading };
}
