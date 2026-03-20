import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Category } from "@/types/disease";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

export function CategorySelector({
  categories,
  selectedCategory,
  onSelect,
}: CategorySelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      accessibilityRole="tablist"
    >
      <TouchableOpacity
        style={[styles.chip, !selectedCategory && styles.chipActive, Platform.OS === "web" && (styles.chipWeb as any)]}
        onPress={() => onSelect(null)}
        accessibilityRole="tab"
        accessibilityState={{ selected: !selectedCategory }}
      >
        <Text style={[styles.chipText, !selectedCategory && styles.chipTextActive]}>
          Все
        </Text>
      </TouchableOpacity>

      {categories.map((cat) => {
        const isActive = selectedCategory === cat.name;
        return (
          <TouchableOpacity
            key={cat.name}
            style={[styles.chip, isActive && styles.chipActive, Platform.OS === "web" && (styles.chipWeb as any)]}
            onPress={() => onSelect(cat.name)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {cat.name} ({cat.count})
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  chip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#006eff",
  },
  chipActive: { backgroundColor: "#1A7FE8", borderColor: "#1A7FE8" },
  chipWeb: {
    // @ts-ignore
    cursor: "pointer",
    // @ts-ignore
    transition: "all 0.2s ease",
  },
  chipText: { fontSize: 14, fontWeight: "500", color: "#475569" },
  chipTextActive: { color: "#FFFFFF" },
});
