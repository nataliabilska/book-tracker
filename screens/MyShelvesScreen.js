import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Text, Card, Avatar, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, BookOpen } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const HEADER_BORDER_RADIUS = Math.min(width * 0.15, 40);

export default function MyShelvesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Read');
  const [myBooks, setMyBooks] = useState({
    read: [],
    reading: [],
    wantToRead: [],
  });

  // Odczytaj zapisane książki z AsyncStorage
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem('myBooks');
        if (storedBooks) {
          setMyBooks(JSON.parse(storedBooks));
        } else {
          // Jeśli nie ma zapisanych książek, ustaw przykładowe dane
          setMyBooks({
            read: [
              { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', rating: 3.9, pages: 197, color: '#F97316' },
              { id: 2, title: 'Atomic Habits', author: 'James Clear', rating: 4.4, pages: 320, color: '#0284C7' },
              { id: 3, title: 'Educated', author: 'Tara Westover', rating: 4.5, pages: 385, color: '#7C3AED' },
            ],
            reading: [
              { id: 1, title: 'The Midnight Library', author: 'Matt Haig', rating: 4.2, pages: 304, color: '#7C3AED', progress: 65, currentPage: 198 },
            ],
            wantToRead: [
              { id: 1, title: 'Pride and Prejudice', author: 'Jane Austen', rating: 4.3, pages: 432, color: '#059669' },
              { id: 2, title: 'The Shadow of the Wind', author: 'Carlos Ruiz Zafón', rating: 4.3, pages: 487, color: '#DC2626' },
            ],
          });
        }
      } catch (error) {
        console.error('Error loading books from storage:', error);
      }
    };

    loadBooks();
  }, []);

  // Odczytaj ponownie przy każdym focusie ekranu (aby odświeżyć po dodaniu książki)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const loadBooks = async () => {
        try {
          const storedBooks = await AsyncStorage.getItem('myBooks');
          if (storedBooks) {
            setMyBooks(JSON.parse(storedBooks));
          }
        } catch (error) {
          console.error('Error refreshing books from storage:', error);
        }
      };

      loadBooks();
    });

    return unsubscribe;
  }, [navigation]);

  // Funkcja do dodawania książki do półki (wywoływana z BookDetailsScreen)
  const addBookToShelf = (book, shelfType) => {
    setMyBooks(prev => ({
      ...prev,
      [shelfType]: [...prev[shelfType], { ...book, id: Date.now() }]
    }));
  };

  // Funkcja do usuwania książki z półki
  const removeBookFromShelf = async (bookId) => {
    try {
      // Pobierz aktualne książki
      const storedBooks = await AsyncStorage.getItem('myBooks');
      let myBooks = storedBooks ? JSON.parse(storedBooks) : { read: [], reading: [], wantToRead: [] };

      // Usuń książkę z odpowiedniej półki
      const shelfKey = activeTab === 'Read' ? 'read' : activeTab === 'Reading' ? 'reading' : 'wantToRead';
      myBooks[shelfKey] = myBooks[shelfKey].filter(book => book.id !== bookId);

      // Zapis zaktualizowane książki
      await AsyncStorage.setItem('myBooks', JSON.stringify(myBooks));
      setMyBooks(myBooks);

      console.log(`Removed book from ${activeTab} shelf`);
    } catch (error) {
      console.error('Error removing book from shelf:', error);
    }
  };

  // Funkcja do obsługi długiego kliknięcia (usuwanie)
  const handleBookLongPress = (book) => {
    Alert.alert(
      'Remove Book',
      `Are you sure you want to remove "${book.title}" from your ${activeTab} shelf?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeBookFromShelf(book.id),
        },
      ]
    );
  };

  const getCurrentBooks = () => {
    switch (activeTab) {
      case 'Read':
        return myBooks.read;
      case 'Reading':
        return myBooks.reading;
      case 'Want to Read':
        return myBooks.wantToRead;
      default:
        return [];
    }
  };

  const getBookCount = () => {
    return getCurrentBooks().length;
  };

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
      {/* Header */}
      <LinearGradient
        colors={['#9333EA', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <User size={32} color="#ffffff" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>My Library</Text>
            <Text style={styles.headerSubtitle}>@booklover</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsWrapper}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Read' && styles.tabActive]}
            onPress={() => setActiveTab('Read')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'Read' && styles.tabTextActive]}>
              Read
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Reading' && styles.tabActive]}
            onPress={() => setActiveTab('Reading')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'Reading' && styles.tabTextActive]}>
              Reading
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Want to Read' && styles.tabActive]}
            onPress={() => setActiveTab('Want to Read')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'Want to Read' && styles.tabTextActive]}>
              Want to Read
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Books List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'Read' ? 'Read Books' : activeTab === 'Reading' ? 'Reading Books' : 'Want to Read Books'}
          </Text>
          <Text style={styles.sectionCount}>{getBookCount()} books</Text>
        </View>

        {getCurrentBooks().map((book) => (
          <TouchableOpacity
            key={book.id}
            onPress={() => handleBookPress(book)}
            onLongPress={() => handleBookLongPress(book)}
            style={styles.bookItem}
            activeOpacity={0.7}
          >
            <View style={[styles.bookCover, { backgroundColor: book.color }]}>
              <Text style={styles.bookCoverTitle} numberOfLines={2}>{book.title}</Text>
              <Text style={styles.bookCoverAuthor} numberOfLines={1}>{book.author}</Text>
            </View>
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
              {activeTab === 'Reading' && book.progress ? (
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progress</Text>
                    <Text style={styles.progressPercent}>{book.progress}%</Text>
                  </View>
                  <ProgressBar progress={book.progress / 100} color="#7C3AED" style={styles.progressBar} />
                  <Text style={styles.progressText}>Page {book.currentPage} of {book.pages}</Text>
                </View>
              ) : (
                <View style={styles.bookMeta}>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.star}>★</Text>
                    <Text style={styles.rating}>{book.rating}</Text>
                  </View>
                  <Text style={styles.pages}>{book.pages} pages</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  },
  avatarContainer: {
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E9D5FF',
  },
  tabsContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#ECE5F0',
    borderRadius: 12,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 12,
    color: '#71717A',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#030213',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#030213',
    marginBottom: 4,
  },
  sectionCount: {
    fontSize: 14,
    color: '#71717A',
  },
  bookItem: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 0,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    flexShrink: 0,
  },
  bookCoverTitle: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  bookCoverAuthor: {
    color: '#ffffff',
    fontSize: 9,
    textAlign: 'center',
  },
  bookInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
    minWidth: 0,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#030213',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#71717A',
    marginBottom: 8,
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
  bookMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  star: {
    fontSize: 12,
    color: '#FBBF24',
    marginRight: 2,
  },
  rating: {
    fontSize: 12,
    color: '#030213',
  },
  pages: {
    fontSize: 12,
    color: '#030213',
  },
});

