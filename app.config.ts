import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Disease Handbook",
  slug: "disease-handbook",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icons/app-icon.png",
  userInterfaceStyle: "light",
  scheme: "disease-handbook",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#F0F4F8",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icons/adaptive-icon.png",
      backgroundColor: "#F0F4F8",
    },
    package: "com.diseasehandbook.app",
    newArchEnabled: true,
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.diseasehandbook.app",
    newArchEnabled: true,
  },
  web: {
    favicon: "./assets/icons/favicon.png",
    bundler: "metro",
  },
  plugins: ["expo-router"],
  extra: {
    googleSheetsApiKey: process.env.EXPO_PUBLIC_GOOGLE_SHEETS_API_KEY,
    googleSheetsSpreadsheetId: process.env.EXPO_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID,
    googleSheetsSheetName: process.env.EXPO_PUBLIC_GOOGLE_SHEETS_SHEET_NAME ?? "diseases",
    eas: {
      projectId: "c7cebde3-9377-4578-b1c9-a28156536bc9",
    },
  },
});
