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

export interface Category {
  name: string;
  count: number;
  icon?: string;
}

export interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}
