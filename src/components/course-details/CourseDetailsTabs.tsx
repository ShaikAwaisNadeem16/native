import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../styles/theme';

type TabType = 'transcript' | 'codeExamples' | 'keyPoints' | 'supplementary' | 'discussion';

interface CourseDetailsTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

interface TabItem {
    id: TabType;
    label: string;
}

const tabs: TabItem[] = [
    { id: 'transcript', label: 'Transcript' },
    { id: 'codeExamples', label: 'Code Examples' },
    { id: 'keyPoints', label: 'Key points' },
    { id: 'supplementary', label: 'Supplementary resources' },
    { id: 'discussion', label: 'Discussion' },
];

/**
 * CourseDetailsTabs Component
 * Tab navigation component for course content sections
 */
const CourseDetailsTabs: React.FC<CourseDetailsTabsProps> = ({
    activeTab,
    onTabChange,
}) => {
    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <TouchableOpacity
                        key={tab.id}
                        style={[styles.tab, isActive && styles.tabActive]}
                        onPress={() => onTabChange(tab.id)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                            {tab.label}
                        </Text>
                        {isActive && <View style={styles.tabIndicator} />}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: '#dde1e6',
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 0,
        marginRight: 40,
        position: 'relative',
    },
    tabActive: {
        // Active tab styling handled by indicator
    },
    tabText: {
        ...typography.p4SemiBold,
        color: colors.primaryDarkBlue,
    },
    tabTextActive: {
        ...typography.p4SemiBold,
        fontWeight: '600',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: colors.primaryBlue,
    },
});

export default CourseDetailsTabs;

