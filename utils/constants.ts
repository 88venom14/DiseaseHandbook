export const BREAKPOINTS = {
  MOBILE: 0,
  TABLET: 768,
  DESKTOP: 1024,
};

export const WARNING_CONFIG = {
  low: { color: "#15803D", bg: "#DCFCE7", label: "Низкий риск" },
  medium: { color: "#A16207", bg: "#FEF9C3", label: "Средний риск" },
  high: { color: "#DC2626", bg: "#FEE2E2", label: "Высокий риск" },
  critical: { color: "#FFFFFF", bg: "#991B1B", label: "Критический риск" },
};

export const CACHE_CONFIG = {
  TTL_MS: 30 * 60 * 1000, // 30 minutes
  KEY: "disease_handbook_cache",
};

export const UI_CONFIG = {
  CARD_BORDER_RADIUS: 16,
  CARD_SHADOW_OPACITY: 0.06,
  CARD_SHADOW_RADIUS: 12,
  HEADER_FONT_SIZE: 28,
  SUBTITLE_FONT_SIZE: 16,
};
