# BookTracker - React Native App

A beautiful mobile book tracking application built with React Native, Expo, and React Native Paper.

## Features

- **Login Screen**: Clean authentication interface
- **Home Screen**: View currently reading book, recommendations, and reading stats
- **Search Screen**: Discover and search for popular books
- **Book Details Screen**: View detailed information, synopsis, and reviews
- **My Shelves Screen**: Organize books into Read, Reading, and Want to Read categories

## Tech Stack

- React Native with Expo SDK 54
- React Navigation v6 (Stack & Bottom Tabs)
- React Native Paper (Material Design 3)
- React Native Vector Icons

## Installation

1. Install dependencies:
```bash
npm install
```

2. Clear cache and restart (if you encounter module errors):
```bash
npx expo start --clear
```

3. Start the Expo development server:
```bash
npm start
```

4. Run on your device:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

## Troubleshooting

If you encounter "platform constants" or module resolution errors:

1. Clear the cache:
```bash
npx expo start --clear
```

2. Delete node_modules and reinstall:
```bash
rm -rf node_modules
npm install
```

3. Reset Metro bundler cache:
```bash
npx expo start --clear
```

## Project Structure

```
├── App.js                 # Main app entry with navigation setup
├── navigation/
│   └── MainTabs.js       # Bottom tab navigator
├── screens/
│   ├── LoginScreen.js    # Login/authentication screen
│   ├── HomeScreen.js     # Home dashboard
│   ├── SearchScreen.js   # Book discovery/search
│   ├── BookDetailsScreen.js  # Book detail view
│   └── MyShelvesScreen.js    # User's book shelves
└── package.json
```

## Navigation Flow

1. **Login Screen** → Navigate to MainTabs after login
2. **MainTabs** (Bottom Navigation):
   - Home
   - Search
   - My Shelves
3. **Book Details** → Accessible from Home and Search screens

## Notes

- All data is hard-coded (no API calls)
- Login is simulated - any input will navigate to Home
- Purple theme color: `#6C5CE7`
"# book-tracker" 
