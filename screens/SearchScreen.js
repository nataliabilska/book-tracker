import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Searchbar, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const HEADER_BORDER_RADIUS = Math.min(width * 0.15, 40);
const BOOK_COVER_WIDTH = (width - 48) / 2 - 8;

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const allBooks = [
    {
      id: 1,
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      rating: 4.3,
      pages: 432,
      published: 1813,
      color: '#059669',
      description: 'The romantic clash between the opinionated Elizabeth Bennet and her proud beau, Mr. Darcy.'
    },
    {
      id: 2,
      title: 'The Shadow of the Wind',
      author: 'Carlos Ruiz Zafón',
      rating: 4.3,
      pages: 487,
      published: 2001,
      color: '#DC2626',
      description: 'A mysterious book discovered in a cemetery leads a young boy into a labyrinth of secrets in post-war Barcelona.'
    },
    {
      id: 3,
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      rating: 4.1,
      pages: 336,
      published: 2019,
      color: '#1E293B',
      description: 'A psychotherapist becomes obsessed with treating a woman who allegedly murdered her husband but refuses to speak.'
    },
    {
      id: 4,
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      rating: 4.6,
      pages: 496,
      published: 2021,
      color: '#0284C7',
      description: 'A lone astronaut wakes up on a mission to save Earth, with no memory of how he got there or who he is.'
    },
    {
      id: 5,
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      rating: 4.4,
      pages: 400,
      published: 2017,
      color: '#BE185D',
      description: 'Hollywood icon Evelyn Hugo finally tells her scandalous life story to an unknown journalist.'
    },
    {
      id: 6,
      title: 'Where the Crawdads Sing',
      author: 'Delia Owens',
      rating: 4.2,
      pages: 368,
      published: 2018,
      color: '#059669',
      description: 'A young woman who raised herself in the marshes becomes the prime suspect in a murder investigation.'
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

  // Filter books based on search query
  const filteredBooks = allBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookPress = (book) => {
    navigation.navigate('BookDetails', { book });
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
        <Text style={styles.headerTitle}>Discover Books</Text>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search books, authors..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            inputStyle={styles.searchbarInput}
            iconColor="#999999"
            placeholderTextColor="#999999"
            iconStyle={styles.searchbarIcon}
          />
        </View>
      </LinearGradient>

      {/* Books List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? 'Search Results' : 'All Books'}
            </Text>
            <Text style={styles.sectionCount}>
              {searchQuery ? `${filteredBooks.length} found` : `${allBooks.length} books`}
            </Text>
          </View>

          <View style={styles.booksGrid}>
            {(searchQuery ? filteredBooks : allBooks).map((book) => (
              <TouchableOpacity
                key={book.id}
                onPress={() => handleBookPress(book)}
                style={styles.bookItem}
              >
                <View style={[styles.bookCover, { backgroundColor: book.color }]}>
                  <Text style={styles.bookCoverTitle}>{book.title}</Text>
                  <Text style={styles.bookCoverAuthor}>{book.author}</Text>
                </View>
                <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
                <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.star}>★</Text>
                  <Text style={styles.rating}>{book.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
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
  header: {
    paddingTop: 80,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: HEADER_BORDER_RADIUS,
    borderBottomRightRadius: HEADER_BORDER_RADIUS,
    marginHorizontal: -16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  searchContainer: {
    marginTop: 12,
  },
  searchbar: {
    backgroundColor: '#ffffff',
    elevation: 2,
    borderRadius: 8,
    height: 40,
    marginHorizontal: 0,
  },
  searchbarInput: {
    fontSize: 14,
    paddingTop: 2,
    height: 40,
  },
  searchbarIcon: {
    marginTop: 0,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#030213',
  },
  sectionCount: {
    fontSize: 14,
    color: '#71717A',
  },
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bookItem: {
    width: BOOK_COVER_WIDTH,
    marginBottom: 20,
  },
  bookCover: {
    width: BOOK_COVER_WIDTH,
    height: BOOK_COVER_WIDTH * 1.5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    marginBottom: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  bookTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#030213',
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 11,
    color: '#71717A',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

