import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import { useDiseases } from "@/hooks/useDiseases";
import { DiseaseCard } from "@/components/DiseaseCard";
import { DiseaseCardSkeleton } from "@/components/LoadingSkeleton";
import { SearchBar } from "@/components/SearchBar";
import { Category } from "@/types/disease";

interface CategoryCardProps {
  category: Category;
  onPress: (name: string) => void;
}

function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => onPress(category.name)}
      activeOpacity={0.85}
    >
      <View style={styles.cardContent}>
        <Text style={styles.categoryName} numberOfLines={2}>
          {category.name}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {category.count} {category.count === 1 ? 'заболевание' : category.count < 5 ? 'заболевания' : 'заболеваний'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function CategoryScreen() {
  const { isLoading, error, diseases } = useDiseases();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");

  const { width } = useWindowDimensions();
  const isWide = Platform.OS === "web" && width > 768;
  const numColumns = isWide ? 2 : 1;

  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    diseases.forEach((d) => {
      const cat = d.category.trim();
      categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
    });
    let result = Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (categorySearchQuery.trim()) {
      const q = categorySearchQuery.toLowerCase().trim();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }

    return result;
  }, [diseases, categorySearchQuery]);

  const filteredDiseases = useMemo(() => {
    let result = diseases;

    if (selectedCategory) {
      result = result.filter(
        (d) => d.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.symptoms.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [diseases, selectedCategory, searchQuery]);

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSearchQuery("");
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSearchQuery("");
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearCategorySearch = () => {
    setCategorySearchQuery("");
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Ошибка загрузки данных</Text>
        <Text style={styles.errorMsg}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isWide && styles.containerWide]}>
      <Stack.Screen
        options={{
          title: selectedCategory ? selectedCategory : "Категории",
          headerBackVisible: false,
        }}
      />

      {selectedCategory ? (
        <FlatList
          key={numColumns}
          data={filteredDiseases}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={isWide ? styles.columnWrapper : undefined}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <View style={styles.header}>
                <Text style={styles.title}>{selectedCategory}</Text>
                <Text style={styles.subtitle}>{filteredDiseases.length} заболеваний</Text>
              </View>
              <View style={styles.searchContainer}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onClear={clearSearch}
                  placeholder="Поиск заболеваний..."
                />
              </View>
              <TouchableOpacity style={styles.backButton} onPress={handleBackToCategories} activeOpacity={0.7}>
                <Text style={styles.backButtonText}>← Все категории</Text>
              </TouchableOpacity>
            </View>
          }
          ListEmptyComponent={
            isLoading ? (
              <View style={isWide ? styles.columnWrapper : undefined}>
                {[1, 2, 3, 4].map((i) => (
                  <View key={i} style={isWide ? { width: "48%" } : undefined}>
                    <DiseaseCardSkeleton />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.center}>
                <Text style={styles.emptyText}>Заболевания не найдены</Text>
              </View>
            )
          }
          renderItem={({ item }) => <DiseaseCard disease={item} />}
        />
      ) : (
        <FlatList
          key={numColumns}
          data={categories}
          keyExtractor={(item) => item.name}
          numColumns={numColumns}
          columnWrapperStyle={isWide ? styles.columnWrapper : undefined}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <View style={styles.header}>
                <Text style={styles.title}>Категории заболеваний</Text>
                <Text style={styles.subtitle}>Выберите категорию для просмотра заболеваний</Text>
              </View>
              <View style={styles.searchContainer}>
                <SearchBar
                  value={categorySearchQuery}
                  onChangeText={setCategorySearchQuery}
                  onClear={clearCategorySearch}
                  placeholder="Поиск категорий..."
                />
              </View>
            </View>
          }
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.skeletonContainer}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <View key={i} style={[styles.categorySkeleton, isWide && { width: "48%" }]}>
                    <View style={styles.skeletonRect} />
                    <View style={styles.skeletonText} />
                    <View style={[styles.skeletonText, { width: "60%" }]} />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.center}>
                <Text style={styles.emptyText}>Категории не найдены</Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <View style={isWide ? { width: "48%" } : { width: "100%" }}>
              <CategoryCard category={item} onPress={handleCategoryPress} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  containerWide: { maxWidth: 1200, alignSelf: "center", width: "100%" },
  header: { paddingTop: 24, paddingBottom: 16, paddingHorizontal: 16 },
  title: { fontSize: 28, fontWeight: "800", color: "#0F172A", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#64748B" },
  searchContainer: { marginBottom: 12, paddingHorizontal: 16 },
  backButton: { marginBottom: 16, paddingHorizontal: 16 },
  backButtonText: { fontSize: 16, color: "#1A7FE8", fontWeight: "600" },
  listContent: { paddingHorizontal: 16, paddingBottom: 32, paddingTop: 8 },
  columnWrapper: { justifyContent: "space-between", gap: 16 },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#8dc6ff",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    minHeight: 120,
    height: "auto",
  },
  cardContent: { padding: 16, flex: 1, justifyContent: "space-between" },
  categoryName: { fontSize: 18, fontWeight: "700", color: "#0F172A", marginBottom: 8 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: "#E0EFFF", alignSelf: "flex-start", marginTop: "auto" },
  badgeText: { fontSize: 13, fontWeight: "600", color: "#1A7FE8" },
  center: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  errorTitle: { fontSize: 20, fontWeight: "700", color: "#DC2626", marginBottom: 8 },
  errorMsg: { fontSize: 14, color: "#64748B", textAlign: "center", paddingHorizontal: 32 },
  emptyText: { fontSize: 16, color: "#94A3B8" },
  skeletonContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  categorySkeleton: { width: "100%", backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#F1F5F9" },
  skeletonRect: { width: "70%", height: 20, backgroundColor: "#E2E8F0", borderRadius: 4, marginBottom: 8 },
  skeletonText: { width: "40%", height: 14, backgroundColor: "#E2E8F0", borderRadius: 4 },
});
