import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { colors, typography } from '../../styles/theme';
import CourseDetailsModuleWidget from './CourseDetailsModuleWidget';
import CourseDetailsHeader from './CourseDetailsHeader';
import CourseDetailsVideoPlayer from './CourseDetailsVideoPlayer';
import CourseDetailsTabs from './CourseDetailsTabs';
import CourseDetailsContent from './CourseDetailsContent';

interface CourseDetailsSectionProps {
    courseId?: string;
    courseTitle?: string;
    moduleTitle?: string;
    moduleSubtitle?: string;
    onHamburgerPress?: () => void;
}

/**
 * CourseDetailsSection Component
 * Main container for course details page based on Figma design
 * Contains video player, tabs, and content sections
 */
const CourseDetailsSection: React.FC<CourseDetailsSectionProps> = ({
    courseId,
    courseTitle = 'Different Players In The Automotive Industry',
    moduleTitle = 'Awareness On Automotive Industry',
    moduleSubtitle = 'Automotive Industry Value Chain',
    onHamburgerPress,
}) => {
    const [activeTab, setActiveTab] = useState<'transcript' | 'codeExamples' | 'keyPoints' | 'supplementary' | 'discussion'>('transcript');

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.content}>
                {/* Module Widget */}
                <CourseDetailsModuleWidget
                    title={moduleTitle}
                    subtitle={moduleSubtitle}
                    onHamburgerPress={onHamburgerPress}
                />

                {/* Title Section */}
                <CourseDetailsHeader title={courseTitle} />

                {/* Video Player */}
                <CourseDetailsVideoPlayer />

                {/* Tabs and Content */}
                <View style={styles.tabsAndContentContainer}>
                    <CourseDetailsTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                    <CourseDetailsContent activeTab={activeTab} />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 32,
    },
    content: {
        gap: 16,
        width: '100%',
    },
    tabsAndContentContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        overflow: 'hidden',
        width: '100%',
    },
});

export default CourseDetailsSection;

