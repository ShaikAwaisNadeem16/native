import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, typography } from '../../styles/theme';

type TabType = 'transcript' | 'codeExamples' | 'keyPoints' | 'supplementary' | 'discussion';

interface CourseDetailsContentProps {
    activeTab: TabType;
}

interface TranscriptItem {
    timestamp: string;
    content: string;
}

// Mock transcript data - replace with actual data from API
const mockTranscriptData: TranscriptItem[] = [
    {
        timestamp: '00:00',
        content: 'Hello, and welcome to the science of happiness. I\'m Professor Laurie Santos, a Professor in Psychology and Cognitive Science, and I\'m excited that you\'re going to join me on this journey to learn a little bit about the science, and also the practice of well-being.',
    },
    {
        timestamp: '01:00',
        content: 'Okay. So, what is the course about? Well, you\'re signed on for five quick lectures here in my home, and we\'re going to go through a couple different topics. Today\'s topic is going to be about misconceptions about happiness. The things you think make you happy but don\'t actually. So, be ready for kind of all of your misconceptions to be cleared up, which would be great. Next time, we\'re going to talk about why our expectations are so bad. Basically, I think what you\'ll see is many of the things we think are going to make us happy don\'t. And so, why are we not accurate about the kinds of things that are going to make us happy?',
    },
];

/**
 * CourseDetailsContent Component
 * Renders content based on the active tab
 */
const CourseDetailsContent: React.FC<CourseDetailsContentProps> = ({ activeTab }) => {
    const renderTranscript = () => {
        return (
            <View style={styles.transcriptContainer}>
                {mockTranscriptData.map((item, index) => (
                    <View key={index} style={styles.transcriptItem}>
                        <Text style={styles.timestamp}>{item.timestamp}</Text>
                        <Text style={styles.transcriptText}>{item.content}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderCodeExamples = () => {
        return (
            <View style={styles.contentContainer}>
                <Text style={styles.placeholderText}>Code Examples content coming soon...</Text>
            </View>
        );
    };

    const renderKeyPoints = () => {
        return (
            <View style={styles.contentContainer}>
                <Text style={styles.placeholderText}>Key Points content coming soon...</Text>
            </View>
        );
    };

    const renderSupplementary = () => {
        return (
            <View style={styles.contentContainer}>
                <Text style={styles.placeholderText}>Supplementary Resources content coming soon...</Text>
            </View>
        );
    };

    const renderDiscussion = () => {
        return (
            <View style={styles.contentContainer}>
                <Text style={styles.placeholderText}>Discussion content coming soon...</Text>
            </View>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'transcript':
                return renderTranscript();
            case 'codeExamples':
                return renderCodeExamples();
            case 'keyPoints':
                return renderKeyPoints();
            case 'supplementary':
                return renderSupplementary();
            case 'discussion':
                return renderDiscussion();
            default:
                return renderTranscript();
        }
    };

    return (
        <View style={styles.container}>
            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        paddingTop: 0,
        paddingBottom: 24,
        paddingHorizontal: 16,
        minHeight: 200,
    },
    transcriptContainer: {
        gap: 24,
        paddingTop: 0,
    },
    transcriptItem: {
        flexDirection: 'row',
        gap: 24,
        alignItems: 'flex-start',
    },
    timestamp: {
        ...typography.s1Regular,
        color: '#4a5965',
        minWidth: 48,
    },
    transcriptText: {
        ...typography.p4,
        color: '#4a5965',
        flex: 1,
        lineHeight: 20,
    },
    contentContainer: {
        paddingVertical: 16,
    },
    placeholderText: {
        ...typography.p4,
        color: colors.textGrey,
    },
});

export default CourseDetailsContent;

