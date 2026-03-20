import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Disease } from "@/types/disease";
import { WARNING_CONFIG, BREAKPOINTS } from "@/utils/constants";

interface DiseaseCardProps {
  disease: Disease;
}

export function DiseaseCard({ disease }: DiseaseCardProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === "web" && width > BREAKPOINTS.TABLET;

  const warnConfig = WARNING_CONFIG[disease.warning_level];

  const handlePress = () => {
    router.push(`/${disease.id}` as any);
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isWide && styles.cardWide,
        Platform.OS === "web" && (styles.cardWeb as any),
      ]}
      onPress={handlePress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${disease.name}`}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {disease.name}
          </Text>
          <View style={[styles.warningBadge, { backgroundColor: warnConfig.bg }]}>
            <Text style={[styles.warningText, { color: warnConfig.color }]}>
              {warnConfig.label}
            </Text>
          </View>
        </View>

        <Text style={styles.category}>{disease.category}</Text>
        <Text style={styles.symptomsPreview} numberOfLines={2}>
          {disease.symptoms}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#8dc6ff",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardWide: { width: "48%" },
  cardWeb: {
    // @ts-ignore
    cursor: "pointer",
    // @ts-ignore
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  content: { padding: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 8,
  },
  warningBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  warningText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  category: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1A7FE8",
    marginBottom: 8,
  },
  symptomsPreview: { fontSize: 14, color: "#64748B", lineHeight: 20 },
});
