import { Disease } from "@/types/disease";

// ─── Configuration ───────────────────────────────────────────
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_SHEETS_API_KEY ?? "";
const SPREADSHEET_ID = process.env.EXPO_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID ?? "";
const SHEET_NAME = process.env.EXPO_PUBLIC_GOOGLE_SHEETS_SHEET_NAME ?? "diseases";

// ─── Retry Configuration ─────────────────────────────────────
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000; // 1 second

/**
 * Build the Google Sheets API v4 URL for fetching all rows.
 */
function buildSheetsUrl(): string {
  return (
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}` +
    `/values/${SHEET_NAME}?key=${API_KEY}`
  );
}

/**
 * Normalize a warning_level string to one of the known severity levels.
 */
function normalizeWarningLevel(raw: string): Disease["warning_level"] {
  const lower = raw?.toLowerCase().trim() ?? "low";
  if (lower === "critical") return "critical";
  if (lower === "high") return "high";
  if (lower === "medium") return "medium";
  return "low";
}

/**
 * Parse the raw 2-D array from Sheets API into typed Disease objects.
 * First row is expected to be headers.
 */
function parseSheetRows(rows: string[][]): Disease[] {
  if (!rows || rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const dataRows = rows.slice(1);

  return dataRows.map((row) => {
    const get = (col: string): string => {
      const idx = headers.indexOf(col);
      return idx >= 0 && idx < row.length ? row[idx] : "";
    };

    return {
      id: get("id"),
      name: get("name"),
      category: get("category"),
      symptoms: get("symptoms"),
      causes: get("causes"),
      treatments: get("treatments"),
      warning_level: normalizeWarningLevel(get("warning_level")),
      image_url: get("image_url") || undefined,
    } satisfies Disease;
  });
}

/**
 * Sleep for a given number of milliseconds.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch with exponential backoff retry logic.
 */
async function fetchWithRetry(
  url: string,
  retries = MAX_RETRIES
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return response;
      }

      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        const errorBody = await response.text();
        throw new Error(
          `Google Sheets API error (${response.status}): ${errorBody}`
        );
      }

      // Server error (5xx) - retry
      lastError = new Error(`Server error (${response.status})`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Network error");

      // Don't retry on abort or client errors
      if (lastError.name === "AbortError") {
        throw lastError;
      }
    }

    // If we have retries left, wait with exponential backoff
    if (attempt < retries) {
      const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt);
      await sleep(delay);
    }
  }

  throw lastError || new Error("Failed to fetch after retries");
}

/**
 * Fetch all diseases from Google Sheets.
 * Throws on network / API errors after retry attempts.
 */
export async function fetchDiseases(): Promise<Disease[]> {
  const url = buildSheetsUrl();
  const response = await fetchWithRetry(url);

  const json = (await response.json()) as { values?: string[][] };

  if (!json.values) {
    throw new Error("No data found in the Google Sheet.");
  }

  return parseSheetRows(json.values);
}
