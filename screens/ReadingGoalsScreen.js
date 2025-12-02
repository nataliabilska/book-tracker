import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Text, Card, TextInput, Button, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Target, Calendar, TrendingUp } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme as useAppTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const HEADER_BORDER_RADIUS = Math.min(width * 0.15, 40);

export default function ReadingGoalsScreen({ navigation }) {
  const { theme } = useAppTheme();
  const [yearlyGoal, setYearlyGoal] = useState(12);
  const [monthlyGoal, setMonthlyGoal] = useState(1);
  const [booksReadThisYear, setBooksReadThisYear] = useState(0);
  const [booksReadThisMonth, setBooksReadThisMonth] = useState(0);
  const [showYearlyEdit, setShowYearlyEdit] = useState(false);
  const [showMonthlyEdit, setShowMonthlyEdit] = useState(false);
  const [yearlyInput, setYearlyInput] = useState('12');
  const [monthlyInput, setMonthlyInput] = useState('1');

  useEffect(() => {
    loadGoals();
    calculateProgress();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      calculateProgress();
    });
    return unsubscribe;
  }, [navigation]);

  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem('readingGoals');
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        setYearlyGoal(goals.yearly || 12);
        setMonthlyGoal(goals.monthly || 1);
        setYearlyInput((goals.yearly || 12).toString());
        setMonthlyInput((goals.monthly || 1).toString());
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const saveGoals = async (yearly, monthly) => {
    try {
      await AsyncStorage.setItem('readingGoals', JSON.stringify({ yearly, monthly }));
      setYearlyGoal(yearly);
      setMonthlyGoal(monthly);
    } catch (error) {
      console.error('Error saving goals:', error);
      Alert.alert('Error', 'Failed to save goals');
    }
  };

  const calculateProgress = async () => {
    try {
      const storedBooks = await AsyncStorage.getItem('myBooks');
      if (storedBooks) {
        const myBooks = JSON.parse(storedBooks);
        const readBooks = myBooks.read || [];

        const currentYear = new Date().getFullYear();
        const booksThisYear = readBooks.filter(book => {
          if (book.completedDate) {
            const completedYear = new Date(book.completedDate).getFullYear();
            return completedYear === currentYear;
          }
          return true;
        });
        setBooksReadThisYear(booksThisYear.length);

        const currentMonth = new Date().getMonth();
        const booksThisMonth = readBooks.filter(book => {
          if (book.completedDate) {
            const completedDate = new Date(book.completedDate);
            return completedDate.getMonth() === currentMonth && 
                   completedDate.getFullYear() === currentYear;
          }
          return false;
        });
        setBooksReadThisMonth(booksThisMonth.length);
      }
    } catch (error) {
      console.error('Error calculating progress:', error);
    }
  };

  const handleYearlySave = () => {
    const value = parseInt(yearlyInput);
    if (isNaN(value) || value < 0) {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }
    saveGoals(value, monthlyGoal);
    setShowYearlyEdit(false);
  };

  const handleMonthlySave = () => {
    const value = parseInt(monthlyInput);
    if (isNaN(value) || value < 0) {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }
    saveGoals(yearlyGoal, value);
    setShowMonthlyEdit(false);
  };

  const yearlyProgress = yearlyGoal > 0 ? Math.min((booksReadThisYear / yearlyGoal) * 100, 100) : 0;
  const monthlyProgress = monthlyGoal > 0 ? Math.min((booksReadThisMonth / monthlyGoal) * 100, 100) : 0;

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
          <Text style={styles.headerTitle}>Reading Goals</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={[styles.goalCard, { backgroundColor: theme.colors.card }]} elevation={2}>
          <Card.Content>
            <View style={styles.goalHeader}>
              <View style={[styles.goalIconContainer, { backgroundColor: theme.colors.iconBackground }]}>
                <Calendar size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.goalHeaderText}>
                <Text style={[styles.goalTitle, { color: theme.colors.text }]}>Yearly Goal</Text>
                <Text style={[styles.goalSubtitle, { color: theme.colors.textSecondary }]}>{new Date().getFullYear()}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setShowYearlyEdit(!showYearlyEdit);
                  setYearlyInput(yearlyGoal.toString());
                }}
                style={styles.editButton}
              >
                <Text style={[styles.editButtonText, { color: theme.colors.primary }]}>{showYearlyEdit ? 'Cancel' : 'Edit'}</Text>
              </TouchableOpacity>
            </View>

            {showYearlyEdit ? (
              <View style={styles.editContainer}>
                <TextInput
                  label="Books to read this year"
                  value={yearlyInput}
                  onChangeText={setYearlyInput}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.editInput}
                />
                <Button
                  mode="contained"
                  onPress={handleYearlySave}
                  style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
                >
                  Save
                </Button>
              </View>
            ) : (
              <>
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>Progress</Text>
                    <Text style={[styles.progressValue, { color: theme.colors.text }]}>
                      {booksReadThisYear} / {yearlyGoal} books
                    </Text>
                  </View>
                  <ProgressBar
                    progress={yearlyProgress / 100}
                    color={theme.colors.primary}
                    style={styles.progressBar}
                  />
                  <Text style={[styles.progressPercent, { color: theme.colors.textSecondary }]}>
                    {Math.round(yearlyProgress)}% complete
                  </Text>
                </View>
                {yearlyProgress >= 100 && (
                  <View style={[styles.achievementBadge, { backgroundColor: theme.colors.success + '20' }]}>
                    <Text style={[styles.achievementText, { color: theme.colors.success }]}>🎉 Goal Achieved!</Text>
                  </View>
                )}
              </>
            )}
          </Card.Content>
        </Card>

        <Card style={[styles.goalCard, { backgroundColor: theme.colors.card }]} elevation={2}>
          <Card.Content>
            <View style={styles.goalHeader}>
              <View style={[styles.goalIconContainer, { backgroundColor: theme.colors.iconBackground }]}>
                <Target size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.goalHeaderText}>
                <Text style={[styles.goalTitle, { color: theme.colors.text }]}>Monthly Goal</Text>
                <Text style={[styles.goalSubtitle, { color: theme.colors.textSecondary }]}>
                  {new Date().toLocaleString('default', { month: 'long' })}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setShowMonthlyEdit(!showMonthlyEdit);
                  setMonthlyInput(monthlyGoal.toString());
                }}
                style={styles.editButton}
              >
                <Text style={[styles.editButtonText, { color: theme.colors.primary }]}>{showMonthlyEdit ? 'Cancel' : 'Edit'}</Text>
              </TouchableOpacity>
            </View>

            {showMonthlyEdit ? (
              <View style={styles.editContainer}>
                <TextInput
                  label="Books to read this month"
                  value={monthlyInput}
                  onChangeText={setMonthlyInput}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.editInput}
                />
                <Button
                  mode="contained"
                  onPress={handleMonthlySave}
                  style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
                >
                  Save
                </Button>
              </View>
            ) : (
              <>
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>Progress</Text>
                    <Text style={[styles.progressValue, { color: theme.colors.text }]}>
                      {booksReadThisMonth} / {monthlyGoal} books
                    </Text>
                  </View>
                  <ProgressBar
                    progress={monthlyProgress / 100}
                    color={theme.colors.primary}
                    style={styles.progressBar}
                  />
                  <Text style={[styles.progressPercent, { color: theme.colors.textSecondary }]}>
                    {Math.round(monthlyProgress)}% complete
                  </Text>
                </View>
                {monthlyProgress >= 100 && (
                  <View style={[styles.achievementBadge, { backgroundColor: theme.colors.success + '20' }]}>
                    <Text style={[styles.achievementText, { color: theme.colors.success }]}>🎉 Goal Achieved!</Text>
                  </View>
                )}
              </>
            )}
          </Card.Content>
        </Card>

        <Card style={[styles.statsCard, { backgroundColor: theme.colors.card }]} elevation={2}>
          <Card.Content>
            <View style={styles.statsHeader}>
              <TrendingUp size={24} color={theme.colors.primary} />
              <Text style={[styles.statsTitle, { color: theme.colors.text }]}>Quick Stats</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{booksReadThisYear}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>This Year</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{booksReadThisMonth}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>This Month</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                  {yearlyGoal > 0 ? Math.max(0, yearlyGoal - booksReadThisYear) : 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Remaining</Text>
              </View>
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
  goalCard: {
    margin: 24,
    marginTop: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalHeaderText: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  goalSubtitle: {
    fontSize: 14,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  editContainer: {
    marginTop: 8,
  },
  editInput: {
    marginBottom: 12,
  },
  saveButton: {
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressPercent: {
    fontSize: 12,
    textAlign: 'center',
  },
  achievementBadge: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  achievementText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsCard: {
    margin: 24,
    marginTop: 0,
    borderRadius: 16,
    elevation: 2,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
});

