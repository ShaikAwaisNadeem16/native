import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../../styles/theme';
import useProfileStore from '../../../store/useProfileStore';
import CreamCollarLogo from '../../../components/common/CreamCollarLogo';
import AssessmentLogo from '../../../components/common/AssessmentLogo';
import Avatar from '../../../components/common/Avatar';

// Icons removed - will be added later

interface HeaderProps {
    onProfilePress?: () => void;
    onNotificationPress?: () => void;
    onLogoPress?: () => void;
    useAssessmentLogo?: boolean; // Use assessment logo instead of regular logo
}

const Header: React.FC<HeaderProps> = ({ onProfilePress, onNotificationPress, onLogoPress, useAssessmentLogo = false }) => {
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
                    {useAssessmentLogo ? (
                        <AssessmentLogo size={32} />
                    ) : (
                        <CreamCollarLogo width={149} height={32} />
                    )}
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
                
                {/* Profile Avatar */}
                <TouchableOpacity onPress={onProfilePress} activeOpacity={0.7}>
                    <View style={styles.avatarContainer}>
                        <Avatar size={40} />
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
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: colors.lightGrey,
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

