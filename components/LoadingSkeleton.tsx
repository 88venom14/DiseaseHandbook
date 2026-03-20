import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Platform } from "react-native";

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

export function LoadingSkeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}: LoadingSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: Platform.OS !== "web",
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width as any, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

export function DiseaseCardSkeleton() {
  return (
    <View style={styles.card}>
      <LoadingSkeleton height={140} borderRadius={12} />
      <View style={styles.cardContent}>
        <LoadingSkeleton width="70%" height={18} />
        <LoadingSkeleton width="40%" height={14} style={{ marginTop: 8 }} />
        <LoadingSkeleton height={12} style={{ marginTop: 12 }} />
        <LoadingSkeleton width="85%" height={12} style={{ marginTop: 4 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: { backgroundColor: "#E2E8F0" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: { padding: 16 },
});
