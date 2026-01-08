import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DownwardArrow from '../../../components/common/DownwardArrow';
import { colors, typography, borderRadius } from '../../../styles/theme';
import CompletedJourneyBlock from './CompletedJourneyBlock';

interface CompletedActivitiesCardProps {
    completed: number;
    total: number;
    completedItems?: Array<{
        checkIconUrl?: string;
        useGreenCheck?: boolean;
        subtitle: string;
        title: string;
        buttonLabel: string;
        onButtonPress?: () => void;
    }>;
}

const CompletedActivitiesCard: React.FC<CompletedActivitiesCardProps> = ({
    completed,
    total,
    completedItems = [],
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={handleToggle}
                activeOpacity={0.7}
            >
                <View style={styles.content}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Completed Activities</Text>
                        <Text style={styles.count}>({completed}/{total})</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <DownwardArrow
                            size={24}
                            style={isExpanded ? undefined : styles.iconRotated}
                        />
                    </View>
                </View>
            </TouchableOpacity>
            {isExpanded && completedItems.length > 0 && (
                <View style={styles.expandedContent}>
                    {completedItems.map((item, index) => (
                        <CompletedJourneyBlock
                            key={index}
                            checkIconUrl={item.checkIconUrl}
                            useGreenCheck={item.useGreenCheck}
                            subtitle={item.subtitle}
                            title={item.title}
                            buttonLabel={item.buttonLabel}
                            onButtonPress={item.onButtonPress}
                            showDivider={index < completedItems.length - 1}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.card,
        width: '100%',
        overflow: 'hidden',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    title: {
        ...typography.p4SemiBold,
        color: colors.primaryDarkBlue,
    },
    count: {
        ...typography.p4,
        color: colors.textGrey,
    },
    iconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconRotated: {
        transform: [{ rotate: '180deg' }], // Upward arrow when collapsed
    },
    expandedContent: {
        flexDirection: 'column',
        gap: 0,
        paddingHorizontal: 0, // No horizontal padding - blocks are full width within card padding
        paddingTop: 12, // Gap from header to content (12px from Figma gap-[12px])
    },
});

export default CompletedActivitiesCard;

