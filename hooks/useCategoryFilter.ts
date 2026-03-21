import { useCallback } from "react";
import { useDiseasesStore } from "@/store/diseasesStore";

export function useCategoryFilter() {
  const categories = useDiseasesStore((s) => s.categories);
  const selectedCategory = useDiseasesStore((s) => s.selectedCategory);
  const setSelectedCategory = useDiseasesStore((s) => s.setSelectedCategory);
  const filteredDiseases = useDiseasesStore((s) => s.filteredDiseases);

  const selectCategory = useCallback(
    (category: string | null) => {
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
