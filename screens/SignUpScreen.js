import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen } from 'lucide-react-native';
import { useTheme as useAppTheme } from '../context/ThemeContext';

export default function SignUpScreen({ navigation }) {
    const { theme } = useAppTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Name field cannot be empty';
        }

        if (!email.trim()) {
            newErrors.email = 'Email field cannot be empty';
        }

        if (!password.trim()) {
            newErrors.password = 'Password field cannot be empty';
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Confirm password field cannot be empty';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = () => {
        if (validateForm()) {
            navigation.replace('MainTabs');
        }
    };

    return (
        <LinearGradient
            colors={theme.mode === 'dark' ? ['#1E293B', '#0F172A'] : ['#F3E8FF', '#E9D5FF']}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                <View style={styles.content}>
                    <View style={styles.logoContainer}>
                        <View style={[styles.logo, { backgroundColor: theme.colors.primary }]}>
                            <BookOpen size={28} color="#ffffff" />
                        </View>
                        <Text style={[styles.appName, { color: theme.colors.primary }]}>Join BookTracker</Text>
                    </View>

                    <Card style={[styles.card, { backgroundColor: theme.colors.card }]} elevation={2}>
                        <Card.Content style={styles.cardContent}>
                            <Text style={[styles.title, { color: theme.colors.text }]}>Create Account</Text>
                            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Start your reading journey</Text>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    label="Name"
                                    value={name}
                                    onChangeText={setName}
                                    mode="outlined"
                                    style={[styles.input, { backgroundColor: theme.colors.surface }]}
                                    outlineColor={theme.colors.border}
                                    activeOutlineColor={theme.colors.primary}
                                    textColor={theme.colors.text}
                                />
                                {errors.name && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.name}</Text>}
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    label="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    mode="outlined"
                                    style={[styles.input, { backgroundColor: theme.colors.surface }]}
                                    outlineColor={theme.colors.border}
                                    activeOutlineColor={theme.colors.primary}
                                    textColor={theme.colors.text}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                {errors.email && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.email}</Text>}
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    label="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    mode="outlined"
                                    style={[styles.input, { backgroundColor: theme.colors.surface }]}
                                    outlineColor={theme.colors.border}
                                    activeOutlineColor={theme.colors.primary}
                                    textColor={theme.colors.text}
                                    secureTextEntry
                                />
                                {errors.password && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.password}</Text>}
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    label="Confirm Password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    mode="outlined"
                                    style={[styles.input, { backgroundColor: theme.colors.surface }]}
                                    outlineColor={theme.colors.border}
                                    activeOutlineColor={theme.colors.primary}
                                    textColor={theme.colors.text}
                                    secureTextEntry
                                />
                                {errors.confirmPassword && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.confirmPassword}</Text>}
                            </View>

                            <View style={styles.buttonContainer}>
                                <Button
                                    mode="contained"
                                    onPress={handleSignUp}
                                    style={[styles.signupButton, { backgroundColor: theme.colors.primary }]}
                                    contentStyle={styles.signupButtonContent}
                                    labelStyle={styles.signupButtonLabel}
                                >
                                    Sign Up
                                </Button>
                            </View>

                            <View style={[styles.loginContainer, { borderTopColor: theme.colors.border }]}>
                                <Text style={[styles.loginText, { color: theme.colors.textSecondary }]}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={[styles.loginLink, { color: theme.colors.primary }]}>Log in</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    card: {
        borderRadius: 16,
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
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        height: 36,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
    },
    buttonContainer: {
        marginTop: 12,
    },
    signupButton: {
        borderRadius: 8,
        height: 48,
        minHeight: 48,
    },
    signupButtonContent: {
        paddingVertical: 2,
        paddingHorizontal: 16,
    },
    signupButtonLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    loginText: {
        fontSize: 14,
    },
    loginLink: {
        fontSize: 14,
        fontWeight: '500',
    },
});
