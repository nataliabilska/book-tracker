import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from './context/ThemeContext';

import { ThemeProvider } from './context/ThemeContext';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import MyShelvesScreen from './screens/MyShelvesScreen';
import BookDetailsScreen from './screens/BookDetailsScreen';
import ReadingGoalsScreen from './screens/ReadingGoalsScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import MainTabs from './navigation/MainTabs';

const Stack = createStackNavigator();

function AppContent() {
  const { theme } = useTheme();

  const baseTheme = theme.mode === 'dark' ? MD3DarkTheme : MD3LightTheme;

  const paperTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: theme.colors.primary,
      primaryContainer: theme.colors.iconBackground,
      secondary: theme.colors.primary,
      secondaryContainer: theme.colors.iconBackground,
      tertiary: theme.colors.primary,
      surface: theme.colors.surface,
      surfaceVariant: theme.colors.statCard,
      background: theme.colors.background,
      error: theme.colors.error,
      errorContainer: theme.colors.error + '20',
      onPrimary: '#FFFFFF',
      onPrimaryContainer: theme.colors.primary,
      onSecondary: '#FFFFFF',
      onSecondaryContainer: theme.colors.primary,
      onTertiary: '#FFFFFF',
      onSurface: theme.colors.text,
      onSurfaceVariant: theme.colors.textSecondary,
      onBackground: theme.colors.text,
      onError: '#FFFFFF',
      onErrorContainer: theme.colors.error,
      outline: theme.colors.border,
      outlineVariant: theme.colors.borderLight,
      shadow: theme.colors.shadow,
      scrim: 'rgba(0, 0, 0, 0.5)',
      inverseSurface: theme.colors.text,
      inverseOnSurface: theme.colors.background,
      inversePrimary: theme.colors.primary,
      elevation: {
        level0: theme.colors.background,
        level1: theme.colors.surface,
        level2: theme.colors.card,
        level3: theme.colors.card,
        level4: theme.colors.card,
        level5: theme.colors.card,
      },
    },
    roundness: 8,
  };

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'light'} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="BookDetails"
            component={BookDetailsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ReadingGoals"
            component={ReadingGoalsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Statistics"
            component={StatisticsScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

