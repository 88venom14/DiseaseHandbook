import { useCallback, useMemo } from "react";
import { useDiseasesStore } from "@/store/diseasesStore";
import { Disease } from "@/types/disease";

/**
 * Hook for search functionality with score-based ranking.
 */
export function useSearch() {
  const searchQuery = useDiseasesStore((s) => s.searchQuery);
  const setSearchQuery = useDiseasesStore((s) => s.setSearchQuery);
  const diseases = useDiseasesStore((s) => s.diseases);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  const searchResults: Disease[] = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const q = searchQuery.toLowerCase().trim();

    const scored = diseases
      .map((disease) => {
        let score = 0;
        const nameLower = disease.name.toLowerCase();
        const symptomsLower = disease.symptoms.toLowerCase();
        const categoryLower = disease.category.toLowerCase();

        if (nameLower === q) score += 100;
        else if (nameLower.startsWith(q)) score += 80;
        else if (nameLower.includes(q)) score += 60;

        if (categoryLower.includes(q)) score += 40;
        if (symptomsLower.includes(q)) score += 20;

        return { disease, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.map((item) => item.disease);
  }, [searchQuery, diseases]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, [setSearchQuery]);

  const hasResults = searchResults.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  return {
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    searchResults,
    clearSearch,
    hasResults,
    isSearching,
  };
}
