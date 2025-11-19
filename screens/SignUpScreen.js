import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen } from 'lucide-react-native';

export default function SignUpScreen({ navigation }) {
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
            // Simulated registration - navigate to Home
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
                        <Text style={styles.appName}>Join BookTracker</Text>
                    </View>

                    {/* Sign Up Form */}
                    <Card style={styles.card} elevation={2}>
                        <Card.Content style={styles.cardContent}>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>Start your reading journey</Text>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    label="Name"
                                    value={name}
                                    onChangeText={setName}
                                    mode="outlined"
                                    style={styles.input}
                                    outlineColor="#E5E5E5"
                                    activeOutlineColor="#7C3AED"
                                />
                                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                            </View>

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

                            <View style={styles.inputContainer}>
                                <TextInput
                                    label="Confirm Password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    mode="outlined"
                                    style={styles.input}
                                    outlineColor="#E5E5E5"
                                    activeOutlineColor="#7C3AED"
                                    secureTextEntry
                                />
                                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                            </View>

                            <View style={styles.buttonContainer}>
                                <Button
                                    mode="contained"
                                    onPress={handleSignUp}
                                    style={styles.signupButton}
                                    contentStyle={styles.signupButtonContent}
                                    labelStyle={styles.signupButtonLabel}
                                >
                                    Sign Up
                                </Button>
                            </View>

                            <View style={styles.loginContainer}>
                                <Text style={styles.loginText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.loginLink}>Log in</Text>
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
    signupButton: {
        backgroundColor: '#7C3AED',
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
        borderTopColor: '#E5E5E5',
    },
    loginText: {
        fontSize: 14,
        color: '#71717A',
    },
    loginLink: {
        fontSize: 14,
        color: '#7C3AED',
        fontWeight: '500',
    },
});
