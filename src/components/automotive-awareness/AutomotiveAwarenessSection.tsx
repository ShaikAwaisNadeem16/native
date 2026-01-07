import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../styles/theme';
import AutomotiveAwarenessHeader from './AutomotiveAwarenessHeader';
import AutomotiveAwarenessContent from './AutomotiveAwarenessContent';
import Header from '../../features/home/components/Header';
import BreadcrumbBar from '../../features/assessments/components/BreadcrumbBar';

interface AwarenessItem {
    id: string;
    title: string;
    description: string;
    icon?: string | number;
    ctaText?: string;
}

interface AutomotiveAwarenessSectionProps {
    title?: string;
    subtitle?: string;
    items?: AwarenessItem[];
    breadcrumbItems?: string[];
    onProfilePress?: () => void;
    onLogoPress?: () => void;
    onItemClick?: (itemId: string) => void;
    showCTA?: boolean;
}

// Default awareness items data
const defaultAwarenessItems: AwarenessItem[] = [
    {
        id: '1',
        title: 'What is the Automotive Industry?',
        description: 'The automotive industry encompasses the design, development, manufacturing, marketing, and selling of motor vehicles. It is one of the largest industries globally by revenue.',
        ctaText: 'Learn More',
    },
    {
        id: '2',
        title: 'Industry Overview',
        description: 'The automotive sector includes a wide range of companies and organizations involved in research, development, manufacturing, and sales of automobiles.',
        ctaText: 'Explore',
    },
    {
        id: '3',
        title: 'Key Market Segments',
        description: 'The industry is divided into passenger vehicles, commercial vehicles, two-wheelers, and specialty vehicles. Each segment has unique characteristics and market dynamics.',
        ctaText: 'View Details',
    },
    {
        id: '4',
        title: 'Career Opportunities',
        description: 'The automotive industry offers diverse career paths including engineering, manufacturing, sales, marketing, and emerging roles in electric vehicles and autonomous driving.',
        ctaText: 'Discover Careers',
    },
    {
        id: '5',
        title: 'Future Trends',
        description: 'The industry is rapidly evolving with electric vehicles, autonomous driving, connected cars, and sustainable manufacturing practices shaping the future.',
        ctaText: 'See Trends',
    },
    {
        id: '6',
        title: 'Global Impact',
        description: 'The automotive industry is a major contributor to global GDP, employment, and technological innovation, with significant environmental and economic implications.',
        ctaText: 'Read More',
    },
];

/**
 * AutomotiveAwarenessSection Component
 * Root wrapper component for the Automotive Awareness screen
 * Handles layout spacing ONLY - NO business logic
 */
const AutomotiveAwarenessSection: React.FC<AutomotiveAwarenessSectionProps> = ({
    title = 'Automotive Industry Awareness',
    subtitle = 'Discover the fundamentals of the automotive industry, its key players, and the opportunities it offers for your career growth.',
    items = defaultAwarenessItems,
    breadcrumbItems = ['Your Learning Journey', 'Different Players in Automotive Industry', 'Automotive Awareness'],
    onProfilePress,
    onLogoPress,
    onItemClick,
    showCTA = true,
}) => {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header
                onProfilePress={onProfilePress || (() => {})}
                onLogoPress={onLogoPress}
            />

            {/* Breadcrumb Bar */}
            <BreadcrumbBar items={breadcrumbItems} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <AutomotiveAwarenessHeader
                    title={title}
                    subtitle={subtitle}
                />

                {/* Content Grid */}
                <AutomotiveAwarenessContent
                    items={items}
                    onItemClick={onItemClick}
                    showCTA={showCTA}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBgGrey,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 32,
        gap: 24,
    },
});

export default AutomotiveAwarenessSection;






