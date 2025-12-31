import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../styles/theme';

interface HeaderProps {
    onProfilePress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProfilePress }) => {
    // CC Logo image URL from Figma
    const ccLogoUrl = 'https://www.figma.com/api/mcp/asset/25a055a9-4892-4cc3-a824-a24873e522bf';
    // Profile avatar image URL from Figma
    const profileAvatarUrl = 'https://www.figma.com/api/mcp/asset/1e50fa56-ea6d-4443-938c-020f6c70b43d';

    return (
        <View style={styles.container}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
                <Image
                    source={{ uri: ccLogoUrl }}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Profile Avatar */}
            <TouchableOpacity onPress={onProfilePress} activeOpacity={0.7}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: profileAvatarUrl }}
                        style={styles.avatar}
                        resizeMode="cover"
                    />
                </View>
            </TouchableOpacity>
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
    logoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 149,
        height: 31.919,
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
});

export default Header;

