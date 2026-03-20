import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const CACHE_KEY = "disease_handbook_cache";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Get cached data if it exists and has not expired.
 */
export async function getCachedData<T>(): Promise<T | null> {
  try {
    // On web, use localStorage as fallback if AsyncStorage is not available
    let raw: string | null = null;

    if (Platform.OS === "web") {
      try {
        raw = typeof localStorage !== "undefined" ? localStorage.getItem(CACHE_KEY) : null;
      } catch {
        // localStorage may be unavailable in some environments
        raw = null;
      }
    } else {
      raw = await AsyncStorage.getItem(CACHE_KEY);
    }

    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const age = Date.now() - entry.timestamp;

    if (age > CACHE_TTL_MS) {
      if (Platform.OS === "web") {
        try {
          if (typeof localStorage !== "undefined") {
            localStorage.removeItem(CACHE_KEY);
          }
        } catch {
          // Ignore
        }
      } else {
        await AsyncStorage.removeItem(CACHE_KEY);
      }
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

/**
 * Save data to AsyncStorage cache with current timestamp.
 */
export async function setCachedData<T>(data: T): Promise<void> {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };

    if (Platform.OS === "web") {
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
        }
      } catch {
        // localStorage may be unavailable in some environments
      }
    } else {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    }
  } catch (error) {
    console.warn("Cache write failed:", error);
  }
}

/**
 * Invalidate / clear the cache.
 */
export async function clearCache(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem(CACHE_KEY);
        }
      } catch {
        // Ignore
      }
    } else {
      await AsyncStorage.removeItem(CACHE_KEY);
    }
  } catch (error) {
    console.warn("Cache clear failed:", error);
  }
}
