import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, typography, borderRadius } from '../../styles/theme';

interface CompletedJourneyBlockProps {
    checkIconUrl: string;
    subtitle: string;
    title: string;
    buttonLabel: string;
    onButtonPress?: () => void;
    showDivider?: boolean;
}

const CompletedJourneyBlock: React.FC<CompletedJourneyBlockProps> = ({
    checkIconUrl,
    subtitle,
    title,
    buttonLabel,
    onButtonPress,
    showDivider = false,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconTitleSection}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={{ uri: checkIconUrl }}
                            style={styles.icon}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.titleSection}>
                        <Text style={styles.subtitle}>{subtitle}</Text>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={onButtonPress}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>{buttonLabel}</Text>
            </TouchableOpacity>
            {showDivider && <View style={styles.divider} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flexDirection: 'column',
        gap: 12,
        paddingVertical: 16,
        paddingHorizontal: 0,
        width: '100%',
    },
    content: {
        flexDirection: 'row',
        gap: 15,
        width: '100%',
    },
    iconTitleSection: {
        flexDirection: 'row',
        gap: 16,
        flex: 1,
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: '100%',
        height: '100%',
    },
    titleSection: {
        flexDirection: 'column',
        gap: 4,
        flex: 1,
    },
    subtitle: {
        ...typography.s1Regular,
        color: colors.textGrey,
        lineHeight: 16,
    },
    title: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
    },
    button: {
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: borderRadius.input,
        paddingHorizontal: 24,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'transparent',
    },
    buttonText: {
        ...typography.p4SemiBold,
        color: colors.primaryBlue,
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: colors.lightGrey,
        marginTop: 0,
    },
});

export default CompletedJourneyBlock;

