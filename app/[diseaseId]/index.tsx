import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useDiseases } from "@/hooks/useDiseases";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { DiseaseCardSkeleton } from "@/components/LoadingSkeleton";
import { WARNING_CONFIG, BREAKPOINTS } from "@/utils/constants";

export default function DiseaseDetailScreen() {
  const { diseaseId } = useLocalSearchParams<{ diseaseId: string }>();
  const { getDiseaseById, isLoading } = useDiseases();
  const disease = getDiseaseById(Array.isArray(diseaseId) ? diseaseId[0] : diseaseId);
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === "web" && width > BREAKPOINTS.TABLET;

  if (isLoading || !disease) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Загрузка..." }} />
        <DiseaseCardSkeleton />
      </View>
    );
  }

  const warn = WARNING_CONFIG[disease.warning_level];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        isWide && styles.contentWide,
      ]}
    >
      <Stack.Screen
        options={{
          title: disease.name,
          headerTitleStyle: { fontWeight: "700", fontSize: 18 },
        }}
      />

      {disease.image_url ? (
        <Image
          source={{ uri: disease.image_url }}
          style={styles.heroImage}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      ) : (
        <View style={[styles.heroImage, styles.heroPlaceholder]}>
          <Text style={styles.heroPlaceholderText}>No Image Available</Text>
        </View>
      )}

      <View style={styles.titleSection}>
        <Text style={styles.name} accessibilityRole="header">
          {disease.name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 8 }}>
          <View style={[styles.badge, { backgroundColor: "#E0EFFF" }]}>
            <Text style={[styles.badgeText, { color: "#1A7FE8" }]}>
              {disease.category}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: warn.bg }]}>
            <Text style={[styles.badgeText, { color: warn.color }]}>
              {warn.label}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sections}>
        <CollapsibleSection
          title="Симптомы"
          icon="fitness-outline"
          defaultOpen={true}
        >
          <Text style={styles.bodyText}>{disease.symptoms}</Text>
        </CollapsibleSection>

        <CollapsibleSection
          title="Причины"
          icon="help-circle-outline"
          defaultOpen={false}
        >
          <Text style={styles.bodyText}>{disease.causes}</Text>
        </CollapsibleSection>

        <CollapsibleSection
          title="Лечение"
          icon="medkit-outline"
          defaultOpen={false}
        >
          <Text style={styles.bodyText}>{disease.treatments}</Text>
        </CollapsibleSection>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    paddingBottom: 40,
  },
  contentWide: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  heroImage: {
    width: "100%",
    height: 240,
    backgroundColor: "#E0EFFF",
  },
  heroPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  heroPlaceholderText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
  titleSection: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  sections: {
    paddingHorizontal: 16,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#334155",
  },
});
