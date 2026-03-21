import { create } from "zustand";
import { Disease, Category } from "@/types/disease";
import { fetchDiseases } from "@/services/diseaseService";
import { getCachedData, setCachedData } from "@/utils/fetchWithCache";

interface DiseasesState {
  diseases: Disease[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;

  loadDiseases: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;

  filteredDiseases: Disease[];
  getFeaturedDiseases: Disease[];
  getDiseaseById: (id: string) => Disease | undefined;
}

function extractCategories(diseases: Disease[]): Category[] {
  const map = new Map<string, number>();
  diseases.forEach((d) => {
    const cat = d.category.trim();
    map.set(cat, (map.get(cat) ?? 0) + 1);
  });
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const useDiseasesStore = create<DiseasesState>((set, get) => ({
  diseases: [],
  categories: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  selectedCategory: null,

  loadDiseases: async () => {
    set({ isLoading: true, error: null });
    try {
      const cached = await getCachedData<Disease[]>();
      if (cached && cached.length > 0) {
        set({
          diseases: cached,
          categories: extractCategories(cached),
          isLoading: false,
        });
        updateComputed(set, get);
        // Refresh in background
        fetchDiseases()
          .then((fresh) => {
            setCachedData(fresh);
            set({
              diseases: fresh,
              categories: extractCategories(fresh),
            });
            updateComputed(set, get);
          })
          .catch(() => { });
        return;
      }

      const data = await fetchDiseases();
      await setCachedData(data);
      set({
        diseases: data,
        categories: extractCategories(data),
        isLoading: false,
      });
      updateComputed(set, get);
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load diseases",
        isLoading: false,
      });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    updateComputed(set, get);
  },
  setSelectedCategory: (category: string | null) => {
    set({ selectedCategory: category });
    updateComputed(set, get);
  },

  filteredDiseases: [],
  getFeaturedDiseases: [],
  getDiseaseById: (id: string) => {
    return get().diseases.find((d) => d.id === id);
  },
}));

function computeFilteredDiseases(
  diseases: Disease[],
  searchQuery: string,
  selectedCategory: string | null
): Disease[] {
  let result = diseases;

  if (selectedCategory) {
    result = result.filter(
      (d) => d.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.symptoms.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }

  return result;
}

function computeFeaturedDiseases(diseases: Disease[]): Disease[] {
  return diseases
    .filter((d) => d.warning_level === "high" || d.warning_level === "critical")
    .slice(0, 6);
}

function updateComputed(set: any, get: any) {
  const { diseases, searchQuery, selectedCategory } = get();
  set({
    filteredDiseases: computeFilteredDiseases(diseases, searchQuery, selectedCategory),
    getFeaturedDiseases: computeFeaturedDiseases(diseases),
  });
}
