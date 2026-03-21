# Справочник болезней

Медицинский справочный гид, разработанный с использованием Expo, React Native и TypeScript. Поддерживает работу на iOS, Android и в Web.

## Стек

* **Фреймворк:** React, React-Native, Expo SDK 52
* **Навигация:** Expo Router
* **Язык:** TypeScript
* **Стилизация:** CSS
* **Источник данных:** Google Sheets API v4
* **Кэширование:** AsyncStorage

---

## Запуск

1. **Установка зависимостей:**
   ```cmd
   npm install

    Настройка окружения:
    Создайть файл .env и добавить значения:

   EXPO_PUBLIC_GOOGLE_SHEETS_API_KEY=AIzaSyB7G4hKWWhjfyItwh4Dk_nuyGbH00VPM_I
   EXPO_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID=1vSsGJU3G0vfOd76UKNXieJCtTCN6GlQhggv86axldiU
   EXPO_PUBLIC_GOOGLE_SHEETS_SHEET_NAME=Лист1

    Запуск проекта:
   
    npx expo start

    npx expo start --web
   ```

## Google Таблицы

id	name	category	symptoms	causes	treatments	warning_level	image_url
Формат данных:
| id  | name | category | symptoms | causes | treatments | warning_level | image_url |
|-----|------|----------|----------|--------|------------|---------------|-----------|
|d001 | ...  |   ...    |   ...    |   ...  |    ...     |      ...      |    ...    |
    
    id: Уникальный идентификатор (например, d001).
    warning_level: Одно из значений: low, medium, high, critical.
    symptoms: Список симптомов через запятую.

## Структура проекта

```
└── 📁DiseaseHandbook
|    └── devices.json
├── 📁app
|    └── 📁[diseaseId]
|    |   └── index.tsx
|    └── 📁categories
|    |   └── index.tsx
|    ├── _layout.tsx
|    ├── global.css
|    └── index.tsx
├── 📁assets
|    └── 📁icons
|    |   ├── adaptive-icon.png
|    |   ├── app-icon.png
|    |   └── favicon.png
|    └── 📁images
|        └── splash.png
├── 📁components
|    ├── CategorySelector.tsx
|    ├── CollapsibleSection.tsx
|    ├── DiseaseCard.tsx
|    ├── LoadingSkeleton.tsx
|    └── SearchBar.tsx
├── 📁hooks
|    ├── useCategoryFilter.ts
|    ├── useDiseases.ts
|    └── useSearch.ts
├── 📁services
|    ├── diseaseService.ts
├── 📁store
|    └── diseasesStore.ts
├── 📁types
|    └── disease.ts
├── 📁utils
|    ├── constants.js
|    ├── constants.ts
|    └── fetchWithCache.ts
|
├── app.config.ts
|
├── package-lock.json
|
├── package.json
|
├── tailwind.config.js
|
└── tsconfig.json
```

Поддержка платформ
Android/ios
Web
