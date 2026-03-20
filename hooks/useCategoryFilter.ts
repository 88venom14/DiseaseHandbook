import { useCallback } from "react";
import { useDiseasesStore } from "@/store/diseasesStore";

/**
 * Hook for category filtering.
 */
export function useCategoryFilter() {
  const categories = useDiseasesStore((s) => s.categories);
  const selectedCategory = useDiseasesStore((s) => s.selectedCategory);
  const setSelectedCategory = useDiseasesStore((s) => s.setSelectedCategory);
  const filteredDiseases = useDiseasesStore((s) => s.filteredDiseases);

  const selectCategory = useCallback(
    (category: string | null) => {
      // Toggle: if clicking the same category, deselect it
      setSelectedCategory(category === selectedCategory ? null : category);
    },
    [selectedCategory, setSelectedCategory]
  );

  return {
    categories,
    selectedCategory,
    selectCategory,
    filteredDiseases,
  };
}
