import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, ProgressBar, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const BOOK_COVER_WIDTH = (width - 48) / 2 - 8;
const HEADER_BORDER_RADIUS = Math.min(width * 0.15, 40);

export default function HomeScreen({ navigation }) {
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

  // Load reading stats and currently reading book from AsyncStorage
  useEffect(() => {
    const loadReadingData = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem('myBooks');
        if (storedBooks) {
          const myBooks = JSON.parse(storedBooks);

          // Update reading stats
          setReadingStats({
            read: myBooks.read?.length || 0,
            reading: myBooks.reading?.length || 0,
            wantToRead: myBooks.wantToRead?.length || 0,
          });

          // Set currently reading book (first book from reading shelf)
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

  // Refresh stats and current book when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const loadReadingData = async () => {
        try {
          const storedBooks = await AsyncStorage.getItem('myBooks');
          if (storedBooks) {
            const myBooks = JSON.parse(storedBooks);

            // Update reading stats
            setReadingStats({
              read: myBooks.read?.length || 0,
              reading: myBooks.reading?.length || 0,
              wantToRead: myBooks.wantToRead?.length || 0,
            });

            // Set currently reading book (first book from reading shelf)
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
    // Navigate to BookDetails in parent Stack Navigator
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('BookDetails', { book });
    } else {
      navigation.navigate('BookDetails', { book });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with gradient background */}
        <LinearGradient
          colors={['#9333EA', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.welcomeText}>Welcome back, Reader!</Text>
          <Text style={styles.subtitleText}>Continue your reading journey</Text>
        </LinearGradient>

        {/* Currently Reading */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currently Reading</Text>
          {currentlyReadingBook ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleBookPress(currentlyReadingBook)}
            >
              <Card style={styles.currentBookCard} elevation={2}>
                <Card.Content style={styles.currentBookContent}>
                  <View style={[styles.bookCover, { backgroundColor: currentlyReadingBook.color || '#7C3AED' }]}>
                    <Text style={styles.bookCoverTitle} numberOfLines={2}>{currentlyReadingBook.title}</Text>
                    <Text style={styles.bookCoverAuthor} numberOfLines={1}>{currentlyReadingBook.author}</Text>
                  </View>
                  <View style={styles.currentBookInfo}>
                    <Text style={styles.currentBookTitle} numberOfLines={2}>{currentlyReadingBook.title}</Text>
                    <Text style={styles.currentBookAuthor} numberOfLines={1}>{currentlyReadingBook.author}</Text>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Progress</Text>
                        <Text style={styles.progressPercent}>
                          {currentlyReadingBook.currentPage
                            ? `${Math.round((currentlyReadingBook.currentPage / (currentlyReadingBook.pages || 1)) * 100)}%`
                            : '0%'}
                        </Text>
                      </View>
                      <ProgressBar
                        progress={currentlyReadingBook.currentPage
                          ? currentlyReadingBook.currentPage / (currentlyReadingBook.pages || 1)
                          : 0}
                        color="#7C3AED"
                        style={styles.progressBar}
                      />
                      <Text style={styles.progressText}>
                        Page {currentlyReadingBook.currentPage || 0} of {currentlyReadingBook.pages || 0}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ) : (
            <Card style={styles.currentBookCard} elevation={2}>
              <Card.Content style={styles.currentBookContent}>
                <View style={[styles.bookCover, { backgroundColor: '#E5E7EB' }]}>
                  <Text style={styles.bookCoverTitle} numberOfLines={2}>No Book</Text>
                  <Text style={styles.bookCoverAuthor} numberOfLines={1}>Start Reading</Text>
                </View>
                <View style={styles.currentBookInfo}>
                  <Text style={styles.currentBookTitle} numberOfLines={2}>No book currently reading</Text>
                  <Text style={styles.currentBookAuthor} numberOfLines={1}>Add a book to start reading</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Progress</Text>
                      <Text style={styles.progressPercent}>0%</Text>
                    </View>
                    <ProgressBar progress={0} color="#7C3AED" style={styles.progressBar} />
                    <Text style={styles.progressText}>Page 0 of 0</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations for You</Text>
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
                <Text style={styles.recommendationTitle} numberOfLines={2}>{book.title}</Text>
                <Text style={styles.recommendationAuthor} numberOfLines={1}>{book.author}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Reading Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Reading Stats</Text>
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statNumber}>{readingStats.read}</Text>
                <Text style={styles.statLabel}>Books Read</Text>
              </Card.Content>
            </Card>
            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statNumber}>{readingStats.reading}</Text>
                <Text style={styles.statLabel}>In Progress</Text>
              </Card.Content>
            </Card>
            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statNumber}>{readingStats.wantToRead}</Text>
                <Text style={styles.statLabel}>Want to Read</Text>
              </Card.Content>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: '#E9D5FF',
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#030213',
    marginBottom: 12,
  },
  currentBookCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
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
    color: '#030213',
    marginBottom: 4,
  },
  currentBookAuthor: {
    fontSize: 12,
    color: '#71717A',
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
    color: '#71717A',
  },
  progressPercent: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#71717A',
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
    color: '#030213',
    marginBottom: 2,
    height: 32,
  },
  recommendationAuthor: {
    fontSize: 11,
    color: '#71717A',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#ffffff',
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
    color: '#7C3AED',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#71717A',
    textAlign: 'center',
  },
});

