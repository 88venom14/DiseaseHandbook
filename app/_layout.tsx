import React from "react";
import { Tabs } from "expo-router";
import { Platform, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * Root layout — Tab-based navigation.
 * Mobile: bottom tabs.
 * Web (wide): styled for desktop.
 */
export default function RootLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= 1024;

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0073ff",
          ...(Platform.OS === "web"
            ? { borderBottomWidth: 1, borderBottomColor: "#E2E8F0" }
            : {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }),
        },
        headerTitleStyle: {
          fontWeight: "700",
          color: "#0F172A",
          fontSize: 18,
        },
        tabBarActiveTintColor: "#1A7FE8",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F1F5F9",
          height: Platform.OS === "web" ? 65 : 85,
          paddingBottom: Platform.OS === "web" ? 8 : 24,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          headerTitle: "Справочник болезней",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories/index"
        options={{
          title: "Категории",
          headerTitle: "Категории",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="[diseaseId]/index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
