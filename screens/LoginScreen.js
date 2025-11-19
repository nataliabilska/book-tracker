import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen } from 'lucide-react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email field cannot be empty';
    }

    if (!password.trim()) {
      newErrors.password = 'Password field cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      // Simulated login - navigate to Home
      navigation.replace('MainTabs');
    }
  };

  return (
    <LinearGradient
      colors={['#F3E8FF', '#E9D5FF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.content}>
          {/* Logo and App Name */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <BookOpen size={28} color="#ffffff" />
            </View>
            <Text style={styles.appName}>BookTracker</Text>
          </View>

          {/* Login Form */}
          <Card style={styles.card} elevation={2}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  style={styles.input}
                  outlineColor="#E5E5E5"
                  activeOutlineColor="#7C3AED"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  mode="outlined"
                  style={styles.input}
                  outlineColor="#E5E5E5"
                  activeOutlineColor="#7C3AED"
                  secureTextEntry
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={handleLogin}
                  style={styles.loginButton}
                  contentStyle={styles.loginButtonContent}
                  labelStyle={styles.loginButtonLabel}
                >
                  Log In
                </Button>
              </View>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={styles.signupLink}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 4,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cardContent: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#030213',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#71717A',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F3F3F5',
    height: 36,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 12,
  },
  loginButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    height: 48,
    minHeight: 48,
  },
  loginButtonContent: {
    paddingVertical: 2,
    paddingHorizontal: 16,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  signupText: {
    fontSize: 14,
    color: '#71717A',
  },
  signupLink: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '500',
  },
});

