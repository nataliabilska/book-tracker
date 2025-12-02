import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Share } from 'react-native';
import { Text, ProgressBar, Card, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Target, BarChart3, Download, Moon, Sun } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme as useAppTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');
const BOOK_COVER_WIDTH = (width - 48) / 2 - 8;
const HEADER_BORDER_RADIUS = Math.min(width * 0.15, 40);

export default function HomeScreen({ navigation }) {
  const { theme, toggleTheme } = useAppTheme();
  const [readingStats, setReadingStats] = useState({
    read: 0,
    reading: 0,
    wantToRead: 0,
  });
  const [currentlyReadingBook, setCurrentlyReadingBook] = useState(null);

  const recommendations = [
    {
      id: 1,
      title: 'The Shadow of the Wind',
      author: 'Carlos Ruiz Zafón',
      rating: 4.3,
      pages: 487,
      published: 2001,
      color: '#DC2626',
      description: 'A mysterious book discovered in a cemetery leads a young boy into a labyrinth of secrets in post-war Barcelona.'
    },
    {
      id: 2,
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      rating: 4.1,
      pages: 336,
      published: 2019,
      color: '#1E293B',
      description: 'A psychotherapist becomes obsessed with treating a woman who allegedly murdered her husband but refuses to speak.'
    },
    {
      id: 3,
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      rating: 4.6,
      pages: 496,
      published: 2021,
      color: '#0284C7',
      description: 'A lone astronaut wakes up on a mission to save Earth, with no memory of how he got there or who he is.'
    },
    {
      id: 4,
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      rating: 4.4,
      pages: 400,
      published: 2017,
      color: '#BE185D',
      description: 'Hollywood icon Evelyn Hugo finally tells her scandalous life story to an unknown journalist.'
    },
    {
      id: 5,
      title: 'Where the Crawdads Sing',
      author: 'Delia Owens',
      rating: 4.2,
      pages: 368,
      published: 2018,
      color: '#059669',
      description: 'A young woman who raised herself in the marshes becomes the prime suspect in a murder investigation.'
    },
    {
      id: 6,
      title: 'The Midnight Library',
      author: 'Matt Haig',
      rating: 4.2,
      pages: 304,
      published: 2020,
      color: '#7C3AED',
      description: 'Between life and death there is a library, and within that library, the shelves go on forever.'
    },
    {
      id: 7,
      title: 'Atomic Habits',
      author: 'James Clear',
      rating: 4.5,
      pages: 320,
      published: 2018,
      color: '#EA580C',
      description: 'Small changes that deliver remarkable results - an easy way to build good habits and break bad ones.'
    },
    {
      id: 8,
      title: 'The Thursday Murder Club',
      author: 'Richard Osman',
      rating: 4.0,
      pages: 384,
      published: 2020,
      color: '#0891B2',
      description: 'Four retirees with a few tricks up their sleeves investigate cold cases for fun.'
    },
    {
      id: 9,
      title: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      rating: 3.8,
      pages: 303,
      published: 2021,
      color: '#65A30D',
      description: 'An artificial friend observes the world from her place in the store, hoping to find a human companion.'
    },
    {
      id: 10,
      title: 'The Vanishing Half',
      author: 'Brit Bennett',
      rating: 4.3,
      pages: 342,
      published: 2020,
      color: '#DC2626',
      description: 'Twin sisters grow up to lead different lives - one stays in her hometown while the other passes as white.'
    },
    {
      id: 11,
      title: 'Dune',
      author: 'Frank Herbert',
      rating: 4.4,
      pages: 688,
      published: 1965,
      color: '#92400E',
      description: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset.'
    },
    {
      id: 12,
      title: '1984',
      author: 'George Orwell',
      rating: 4.3,
      pages: 328,
      published: 1949,
      color: '#475569',
      description: 'A dystopian social science fiction novel and cautionary tale about totalitarianism.'
    },
  ];

  useEffect(() => {
    const loadReadingData = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem('myBooks');
        if (storedBooks) {
          const myBooks = JSON.parse(storedBooks);

          setReadingStats({
            read: myBooks.read?.length || 0,
            reading: myBooks.reading?.length || 0,
            wantToRead: myBooks.wantToRead?.length || 0,
          });

          if (myBooks.reading && myBooks.reading.length > 0) {
            setCurrentlyReadingBook(myBooks.reading[0]);
          }
        }
      } catch (error) {
        console.error('Error loading reading data:', error);
      }
    };

    loadReadingData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const loadReadingData = async () => {
        try {
          const storedBooks = await AsyncStorage.getItem('myBooks');
          if (storedBooks) {
            const myBooks = JSON.parse(storedBooks);

            setReadingStats({
              read: myBooks.read?.length || 0,
              reading: myBooks.reading?.length || 0,
              wantToRead: myBooks.wantToRead?.length || 0,
            });

            if (myBooks.reading && myBooks.reading.length > 0) {
              setCurrentlyReadingBook(myBooks.reading[0]);
            } else {
              setCurrentlyReadingBook(null);
            }
          }
        } catch (error) {
          console.error('Error loading reading data:', error);
        }
      };

      loadReadingData();
    });

    return unsubscribe;
  }, [navigation]);

  const handleBookPress = (book) => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('BookDetails', { book });
    } else {
      navigation.navigate('BookDetails', { book });
    }
  };

  const handleExportData = async () => {
    try {
      const myBooks = await AsyncStorage.getItem('myBooks');
      const bookReviews = await AsyncStorage.getItem('bookReviews');
      const bookNotes = await AsyncStorage.getItem('bookNotes');
      const bookQuotes = await AsyncStorage.getItem('bookQuotes');
      const readingGoals = await AsyncStorage.getItem('readingGoals');

      const exportData = {
        exportDate: new Date().toISOString(),
        books: myBooks ? JSON.parse(myBooks) : null,
        reviews: bookReviews ? JSON.parse(bookReviews) : null,
        notes: bookNotes ? JSON.parse(bookNotes) : null,
        quotes: bookQuotes ? JSON.parse(bookQuotes) : null,
        goals: readingGoals ? JSON.parse(readingGoals) : null,
      };

      const exportString = JSON.stringify(exportData, null, 2);

      await Share.share({
        message: `BookTracker Export\n\n${exportString}`,
        title: 'BookTracker Data Export',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
  };

  const dynamicStyles = getDynamicStyles(theme);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[theme.colors.headerGradientStart, theme.colors.headerGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.welcomeText}>Welcome back, Reader!</Text>
              <Text style={styles.subtitleText}>Continue your reading journey</Text>
            </View>
            <TouchableOpacity
              onPress={toggleTheme}
              style={styles.themeToggle}
              activeOpacity={0.7}
            >
              {theme.mode === 'dark' ? (
                <Sun size={24} color="#ffffff" />
              ) : (
                <Moon size={24} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currently Reading</Text>
          {currentlyReadingBook ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleBookPress(currentlyReadingBook)}
            >
              <Card style={[styles.currentBookCard, { backgroundColor: theme.colors.card }]} elevation={2}>
                <Card.Content style={styles.currentBookContent}>
                  <View style={[styles.bookCover, { backgroundColor: currentlyReadingBook.color || '#7C3AED' }]}>
                    <Text style={styles.bookCoverTitle} numberOfLines={2}>{currentlyReadingBook.title}</Text>
                    <Text style={styles.bookCoverAuthor} numberOfLines={1}>{currentlyReadingBook.author}</Text>
                  </View>
                  <View style={styles.currentBookInfo}>
                    <Text style={[styles.currentBookTitle, { color: theme.colors.text }]} numberOfLines={2}>{currentlyReadingBook.title}</Text>
                    <Text style={[styles.currentBookAuthor, { color: theme.colors.textSecondary }]} numberOfLines={1}>{currentlyReadingBook.author}</Text>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressHeader}>
                        <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>Progress</Text>
                        <Text style={[styles.progressPercent, { color: theme.colors.primary }]}>
                          {currentlyReadingBook.currentPage
                            ? `${Math.round((currentlyReadingBook.currentPage / (currentlyReadingBook.pages || 1)) * 100)}%`
                            : '0%'}
                        </Text>
                      </View>
                      <ProgressBar
                        progress={currentlyReadingBook.currentPage
                          ? currentlyReadingBook.currentPage / (currentlyReadingBook.pages || 1)
                          : 0}
                        color={theme.colors.primary}
                        style={styles.progressBar}
                      />
                      <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                        Page {currentlyReadingBook.currentPage || 0} of {currentlyReadingBook.pages || 0}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ) : (
            <Card style={[styles.currentBookCard, { backgroundColor: theme.colors.card }]} elevation={2}>
              <Card.Content style={styles.currentBookContent}>
                <View style={[styles.bookCover, { backgroundColor: theme.colors.border }]}>
                  <Text style={styles.bookCoverTitle} numberOfLines={2}>No Book</Text>
                  <Text style={styles.bookCoverAuthor} numberOfLines={1}>Start Reading</Text>
                </View>
                <View style={styles.currentBookInfo}>
                  <Text style={[styles.currentBookTitle, { color: theme.colors.text }]} numberOfLines={2}>No book currently reading</Text>
                  <Text style={[styles.currentBookAuthor, { color: theme.colors.textSecondary }]} numberOfLines={1}>Add a book to start reading</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>Progress</Text>
                      <Text style={[styles.progressPercent, { color: theme.colors.primary }]}>0%</Text>
                    </View>
                    <ProgressBar progress={0} color={theme.colors.primary} style={styles.progressBar} />
                    <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>Page 0 of 0</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recommendations for You</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendationsContainer}
          >
            {recommendations.map((book) => (
              <TouchableOpacity
                key={book.id}
                onPress={() => handleBookPress(book)}
                style={styles.recommendationItem}
              >
                <View style={[styles.recommendationCover, { backgroundColor: book.color }]}>
                  <Text style={styles.recommendationCoverTitle} numberOfLines={4}>{book.title}</Text>
                  <Text style={styles.recommendationCoverAuthor} numberOfLines={2}>{book.author}</Text>
                </View>
                <Text style={[styles.recommendationTitle, { color: theme.colors.text }]} numberOfLines={2}>{book.title}</Text>
                <Text style={[styles.recommendationAuthor, { color: theme.colors.textSecondary }]} numberOfLines={1}>{book.author}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Reading Stats</Text>
          <View style={styles.statsContainer}>
            <Card style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
              <Card.Content style={styles.statContent}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{readingStats.read}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Books Read</Text>
              </Card.Content>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
              <Card.Content style={styles.statContent}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{readingStats.reading}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>In Progress</Text>
              </Card.Content>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
              <Card.Content style={styles.statContent}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{readingStats.wantToRead}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Want to Read</Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={() => {
                const parent = navigation.getParent();
                if (parent) {
                  parent.navigate('ReadingGoals');
                } else {
                  navigation.navigate('ReadingGoals');
                }
              }}
              style={[styles.actionCard, { backgroundColor: theme.colors.card }]}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: theme.colors.iconBackground }]}>
                <Target size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>Reading Goals</Text>
              <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>Set & track goals</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const parent = navigation.getParent();
                if (parent) {
                  parent.navigate('Statistics');
                } else {
                  navigation.navigate('Statistics');
                }
              }}
              style={[styles.actionCard, { backgroundColor: theme.colors.card }]}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: theme.colors.iconBackground }]}>
                <BarChart3 size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>Statistics</Text>
              <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>View insights</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Card style={[styles.exportCard, { backgroundColor: theme.colors.card }]} elevation={2}>
            <Card.Content style={styles.exportContent}>
              <View style={[styles.exportIconContainer, { backgroundColor: theme.colors.iconBackground }]}>
                <Download size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.exportTextContainer}>
                <Text style={[styles.exportTitle, { color: theme.colors.text }]}>Export Your Data</Text>
                <Text style={[styles.exportSubtitle, { color: theme.colors.textSecondary }]}>Backup your reading data</Text>
              </View>
              <Button
                mode="contained"
                onPress={handleExportData}
                style={[styles.exportButton, { backgroundColor: theme.colors.primary }]}
                contentStyle={styles.exportButtonContent}
                labelStyle={styles.exportButtonLabel}
              >
                Export
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getDynamicStyles = (theme) => ({
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
  },
  themeToggle: {
    padding: 8,
    marginTop: -8,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 14,
    color: '#E9D5FF',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  currentBookCard: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  currentBookContent: {
    flexDirection: 'row',
    padding: 12,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  bookCoverTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  bookCoverAuthor: {
    color: '#ffffff',
    fontSize: 10,
    textAlign: 'center',
  },
  currentBookInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  currentBookTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentBookAuthor: {
    fontSize: 12,
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
  },
  recommendationsContainer: {
    paddingRight: 24,
  },
  recommendationItem: {
    marginRight: 12,
    width: 112,
  },
  recommendationCover: {
    width: 112,
    height: 168,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationCoverTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  recommendationCoverAuthor: {
    color: '#ffffff',
    fontSize: 10,
    textAlign: 'center',
  },
  recommendationTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
    height: 32,
  },
  recommendationAuthor: {
    fontSize: 11,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
  },
  exportCard: {
    borderRadius: 12,
    elevation: 2,
  },
  exportContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  exportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exportTextContainer: {
    flex: 1,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  exportSubtitle: {
    fontSize: 12,
  },
  exportButton: {
    borderRadius: 8,
  },
  exportButtonContent: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  exportButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
});

