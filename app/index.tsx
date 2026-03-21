import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  useWindowDimensions,
  RefreshControl,
} from "react-native";
import { useDiseases } from "@/hooks/useDiseases";
import { useSearch } from "@/hooks/useSearch";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import { SearchBar } from "@/components/SearchBar";
import { CategorySelector } from "@/components/CategorySelector";
import { DiseaseCard } from "@/components/DiseaseCard";
import { DiseaseCardSkeleton } from "@/components/LoadingSkeleton";

export default function HomeScreen() {
  const { isLoading, error, reload, getFeaturedDiseases } = useDiseases();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    clearSearch,
    isSearching,
  } = useSearch();
  const {
    categories,
    selectedCategory,
    selectCategory,
    filteredDiseases,
  } = useCategoryFilter();
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === "web" && width > 768;
  const numColumns = isWide ? 2 : 1;

  const displayData = isSearching ? searchResults : filteredDiseases;
  const featured = getFeaturedDiseases;

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
      <FlatList
        key={numColumns}
        data={displayData}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={isWide ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={reload} />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>
                Справочник по болезням
              </Text>
              <Text style={styles.welcomeSubtitle}>
                Ваш надежный медицинский справочник
              </Text>
            </View>

            <View style={styles.searchContainer}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onClear={clearSearch}
              />
            </View>

            <CategorySelector
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={selectCategory}
            />

            {!isSearching && featured.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Заболевания, требующие повышенного внимания
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={isWide ? styles.columnWrapper : undefined}>
              {[1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={isWide ? { width: "48%" } : undefined}
                >
                  <DiseaseCardSkeleton />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.center}>
              <Text style={styles.emptyText}>Заболеваний не обнаружено</Text>
            </View>
          )
        }
        renderItem={({ item }) => <DiseaseCard disease={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  containerWide: {
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  welcomeSection: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#64748B",
  },
  searchContainer: {
    marginBottom: 12,
  },
  section: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  errorTitle: { fontSize: 20, fontWeight: "700", color: "#DC2626" },
  errorMsg: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 32,
  },
  emptyText: { fontSize: 16, color: "#94A3B8" },
});
