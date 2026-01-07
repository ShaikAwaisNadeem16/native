import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../../styles/theme';
import useProfileStore from '../../../store/useProfileStore';

// Icons removed - will be added later

interface HeaderProps {
    onProfilePress?: () => void;
    onNotificationPress?: () => void;
    onLogoPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProfilePress, onNotificationPress, onLogoPress }) => {
    // Get notifications and badgeCount from store to determine read/unread state
    const { notifications, badgeCount } = useProfileStore();

    // Check if there are unread notifications using badgeCount (matching web app functionality)
    const hasUnreadNotifications = badgeCount > 0;

    return (
        <View style={styles.container}>
            {/* Left Section: Logo */}
            <View style={styles.leftSection}>
                {/* Logo Section - clickable to navigate home */}
                <TouchableOpacity
                    onPress={onLogoPress}
                    activeOpacity={0.7}
                    style={styles.logoContainer}
                >
                    <View style={styles.logo} />
                </TouchableOpacity>
            </View>

            {/* Right Section: Notification and Profile */}
            <View style={styles.rightSection}>
                {/* Notification Icon - placeholder */}
                {onNotificationPress && (
                    <TouchableOpacity 
                        onPress={onNotificationPress} 
                        activeOpacity={0.7}
                        style={styles.notificationContainer}
                    >
                        <View style={styles.notificationIcon} />
                    </TouchableOpacity>
                )}
                
                {/* Profile Avatar - placeholder */}
                <TouchableOpacity onPress={onProfilePress} activeOpacity={0.7}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        width: '100%',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 149,
        height: 31.919,
        backgroundColor: colors.lightGrey, // Placeholder background
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: colors.lightGrey,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    notificationContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationIcon: {
        width: 20,
        height: 20,
    },
});

export default Header;

