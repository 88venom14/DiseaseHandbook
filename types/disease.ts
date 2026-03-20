/**
 * Disease interface matching Google Sheets schema columns.
 */
export interface Disease {
  id: string;
  name: string;
  category: string;
  symptoms: string;
  causes: string;
  treatments: string;
  warning_level: "low" | "medium" | "high" | "critical";
  image_url?: string;
}

/**
 * Category type derived from diseases
 */
export interface Category {
  name: string;
  count: number;
  icon?: string;
}

/**
 * Possible loading / error states
 */
export interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}
