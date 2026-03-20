import { useEffect } from "react";
import { useDiseasesStore } from "@/store/diseasesStore";

/**
 * Hook to load diseases on mount and expose store state.
 * Handles initial data fetching with cache-first strategy.
 */
export function useDiseases() {
  const {
    diseases,
    categories,
    isLoading,
    error,
    loadDiseases,
    filteredDiseases,
    getFeaturedDiseases,
    getDiseaseById,
  } = useDiseasesStore();

  useEffect(() => {
    if (diseases.length === 0 && !isLoading) {
      loadDiseases();
    }
  }, []);

  return {
    diseases,
    categories,
    isLoading,
    error,
    reload: loadDiseases,
    filteredDiseases,
    getFeaturedDiseases,
    getDiseaseById,
  };
}
