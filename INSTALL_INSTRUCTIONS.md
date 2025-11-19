# Installation Instructions - Fix PlatformConstants Error

The "PlatformConstants" error occurs when Expo packages aren't properly installed or there's a version mismatch. Follow these steps **in order**:

## Step 1: Delete node_modules and package-lock.json

```bash
# Windows PowerShell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Or manually delete the folders/files
```

## Step 2: Install dependencies using Expo's installer

This ensures all packages are compatible with SDK 54:

```bash
npx expo install --fix
```

This will automatically install the correct versions of all Expo packages.

## Step 3: Install remaining non-Expo packages

```bash
npm install react-native-paper react-native-vector-icons
```

## Step 4: Clear cache and start

```bash
npx expo start --clear
```

## Step 5: Reload the app

- In Expo Go: Shake device → Reload
- Or press `r` in the terminal

## If still not working:

Try installing Expo packages individually:

```bash
npx expo install expo expo-status-bar expo-constants expo-linking
npx expo install react-native-safe-area-context react-native-screens
npx expo install react-native-gesture-handler react-native-reanimated
npx expo install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
```

Then:
```bash
npx expo start --clear
```

