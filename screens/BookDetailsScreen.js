import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, Dimensions, Share } from 'react-native';
import { Text, Button, Card, Avatar, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, BookOpen, Calendar, Check, StickyNote, Quote } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme as useAppTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const HEADER_BORDER_RADIUS = Math.min(width * 0.15, 40);

export default function BookDetailsScreen({ route, navigation }) {
  const { theme } = useAppTheme();
  const { book } = route.params || {
    book: {
      title: 'The Midnight Library',
      author: 'Matt Haig',
      rating: 4.2,
      pages: 304,
      published: 2020,
    },
  };

  const [showShelfModal, setShowShelfModal] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [userReview, setUserReview] = useState({
    rating: 0,
    text: '',
  });
  const [reviews, setReviews] = useState([]);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(book.currentPage || 0);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showQuotesModal, setShowQuotesModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [newQuote, setNewQuote] = useState({ text: '', page: '' });

  const shelves = [
    { id: 'read', name: 'Read', icon: '✓', color: '#059669' },
    { id: 'reading', name: 'Reading', icon: '📖', color: '#0284C7' },
    { id: 'wantToRead', name: 'Want to Read', icon: '📚', color: '#F97316' },
  ];

  const handleAddToShelf = () => {
    setShowShelfModal(true);
  };

  const handleShelfSelect = async (shelf) => {
    setSelectedShelf(shelf);
    setShowShelfModal(false);

    try {
      const storedBooks = await AsyncStorage.getItem('myBooks');
      let myBooks = storedBooks ? JSON.parse(storedBooks) : { read: [], reading: [], wantToRead: [] };

      const shelfKey = shelf.id === 'read' ? 'read' : shelf.id === 'reading' ? 'reading' : 'wantToRead';
      myBooks[shelfKey] = [...myBooks[shelfKey], { ...book, id: Date.now() }];

      await AsyncStorage.setItem('myBooks', JSON.stringify(myBooks));

      console.log(`Added "${book.title}" to ${shelf.name} shelf`);

      Alert.alert(
        'Success!',
        `"${book.title}" has been added to your ${shelf.name} shelf.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MyShelves')
          }
        ]
      );
    } catch (error) {
      console.error('Error saving book to shelf:', error);
      Alert.alert('Error', 'Failed to add book to shelf. Please try again.');
    }
  };

  const handleShare = async () => {
    try {
      const shareContent = `📚 Check out "${book.title}" by ${book.author}\n\n⭐ Rating: ${book.rating || 4.2}/5\n📖 Pages: ${book.pages || 304}\n📅 Published: ${book.published || 2020}\n\n#BookTracker #Reading`;

      await Share.share({
        message: shareContent,
        title: `Check out "${book.title}"`,
      });
    } catch (error) {
      console.error('Error sharing book:', error);
      Alert.alert('Error', 'Failed to share book. Please try again.');
    }
  };

  const handleAddReview = () => {
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (userReview.rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!userReview.text.trim()) {
      Alert.alert('Error', 'Please write a review');
      return;
    }

    try {
      const storedReviews = await AsyncStorage.getItem('bookReviews');
      let bookReviews = storedReviews ? JSON.parse(storedReviews) : {};

      if (!bookReviews[book.id]) {
        bookReviews[book.id] = [];
      }

      bookReviews[book.id].push({
        id: Date.now(),
        name: 'You',
        initials: 'YU',
        rating: userReview.rating,
        text: userReview.text,
        date: new Date().toISOString(),
      });

      await AsyncStorage.setItem('bookReviews', JSON.stringify(bookReviews));

      setUserReview({ rating: 0, text: '' });
      setShowReviewModal(false);

      const currentBookReviews = bookReviews[book.id] || [];
      const allReviews = [
        {
          id: 1,
          name: 'John Doe',
          initials: 'JD',
          rating: 5,
          text: 'An absolutely captivating read! Couldn\'t put it down.',
        },
        {
          id: 2,
          name: 'Alice Smith',
          initials: 'AS',
          rating: 3,
          text: 'Great story with well-developed characters. Highly recommend!',
        },
        ...currentBookReviews
      ];

      setReviews(allReviews);

      Alert.alert('Success!', 'Your review has been added successfully.');
    } catch (error) {
      console.error('Error saving review:', error);
      Alert.alert('Error', 'Failed to save review. Please try again.');
    }
  };

  const handleRatingPress = (rating) => {
    setUserReview(prev => ({ ...prev, rating }));
  };

  const handleProgressUpdate = async (newPage) => {
    try {
      const storedBooks = await AsyncStorage.getItem('myBooks');
      let myBooks = storedBooks ? JSON.parse(storedBooks) : { read: [], reading: [], wantToRead: [] };

      ['read', 'reading', 'wantToRead'].forEach(shelf => {
        const bookIndex = myBooks[shelf].findIndex(b => b.id === book.id);
        if (bookIndex !== -1) {
          myBooks[shelf][bookIndex].currentPage = newPage;
        }
      });

      await AsyncStorage.setItem('myBooks', JSON.stringify(myBooks));
      setCurrentPage(newPage);

      if (newPage >= book.pages) {
        ['reading', 'wantToRead'].forEach(shelf => {
          myBooks[shelf] = myBooks[shelf].filter(b => b.id !== book.id);
        });
        if (!myBooks.read.find(b => b.id === book.id)) {
          myBooks.read.push({ 
            ...book, 
            currentPage: book.pages,
            completedDate: new Date().toISOString()
          });
        }
        await AsyncStorage.setItem('myBooks', JSON.stringify(myBooks));
        Alert.alert('Congratulations!', `You've finished "${book.title}"! 🎉`);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      Alert.alert('Error', 'Failed to update progress. Please try again.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const storedReviews = await AsyncStorage.getItem('bookReviews');
              let bookReviews = storedReviews ? JSON.parse(storedReviews) : {};

              if (bookReviews[book.id]) {
                bookReviews[book.id] = bookReviews[book.id].filter(review => review.id !== reviewId);

                if (bookReviews[book.id].length === 0) {
                  delete bookReviews[book.id];
                }

                await AsyncStorage.setItem('bookReviews', JSON.stringify(bookReviews));

                const currentBookReviews = bookReviews[book.id] || [];
                const allReviews = [
                  {
                    id: 1,
                    name: 'John Doe',
                    initials: 'JD',
                    rating: 5,
                    text: 'An absolutely captivating read! Couldn\'t put it down.',
                  },
                  {
                    id: 2,
                    name: 'Alice Smith',
                    initials: 'AS',
                    rating: 3,
                    text: 'Great story with well-developed characters. Highly recommend!',
                  },
                  ...currentBookReviews
                ];

                setReviews(allReviews);
              }
            } catch (error) {
              console.error('Error deleting review:', error);
              Alert.alert('Error', 'Failed to delete review. Please try again.');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const storedReviews = await AsyncStorage.getItem('bookReviews');
        if (storedReviews) {
          const bookReviews = JSON.parse(storedReviews);
          const currentBookReviews = bookReviews[book.id] || [];

          const allReviews = [
            {
              id: 1,
              name: 'John Doe',
              initials: 'JD',
              rating: 5,
              text: 'An absolutely captivating read! Couldn\'t put it down.',
            },
            {
              id: 2,
              name: 'Alice Smith',
              initials: 'AS',
              rating: 3,
              text: 'Great story with well-developed characters. Highly recommend!',
            },
            ...currentBookReviews
          ];

          setReviews(allReviews);
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
      }
    };

    loadReviews();
    loadNotesAndQuotes();
  }, [book.id]);

  const loadNotesAndQuotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('bookNotes');
      const storedQuotes = await AsyncStorage.getItem('bookQuotes');
      
      if (storedNotes) {
        const allNotes = JSON.parse(storedNotes);
        setNotes(allNotes[book.id] || []);
      }
      
      if (storedQuotes) {
        const allQuotes = JSON.parse(storedQuotes);
        setQuotes(allQuotes[book.id] || []);
      }
    } catch (error) {
      console.error('Error loading notes/quotes:', error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      Alert.alert('Error', 'Please enter a note');
      return;
    }

    try {
      const storedNotes = await AsyncStorage.getItem('bookNotes');
      let allNotes = storedNotes ? JSON.parse(storedNotes) : {};
      
      if (!allNotes[book.id]) {
        allNotes[book.id] = [];
      }
      
      allNotes[book.id].push({
        id: Date.now(),
        text: newNote,
        date: new Date().toISOString(),
      });
      
      await AsyncStorage.setItem('bookNotes', JSON.stringify(allNotes));
      setNotes(allNotes[book.id]);
      setNewNote('');
      setShowNotesModal(false);
      Alert.alert('Success!', 'Note added successfully.');
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note.');
    }
  };

  const handleAddQuote = async () => {
    if (!newQuote.text.trim()) {
      Alert.alert('Error', 'Please enter a quote');
      return;
    }

    try {
      const storedQuotes = await AsyncStorage.getItem('bookQuotes');
      let allQuotes = storedQuotes ? JSON.parse(storedQuotes) : {};
      
      if (!allQuotes[book.id]) {
        allQuotes[book.id] = [];
      }
      
      allQuotes[book.id].push({
        id: Date.now(),
        text: newQuote.text,
        page: newQuote.page || 'N/A',
        date: new Date().toISOString(),
      });
      
      await AsyncStorage.setItem('bookQuotes', JSON.stringify(allQuotes));
      setQuotes(allQuotes[book.id]);
      setNewQuote({ text: '', page: '' });
      setShowQuotesModal(false);
      Alert.alert('Success!', 'Quote added successfully.');
    } catch (error) {
      console.error('Error saving quote:', error);
      Alert.alert('Error', 'Failed to save quote.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const storedNotes = await AsyncStorage.getItem('bookNotes');
              let allNotes = storedNotes ? JSON.parse(storedNotes) : {};
              
              if (allNotes[book.id]) {
                allNotes[book.id] = allNotes[book.id].filter(note => note.id !== noteId);
                await AsyncStorage.setItem('bookNotes', JSON.stringify(allNotes));
                setNotes(allNotes[book.id] || []);
              }
            } catch (error) {
              console.error('Error deleting note:', error);
            }
          },
        },
      ]
    );
  };

  const handleDeleteQuote = async (quoteId) => {
    Alert.alert(
      'Delete Quote',
      'Are you sure you want to delete this quote?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const storedQuotes = await AsyncStorage.getItem('bookQuotes');
              let allQuotes = storedQuotes ? JSON.parse(storedQuotes) : {};
              
              if (allQuotes[book.id]) {
                allQuotes[book.id] = allQuotes[book.id].filter(quote => quote.id !== quoteId);
                await AsyncStorage.setItem('bookQuotes', JSON.stringify(allQuotes));
                setQuotes(allQuotes[book.id] || []);
              }
            } catch (error) {
              console.error('Error deleting quote:', error);
            }
          },
        },
      ]
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Text key={i} style={styles.star}>
        {i < rating ? '★' : '☆'}
      </Text>
    ));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <LinearGradient
        colors={[theme.colors.headerGradientStart, theme.colors.headerGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={[styles.bookInfoCard, { backgroundColor: theme.colors.card }]} elevation={2}>
          <Card.Content style={styles.bookInfoContent}>
            <View style={[styles.bookCover, { backgroundColor: book.color || '#7C3AED' }]}>
              <Text style={styles.bookCoverTitle} numberOfLines={4}>{book.title}</Text>
              <Text style={styles.bookCoverAuthor} numberOfLines={2}>{book.author}</Text>
            </View>
            <View style={styles.bookDetails}>
              <Text style={[styles.bookTitle, { color: theme.colors.text }]}>{book.title}</Text>
              <Text style={[styles.bookAuthor, { color: theme.colors.textSecondary }]}>{book.author}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.star}>★</Text>
                <Text style={[styles.ratingText, { color: theme.colors.text }]}>{book.rating || 4.2} rating</Text>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={handleAddToShelf}
                  style={[styles.addToShelfButton, { backgroundColor: theme.colors.primary }]}
                  contentStyle={styles.addToShelfContent}
                  labelStyle={styles.addToShelfLabel}
                >
                  Add to Shelf
                </Button>
                <Button
                  mode="outlined"
                  onPress={handleShare}
                  style={[styles.shareButton, { borderColor: theme.colors.border }]}
                  contentStyle={styles.shareContent}
                  labelStyle={[styles.shareLabel, { color: theme.colors.text }]}
                  buttonColor={theme.colors.surface}
                >
                  Share
                </Button>
              </View>
              <Button
                mode="outlined"
                onPress={() => setShowProgressModal(true)}
                style={[styles.progressButton, { borderColor: theme.colors.border }]}
                contentStyle={styles.progressContent}
                labelStyle={[styles.progressLabel, { color: theme.colors.text }]}
              >
                Update Progress
              </Button>
              <View style={[styles.bookMetaContainer, { backgroundColor: theme.colors.statCard }]}>
                <View style={styles.bookMeta}>
                  <BookOpen size={16} color="#666666" />
                  <Text style={styles.bookMetaText}>Pages</Text>
                  <Text style={styles.bookMetaValue}>{book.pages || 304}</Text>
                </View>
                <View style={styles.bookMeta}>
                  <Calendar size={16} color="#666666" />
                  <Text style={styles.bookMetaText}>Published</Text>
                  <Text style={styles.bookMetaValue}>{book.published || 2020}</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Synopsis</Text>
            <Text style={[styles.synopsisText, { color: theme.colors.text }]}>
              {book.description || 'No description available for this book.'}
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <View style={styles.reviewsHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Reader Reviews</Text>
              <Button
                mode="contained"
                onPress={() => setShowReviewModal(true)}
                style={[styles.addReviewButton, { backgroundColor: theme.colors.primary }]}
                contentStyle={styles.addReviewContent}
                labelStyle={styles.addReviewLabel}
                compact={true}
              >
                Add Review
              </Button>
            </View>
            {reviews.map((review) => (
              <View key={review.id} style={[styles.reviewItem, { backgroundColor: theme.colors.statCard }]}>
                <Avatar.Text
                  size={40}
                  label={review.initials}
                  style={styles.avatar}
                  labelStyle={styles.avatarLabel}
                />
                <View style={styles.reviewContent}>
                  <View style={styles.reviewHeader}>
                    <Text style={[styles.reviewName, { color: theme.colors.text }]}>{review.name}</Text>
                    {review.name === 'You' && (
                      <TouchableOpacity
                        onPress={() => handleDeleteReview(review.id)}
                        style={styles.deleteButton}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.deleteButtonText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.reviewStars}>
                    {renderStars(review.rating)}
                  </View>
                  <Text style={[styles.reviewText, { color: theme.colors.textSecondary }]}>{review.text}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <View style={styles.reviewsHeader}>
              <View style={styles.sectionTitleRow}>
                <StickyNote size={20} color={theme.colors.primary} />
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>My Notes</Text>
              </View>
              <Button
                mode="contained"
                onPress={() => setShowNotesModal(true)}
                style={[styles.addReviewButton, { backgroundColor: theme.colors.primary }]}
                contentStyle={styles.addReviewContent}
                labelStyle={styles.addReviewLabel}
                compact={true}
              >
                Add Note
              </Button>
            </View>
            {notes.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.colors.emptyText }]}>No notes yet. Add your first note!</Text>
            ) : (
              notes.map((note) => (
                <View key={note.id} style={[styles.noteItem, { backgroundColor: theme.colors.statCard }]}>
                  <View style={styles.noteContent}>
                    <Text style={[styles.noteText, { color: theme.colors.text }]}>{note.text}</Text>
                    <Text style={[styles.noteDate, { color: theme.colors.textSecondary }]}>
                      {new Date(note.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteNote(note.id)}
                    style={styles.deleteButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.deleteButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <View style={styles.reviewsHeader}>
              <View style={styles.sectionTitleRow}>
                <Quote size={20} color={theme.colors.primary} />
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Favorite Quotes</Text>
              </View>
              <Button
                mode="contained"
                onPress={() => setShowQuotesModal(true)}
                style={[styles.addReviewButton, { backgroundColor: theme.colors.primary }]}
                contentStyle={styles.addReviewContent}
                labelStyle={styles.addReviewLabel}
                compact={true}
              >
                Add Quote
              </Button>
            </View>
            {quotes.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.colors.emptyText }]}>No quotes yet. Save your favorite quotes!</Text>
            ) : (
              quotes.map((quote) => (
                <View key={quote.id} style={[styles.quoteItem, { backgroundColor: theme.colors.statCard }]}>
                  <Text style={[styles.quoteText, { color: theme.colors.text }]}>"{quote.text}"</Text>
                  <View style={styles.quoteFooter}>
                    <Text style={[styles.quotePage, { color: theme.colors.textSecondary }]}>Page {quote.page}</Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteQuote(quote.id)}
                      style={styles.deleteButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.deleteButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <Modal
        visible={showShelfModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowShelfModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Add to Shelf</Text>
            <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>Choose where to add "{book.title}"</Text>

            {shelves.map((shelf) => (
              <TouchableOpacity
                key={shelf.id}
                style={[styles.shelfOption, { backgroundColor: theme.colors.statCard }]}
                onPress={() => handleShelfSelect(shelf)}
                activeOpacity={0.7}
              >
                <View style={[styles.shelfIcon, { backgroundColor: shelf.color }]}>
                  <Text style={styles.shelfIconText}>{shelf.icon}</Text>
                </View>
                <Text style={[styles.shelfName, { color: theme.colors.text }]}>{shelf.name}</Text>
                <Check size={20} color={theme.colors.primary} style={styles.checkIcon} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowShelfModal(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelButtonText, { color: theme.colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showReviewModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.reviewModalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Add Your Review</Text>
            <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>Rate and review "{book.title}"</Text>

            <Text style={[styles.ratingLabel, { color: theme.colors.text }]}>Your Rating</Text>
            <View style={styles.ratingStarsContainer}>
              {Array.from({ length: 5 }, (_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleRatingPress(i + 1)}
                  activeOpacity={0.7}
                  style={styles.starButton}
                >
                  <Text style={[styles.ratingStar, i < userReview.rating && styles.ratingStarSelected]}>
                    {i < userReview.rating ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.reviewTextLabel, { color: theme.colors.text }]}>Your Review</Text>
            <TextInput
              style={styles.reviewTextInput}
              multiline
              numberOfLines={4}
              value={userReview.text}
              onChangeText={(text) => setUserReview(prev => ({ ...prev, text }))}
              placeholder="Write your review here..."
              mode="outlined"
            />

            <View style={styles.reviewModalButtons}>
              <Button
                mode="outlined"
                onPress={() => setShowReviewModal(false)}
                style={[styles.cancelReviewButton, { borderColor: theme.colors.border }]}
                contentStyle={styles.cancelReviewContent}
                labelStyle={{ color: theme.colors.text }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmitReview}
                style={[styles.submitReviewButton, { backgroundColor: theme.colors.primary }]}
                contentStyle={styles.submitReviewContent}
              >
                Submit
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showProgressModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProgressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.progressModalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Update Reading Progress</Text>
            <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>Current page for "{book.title}"</Text>

            <Text style={[styles.progressLabel, { color: theme.colors.text }]}>Current Page</Text>
            <TextInput
              style={styles.progressInput}
              keyboardType="numeric"
              value={currentPage.toString()}
              onChangeText={(text) => {
                const page = parseInt(text) || 0;
                if (page >= 0 && page <= book.pages) {
                  setCurrentPage(page);
                }
              }}
              placeholder={`0 - ${book.pages}`}
              mode="outlined"
            />

            <Text style={[styles.progressInfo, { color: theme.colors.textSecondary }]}>
              Progress: {Math.round((currentPage / book.pages) * 100)}% ({currentPage} of {book.pages} pages)
            </Text>

            <View style={styles.progressModalButtons}>
              <Button
                mode="outlined"
                onPress={() => setShowProgressModal(false)}
                style={[styles.cancelProgressButton, { borderColor: theme.colors.border }]}
                contentStyle={styles.cancelProgressContent}
                labelStyle={{ color: theme.colors.text }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  handleProgressUpdate(currentPage);
                  setShowProgressModal(false);
                }}
                style={[styles.submitProgressButton, { backgroundColor: theme.colors.primary }]}
                contentStyle={styles.submitProgressContent}
              >
                Update
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showNotesModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.reviewModalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Add Note</Text>
            <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>Write a note about "{book.title}"</Text>

            <Text style={[styles.reviewTextLabel, { color: theme.colors.text }]}>Your Note</Text>
            <TextInput
              style={styles.reviewTextInput}
              multiline
              numberOfLines={6}
              value={newNote}
              onChangeText={setNewNote}
              placeholder="Write your note here..."
              mode="outlined"
            />

            <View style={styles.reviewModalButtons}>
              <Button
                mode="outlined"
                onPress={() => {
                  setShowNotesModal(false);
                  setNewNote('');
                }}
                style={[styles.cancelReviewButton, { borderColor: theme.colors.border }]}
                contentStyle={styles.cancelReviewContent}
                labelStyle={{ color: theme.colors.text }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleAddNote}
                style={[styles.submitReviewButton, { backgroundColor: theme.colors.primary }]}
                contentStyle={styles.submitReviewContent}
              >
                Save
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showQuotesModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowQuotesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.reviewModalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Add Quote</Text>
            <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>Save a favorite quote from "{book.title}"</Text>

            <Text style={[styles.reviewTextLabel, { color: theme.colors.text }]}>Quote</Text>
            <TextInput
              style={styles.reviewTextInput}
              multiline
              numberOfLines={4}
              value={newQuote.text}
              onChangeText={(text) => setNewQuote(prev => ({ ...prev, text }))}
              placeholder="Enter the quote..."
              mode="outlined"
            />

            <Text style={[styles.reviewTextLabel, { color: theme.colors.text }]}>Page (optional)</Text>
            <TextInput
              style={styles.reviewTextInput}
              keyboardType="numeric"
              value={newQuote.page}
              onChangeText={(page) => setNewQuote(prev => ({ ...prev, page }))}
              placeholder="Page number"
              mode="outlined"
            />

            <View style={styles.reviewModalButtons}>
              <Button
                mode="outlined"
                onPress={() => {
                  setShowQuotesModal(false);
                  setNewQuote({ text: '', page: '' });
                }}
                style={[styles.cancelReviewButton, { borderColor: theme.colors.border }]}
                contentStyle={styles.cancelReviewContent}
                labelStyle={{ color: theme.colors.text }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleAddQuote}
                style={[styles.submitReviewButton, { backgroundColor: theme.colors.primary }]}
                contentStyle={styles.submitReviewContent}
              >
                Save
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  bookInfoCard: {
    margin: 24,
    marginTop: 20,
    borderRadius: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  bookInfoContent: {
    flexDirection: 'row',
    padding: 16,
  },
  bookCover: {
    width: 96,
    height: 144,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  bookCoverTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  bookCoverAuthor: {
    color: '#ffffff',
    fontSize: 11,
    textAlign: 'center',
  },
  bookDetails: {
    flex: 1,
    marginLeft: 16,
    paddingTop: 8,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  star: {
    fontSize: 16,
    color: '#FBBF24',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  addToShelfButton: {
    borderRadius: 8,
    height: 36,
  },
  addToShelfContent: {
    paddingVertical: 0,
  },
  addToShelfLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  shareButton: {
    borderRadius: 8,
    height: 36,
  },
  shareContent: {
    paddingVertical: 0,
  },
  shareLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#030213',
  },
  progressButton: {
    borderRadius: 8,
    height: 36,
    marginBottom: 16,
  },
  progressContent: {
    paddingVertical: 0,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#030213',
  },
  bookMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 12,
  },
  bookMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookMetaText: {
    fontSize: 12,
    marginLeft: 4,
    marginRight: 4,
  },
  bookMetaValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  synopsisText: {
    fontSize: 14,
    lineHeight: 22,
  },
  reviewItem: {
    flexDirection: 'row',
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
  },
  avatar: {
    marginRight: 12,
  },
  avatarLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  shelfOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  shelfIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shelfIconText: {
    fontSize: 16,
    color: '#ffffff',
  },
  shelfName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  checkIcon: {
    opacity: 0,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addReviewButton: {
    backgroundColor: '#7C3AED',
  },
  addReviewContent: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  addReviewLabel: {
    color: '#ffffff',
    fontSize: 12,
  },
  reviewModalContent: {
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxHeight: '80%',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  ratingStarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  starButton: {
    padding: 8,
  },
  ratingStar: {
    fontSize: 32,
    color: '#D1D5DB',
  },
  ratingStarSelected: {
    color: '#FCD34D',
  },
  reviewTextLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  reviewTextInput: {
    marginBottom: 24,
    maxHeight: 100,
  },
  reviewModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelReviewButton: {
    flex: 1,
  },
  cancelReviewContent: {
    paddingVertical: 12,
  },
  submitReviewButton: {
    flex: 1,
  },
  submitReviewContent: {
    paddingVertical: 12,
  },
  progressModalContent: {
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 320,
  },
  progressInput: {
    marginBottom: 16,
  },
  progressInfo: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  progressModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelProgressButton: {
    flex: 1,
  },
  cancelProgressContent: {
    paddingVertical: 12,
  },
  submitProgressButton: {
    flex: 1,
  },
  submitProgressContent: {
    paddingVertical: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noteItem: {
    flexDirection: 'row',
    backgroundColor: '#F3F3F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  noteContent: {
    flex: 1,
  },
  noteText: {
    fontSize: 14,
    marginBottom: 4,
  },
  noteDate: {
    fontSize: 12,
  },
  quoteItem: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 20,
  },
  quoteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quotePage: {
    fontSize: 12,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
});
