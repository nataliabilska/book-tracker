import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const lightTheme = {
  mode: 'light',
  colors: {
    primary: '#7C3AED',
    primaryLight: '#9333EA',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#030213',
    textSecondary: '#71717A',
    textLight: '#E9D5FF',
    border: '#E5E5E5',
    borderLight: '#E0E0E0',
    shadow: '#000000',
    gradientStart: '#9333EA',
    gradientEnd: '#7C3AED',
    headerGradientStart: '#9333EA',
    headerGradientEnd: '#7C3AED',
    statCard: '#F3F3F5',
    iconBackground: '#F3E8FF',
    emptyText: '#71717A',
    error: '#DC2626',
    success: '#059669',
  },
};

const darkTheme = {
  mode: 'dark',
  colors: {
    primary: '#A78BFA',
    primaryLight: '#C4B5FD',
    background: '#0F172A',
    surface: '#1E293B',
    card: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textLight: '#64748B',
    border: '#334155',
    borderLight: '#475569',
    shadow: '#000000',
    gradientStart: '#6366F1',
    gradientEnd: '#4F46E5',
    headerGradientStart: '#6366F1',
    headerGradientEnd: '#4F46E5',
    statCard: '#334155',
    iconBackground: '#312E81',
    emptyText: '#94A3B8',
    error: '#EF4444',
    success: '#10B981',
  },
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system');
  const [currentTheme, setCurrentTheme] = useState(lightTheme);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    let theme;
    if (themeMode === 'system') {
      theme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
    } else {
      theme = themeMode === 'dark' ? darkTheme : lightTheme;
    }
    setCurrentTheme(theme);
  }, [themeMode, systemColorScheme]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme) {
        setThemeMode(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const setTheme = async (mode) => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
      setThemeMode(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = currentTheme.mode === 'light' ? 'dark' : 'light';
    setTheme(newMode);
  };

  const value = {
    theme: currentTheme,
    themeMode,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

