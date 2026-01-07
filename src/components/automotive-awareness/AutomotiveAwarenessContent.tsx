import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import AutomotiveAwarenessCard from './AutomotiveAwarenessCard';

interface AwarenessItem {
    id: string;
    title: string;
    description: string;
    icon?: string | number;
    ctaText?: string;
}

interface AutomotiveAwarenessContentProps {
    items: AwarenessItem[];
    onItemClick?: (itemId: string) => void;
    showCTA?: boolean;
}

/**
 * AutomotiveAwarenessContent Component
 * Layout container that iterates over awareness items
 * Handles responsive grid/stack layout as per Figma
 */
const AutomotiveAwarenessContent: React.FC<AutomotiveAwarenessContentProps> = ({
    items,
    onItemClick,
    showCTA = true,
}) => {
    const { width } = useWindowDimensions();

    // Responsive: 2 columns for desktop (>768px), 1 column for mobile
    const isDesktop = width > 768;

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <View style={[styles.container, isDesktop && styles.containerDesktop]}>
            {items.map((item) => (
                <View
                    key={item.id}
                    style={[
                        styles.cardWrapper,
                        isDesktop && styles.cardWrapperDesktop,
                    ]}
                >
                    <AutomotiveAwarenessCard
                        title={item.title}
                        description={item.description}
                        icon={item.icon}
                        ctaText={item.ctaText}
                        onClick={onItemClick ? () => onItemClick(item.id) : undefined}
                        showCTA={showCTA}
                    />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    containerDesktop: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    cardWrapper: {
        width: '100%',
    },
    cardWrapperDesktop: {
        width: '48%',
    },
});

export default AutomotiveAwarenessContent;
