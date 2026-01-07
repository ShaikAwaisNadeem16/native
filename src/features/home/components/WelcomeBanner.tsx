import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';

/**
 * WelcomeBanner Component
 * Displays a greeting banner with user's name and motivational message
 *
 * Props:
 * - userName: string - The user's first name to display in greeting
 * - greeting?: string - Optional custom greeting (defaults to time-based greeting)
 * - message?: string - Optional motivational message
 */

interface WelcomeBannerProps {
    // User's first name to display in the greeting
    userName: string;
    // Optional custom greeting text (e.g., "Good Morning")
    greeting?: string;
    // Optional motivational message displayed below the greeting
    message?: string;
}

// Helper function to get time-based greeting
const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
};

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
    userName,
    greeting,
    message = "Let's continue your learning journey!",
}) => {
    // Use provided greeting or fall back to time-based greeting
    const displayGreeting = greeting || getTimeBasedGreeting();

    return (
        <View style={styles.container}>
            {/* Greeting Section */}
            <View style={styles.greetingSection}>
                <Text style={styles.greetingText}>
                    {displayGreeting}, <Text style={styles.userName}>{userName}</Text>
                </Text>
                <Text style={styles.messageText}>{message}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.highlightBlue, // #f2f7fe - light blue background
        paddingHorizontal: 16,
        paddingVertical: 16,
        width: '100%',
    },
    greetingSection: {
        flexDirection: 'column',
        gap: 4,
    },
    greetingText: {
        ...typography.p2Bold, // 18px Bold
        color: colors.primaryDarkBlue, // #00213d
    },
    userName: {
        color: colors.primaryBlue, // #0b6aea - highlight the name
    },
    messageText: {
        ...typography.p4, // 14px Regular
        color: colors.textGrey, // #696a6f
    },
});

export default WelcomeBanner;
