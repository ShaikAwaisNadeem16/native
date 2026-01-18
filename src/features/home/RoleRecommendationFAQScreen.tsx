import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography } from '../../styles/theme';
import Header from './components/Header';
import BreadcrumbBar from '../assessments/components/BreadcrumbBar';
import { HomeService } from '../../api/home';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { CardSkeleton } from '../../components/common/SkeletonLoaders';
// Using simple text indicators for expand/collapse since lucide-react-native may not have these icons
// Alternative: Use unicode arrows or custom SVG

type NavigationProp = StackNavigationProp<RootStackParamList, 'RoleRecommendationFAQ'>;

interface FAQ {
    id: number;
    tag: string;
    page: string;
    question: string;
    answer: string;
}

const RoleRecommendationFAQScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedFAQs, setExpandedFAQs] = useState<Set<number>>(new Set());

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('[RoleRecommendationFAQ] Fetching FAQs...');
            const response = await HomeService.getRoleRecommendationFAQs();

            if (Array.isArray(response)) {
                console.log('[RoleRecommendationFAQ] FAQs received:', response.length);
                setFaqs(response);
            } else {
                console.warn('[RoleRecommendationFAQ] Response is not an array:', response);
                setFaqs([]);
            }
        } catch (err: any) {
            console.error('[RoleRecommendationFAQ] Failed to fetch FAQs:', err);
            setError(err?.message || 'Failed to load FAQs');
        } finally {
            setLoading(false);
        }
    };

    const toggleFAQ = (id: number) => {
        setExpandedFAQs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const handleLogoPress = () => {
        navigation.navigate('Home');
    };

    // Group FAQs by tag
    const groupedFAQs = faqs.reduce((acc, faq) => {
        const tag = faq.tag || 'COMMON';
        if (!acc[tag]) {
            acc[tag] = [];
        }
        acc[tag].push(faq);
        return acc;
    }, {} as Record<string, FAQ[]>);

    const tagOrder = ['ADAS AI/ML', 'OTA', 'DIGITAL COCKPIT CYBERSECURITY', 'WHAT DOES AN AUTOMOTIVE EMBEDDED FIRMWARE  DO?\nA', 'WHAT ARE SOME ENTRY-LEVEL JOB ROLES IN THE AUTOMOTIVE DOMAIN?\nA', 'COMMON', 'A'];
    const sortedTags = Object.keys(groupedFAQs).sort((a, b) => {
        const aIndex = tagOrder.indexOf(a);
        const bIndex = tagOrder.indexOf(b);
        if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
    });

    if (loading || error) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <Header
                    onProfilePress={handleProfilePress}
                    onLogoPress={handleLogoPress}
                />
                <BreadcrumbBar items={['Role Recommendation', 'FAQs']} />
                <View style={styles.content}>
                    <CardSkeleton />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Header
                onProfilePress={handleProfilePress}
                onLogoPress={handleLogoPress}
            />
            <BreadcrumbBar items={['Role Recommendation', 'FAQs']} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerSection}>
                    <Text style={styles.title}>Frequently Asked Questions</Text>
                    <Text style={styles.subtitle}>Get answers to common questions about automotive roles</Text>
                </View>

                {sortedTags.map((tag) => (
                    <View key={tag} style={styles.tagSection}>
                        <Text style={styles.tagTitle}>{tag}</Text>
                        {groupedFAQs[tag].map((faq) => {
                            const isExpanded = expandedFAQs.has(faq.id);
                            return (
                                <View key={faq.id} style={styles.faqItem}>
                                    <TouchableOpacity
                                        style={styles.faqQuestionContainer}
                                        onPress={() => toggleFAQ(faq.id)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.faqQuestion}>{faq.question}</Text>
                                        <Text style={styles.expandIcon}>
                                            {isExpanded ? '▲' : '▼'}
                                        </Text>
                                    </TouchableOpacity>
                                    {isExpanded && (
                                        <View style={styles.faqAnswerContainer}>
                                            <Text style={styles.faqAnswer}>{faq.answer}</Text>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                ))}

                {faqs.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No FAQs available at the moment.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    headerSection: {
        marginBottom: 24,
    },
    title: {
        ...typography.h2,
        color: colors.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
    },
    tagSection: {
        marginBottom: 24,
    },
    tagTitle: {
        ...typography.h3,
        color: colors.primaryBlue,
        marginBottom: 12,
        fontWeight: '600',
    },
    faqItem: {
        marginBottom: 12,
        backgroundColor: colors.white,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    faqQuestionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 16,
    },
    faqQuestion: {
        ...typography.body,
        color: colors.textPrimary,
        flex: 1,
        marginRight: 12,
        fontWeight: '500',
    },
    expandIcon: {
        fontSize: 12,
        color: colors.primaryBlue,
        fontWeight: 'bold',
    },
    faqAnswerContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 12,
    },
    faqAnswer: {
        ...typography.body,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    errorText: {
        ...typography.body,
        color: colors.error,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: colors.primaryBlue,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        ...typography.button,
        color: colors.white,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});

export default RoleRecommendationFAQScreen;

