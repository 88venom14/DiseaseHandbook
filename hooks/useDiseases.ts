import { useEffect } from "react";
import { useDiseasesStore } from "@/store/diseasesStore";

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
