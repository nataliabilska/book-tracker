import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, BarChart3, BookOpen, Calendar, TrendingUp } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import { useTheme as useAppTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const HEADER_BORDER_RADIUS = Math.min(width * 0.15, 40);

export default function StatisticsScreen({ navigation }) {
  const { theme } = useAppTheme();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalPages: 0,
    averageRating: 0,
    booksThisYear: 0,
    booksThisMonth: 0,
    readingStreak: 0,
    favoriteGenre: 'N/A',
  });

  useEffect(() => {
    calculateStats();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      calculateStats();
    });
    return unsubscribe;
  }, [navigation]);

  const calculateStats = async () => {
    try {
      const storedBooks = await AsyncStorage.getItem('myBooks');
      if (storedBooks) {
        const myBooks = JSON.parse(storedBooks);
        const readBooks = myBooks.read || [];
        const readingBooks = myBooks.reading || [];

        const totalBooks = readBooks.length;

        const totalPages = readBooks.reduce((sum, book) => sum + (book.pages || 0), 0);

        const ratings = readBooks.filter(book => book.rating).map(book => book.rating);
        const averageRating = ratings.length > 0
          ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
          : 0;

        const currentYear = new Date().getFullYear();
        const booksThisYear = readBooks.filter(book => {
          if (book.completedDate) {
            return new Date(book.completedDate).getFullYear() === currentYear;
          }
          return true;
        }).length;

        const currentMonth = new Date().getMonth();
        const booksThisMonth = readBooks.filter(book => {
          if (book.completedDate) {
            const date = new Date(book.completedDate);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
          }
          return false;
        }).length;

        const readingStreak = calculateReadingStreak(readBooks);

        setStats({
          totalBooks,
          totalPages,
          averageRating,
          booksThisYear,
          booksThisMonth,
          readingStreak,
          favoriteGenre: 'Fiction',
        });
      }
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const calculateReadingStreak = (books) => {
    if (books.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasActivity = books.some(book => {
        if (book.completedDate) {
          const completed = new Date(book.completedDate);
          completed.setHours(0, 0, 0, 0);
          return completed.getTime() === checkDate.getTime();
        }
        return false;
      });
      
      if (hasActivity) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <LinearGradient
        colors={[theme.colors.headerGradientStart, theme.colors.headerGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Statistics</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={[styles.statsCard, { backgroundColor: theme.colors.card }]} elevation={2}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <BarChart3 size={24} color={theme.colors.primary} />
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Overview</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { backgroundColor: theme.colors.statCard }]}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{stats.totalBooks}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Total Books</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.colors.statCard }]}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{stats.totalPages.toLocaleString()}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Pages Read</Text>
              </View>
            </View>
            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { backgroundColor: theme.colors.statCard }]}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{stats.averageRating}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Avg Rating</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.colors.statCard }]}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{stats.readingStreak}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Day Streak</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.statsCard, { backgroundColor: theme.colors.card }]} elevation={2}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Calendar size={24} color={theme.colors.primary} />
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>This Period</Text>
            </View>
            <View style={styles.timeStatsContainer}>
              <View style={[styles.timeStatItem, { borderBottomColor: theme.colors.border }]}>
                <View style={[styles.timeStatIcon, { backgroundColor: theme.colors.iconBackground }]}>
                  <BookOpen size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.timeStatContent}>
                  <Text style={[styles.timeStatValue, { color: theme.colors.text }]}>{stats.booksThisYear}</Text>
                  <Text style={[styles.timeStatLabel, { color: theme.colors.textSecondary }]}>Books this year</Text>
                </View>
              </View>
              <View style={[styles.timeStatItem, { borderBottomColor: theme.colors.border }]}>
                <View style={[styles.timeStatIcon, { backgroundColor: theme.colors.iconBackground }]}>
                  <TrendingUp size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.timeStatContent}>
                  <Text style={[styles.timeStatValue, { color: theme.colors.text }]}>{stats.booksThisMonth}</Text>
                  <Text style={[styles.timeStatLabel, { color: theme.colors.textSecondary }]}>Books this month</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.statsCard, { backgroundColor: theme.colors.card }]} elevation={2}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <TrendingUp size={24} color={theme.colors.primary} />
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Insights</Text>
            </View>
            <View style={[styles.insightItem, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.insightLabel, { color: theme.colors.textSecondary }]}>Average pages per book</Text>
              <Text style={[styles.insightValue, { color: theme.colors.text }]}>
                {stats.totalBooks > 0 ? Math.round(stats.totalPages / stats.totalBooks) : 0} pages
              </Text>
            </View>
            <View style={[styles.insightItem, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.insightLabel, { color: theme.colors.textSecondary }]}>Favorite genre</Text>
              <Text style={[styles.insightValue, { color: theme.colors.text }]}>{stats.favoriteGenre}</Text>
            </View>
            <View style={[styles.insightItem, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.insightLabel, { color: theme.colors.textSecondary }]}>Reading pace</Text>
              <Text style={[styles.insightValue, { color: theme.colors.text }]}>
                {stats.booksThisMonth > 0 ? `${stats.booksThisMonth} books/month` : 'Getting started'}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 80,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: HEADER_BORDER_RADIUS,
    borderBottomRightRadius: HEADER_BORDER_RADIUS,
    marginHorizontal: -16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButtonPlaceholder: {
    flex: 1,
  },
  backText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    flex: 2,
  },
  scrollView: {
    flex: 1,
  },
  statsCard: {
    margin: 24,
    marginTop: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  timeStatsContainer: {
    marginTop: 8,
  },
  timeStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  timeStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timeStatContent: {
    flex: 1,
  },
  timeStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  timeStatLabel: {
    fontSize: 14,
  },
  insightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  insightLabel: {
    fontSize: 14,
  },
  insightValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});

