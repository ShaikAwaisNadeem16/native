import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography, borderRadius } from '../../styles/theme';
import AutomotiveAwarenessCTA from './AutomotiveAwarenessCTA';

interface AutomotiveAwarenessCardProps {
    title: string;
    description: string;
    icon?: string | number;
    ctaText?: string;
    onClick?: () => void;
    showCTA?: boolean;
}

/**
 * AutomotiveAwarenessCard Component
 * Single awareness item UI with title, description, icon and optional CTA
 */
const AutomotiveAwarenessCard: React.FC<AutomotiveAwarenessCardProps> = ({
    title,
    description,
    icon,
    ctaText = 'Learn More',
    onClick,
    showCTA = true,
}) => {
    return (
        <View style={styles.card}>
            {/* Icon Section */}
            {icon && (
                <View style={styles.iconContainer}>
                    <Image
                        source={typeof icon === 'string' ? { uri: icon } : icon}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                </View>
            )}

            {/* Content Section */}
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

                {/* CTA Button */}
                {showCTA && onClick && (
                    <View style={styles.ctaContainer}>
                        <AutomotiveAwarenessCTA
                            label={ctaText}
                            onPress={onClick}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.card,
        padding: 20,
        gap: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 48,
        height: 48,
    },
    contentContainer: {
        flex: 1,
        gap: 12,
    },
    title: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
    },
    description: {
        ...typography.p4,
        color: colors.textGrey,
        lineHeight: 20,
    },
    ctaContainer: {
        marginTop: 4,
    },
});

export default AutomotiveAwarenessCard;
