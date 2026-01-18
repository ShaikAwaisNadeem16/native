import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing } from '../../styles/theme';
import Header from './components/Header';
import BreadcrumbBar from '../assessments/components/BreadcrumbBar';
import { HomeService } from '../../api/home';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { RoleRecommendationSkeleton } from './role-skeleton/RoleRecommendationSkeleton';
import StrengthsToggle, { ToggleOption } from './components/role-recommendation/StrengthsToggle';
import RadarChart from './components/role-recommendation/RadarChart';
import StrengthDescription from './components/role-recommendation/StrengthDescription';
import RoleRecommendationCard, { RoleRecommendationCardProps } from './components/role-recommendation/RoleRecommendationCard';
import FAQAccordionItem from './components/role-recommendation/FAQAccordionItem';

type NavigationProp = StackNavigationProp<RootStackParamList, 'RoleRecommendation'>;

interface FAQ {
    id: number;
    tag: string;
    page: string;
    question: string;
    answer: string;
}

interface StrengthData {
    label: string;
    value: number;
    abbreviation: string;
    description: string;
}

interface RoleData {
    id: string;
    icon?: string;
    matchPercentage: number;
    title: string;
    description: string;
    skills: string[];
}

interface RoleRecommendationData {
    strengths?: {
        skills?: StrengthData[];
        knowledge?: StrengthData[];
    };
    roles?: RoleData[];
    faqs?: FAQ[];
}

const RoleRecommendationScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedToggle, setSelectedToggle] = useState<ToggleOption>('Knowledge');
    const [selectedStrength, setSelectedStrength] = useState<string | undefined>('Electronic Systems');
    const [expandedFAQs, setExpandedFAQs] = useState<Set<number>>(new Set([1])); // First FAQ expanded by default
    const [data, setData] = useState<RoleRecommendationData>({});

    useEffect(() => {
        fetchRoleRecommendationData();
    }, []);

    const fetchRoleRecommendationData = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('[RoleRecommendation] Fetching role recommendation data...');
            const response = await HomeService.getRoleRecommendationFAQs();

            // Parse response - API may return FAQs directly or wrapped in an object
            let parsedData: RoleRecommendationData = {};

            if (Array.isArray(response)) {
                // If response is array, it's FAQs only
                parsedData = { faqs: response };
            } else if (typeof response === 'object' && response !== null) {
                // If response is object, it might contain all data
                parsedData = {
                    strengths: response.strengths || {},
                    roles: response.roles || [],
                    faqs: response.faqs || response.data || (Array.isArray(response) ? response : []),
                };
            }

            console.log('[RoleRecommendation] Data received:', JSON.stringify(parsedData, null, 2));
            setData(parsedData);
        } catch (err: any) {
            console.error('[RoleRecommendation] Failed to fetch data:', err);
            setError(err?.message || 'Failed to load role recommendations');
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

    const handleLearnMore = (roleId: string) => {
        // Navigate to role details or enrollment
        console.log('[RoleRecommendation] Learn more pressed for role:', roleId);
        // TODO: Implement navigation to role details/enrollment
    };

    // Get current strengths based on toggle
    const currentStrengths = selectedToggle === 'Skills'
        ? (data.strengths?.skills || [])
        : (data.strengths?.knowledge || []);

    // Default strengths if API doesn't provide them (for demo)
    const defaultStrengths: StrengthData[] = [
        { label: 'Electronic Systems', value: 80, abbreviation: 'ES', description: 'You can design, build, and maintain software applications. You are skilled in coding, debugging, and using development methodologies to create efficient and scalable solutions.' },
        { label: 'Digital Cockpit', value: 55, abbreviation: 'DC', description: 'You can design and manage systems that handle large volumes of data. You are adept at creating data pipelines, ensuring data integrity, and optimising storage solutions for effective data analysis.' },
        { label: 'Data Engineering', value: 10, abbreviation: 'DE', description: 'You have expertise in data processing and analytics.' },
        { label: 'Cybersecurity', value: 42, abbreviation: 'CS', description: 'You understand security principles and can implement secure systems.' },
    ];

    const displayStrengths = currentStrengths.length > 0 ? currentStrengths : defaultStrengths;

    // Default roles if API doesn't provide them
    const defaultRoles: RoleData[] = [
        {
            id: '1',
            matchPercentage: 90,
            title: 'ADAS Engineer',
            description: 'An ADAS (Advanced Driver Assistance Systems) Engineer designs, develops, and tests systems and features that enhance vehicle safety',
            skills: ['Photoshop', 'Illustrator', 'Figma', 'inDesign', 'Sketch', 'Hotjar', 'VWO'],
        },
        {
            id: '2',
            matchPercentage: 80,
            title: 'ADAS Engineer',
            description: 'An ADAS (Advanced Driver Assistance Systems) Engineer designs, develops, and tests systems and features that enhance vehicle safety',
            skills: ['Photoshop', 'Illustrator', 'Figma', 'inDesign', 'Sketch', 'Hotjar', 'VWO'],
        },
        {
            id: '3',
            matchPercentage: 80,
            title: 'ADAS Engineer',
            description: 'An ADAS (Advanced Driver Assistance Systems) Engineer designs, develops, and tests systems and features that enhance vehicle safety',
            skills: ['Photoshop', 'Illustrator', 'Figma', 'inDesign', 'Sketch', 'Hotjar', 'VWO'],
        },
    ];

    const displayRoles = (data.roles && data.roles.length > 0) ? data.roles : defaultRoles;
    const displayFAQs = data.faqs || [];

    if (loading || error) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header
                    onProfilePress={handleProfilePress}
                    onLogoPress={handleLogoPress}
                />
                <BreadcrumbBar items={['Role Recommendation']} />
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    style={styles.scrollView}
                >
                    <RoleRecommendationSkeleton />
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                onProfilePress={handleProfilePress}
                onLogoPress={handleLogoPress}
            />
            <BreadcrumbBar items={['Role Recommendation']} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                {/* Career Strengths Section */}
                <View style={styles.strengthsSection}>
                    {/* Title and Toggle Section */}
                    <View style={styles.titleToggleSection}>
                        <Text style={styles.sectionTitle}>Your Career Strengths</Text>
                        <StrengthsToggle
                            selected={selectedToggle}
                            onToggle={setSelectedToggle}
                        />
                    </View>

                    {/* Chart and Descriptions Section */}
                    <View style={styles.chartDescriptionsSection}>
                        {/* Radar Chart */}
                        <View style={styles.chartContainer}>
                            <RadarChart
                                strengths={displayStrengths}
                                selectedStrength={selectedStrength}
                            />
                        </View>

                        {/* Strength Descriptions */}
                        <View style={styles.strengthDescriptionsContainer}>
                            {displayStrengths.map((strength, index) => (
                                <StrengthDescription
                                    key={index}
                                    title={strength.label}
                                    description={strength.description}
                                />
                            ))}
                        </View>
                    </View>
                </View>

                {/* Most Suited Roles Section */}
                <View style={styles.rolesSection}>
                    <Text style={styles.rolesSectionTitle}>Most Suited Roles For You!</Text>
                    <View style={styles.rolesContainer}>
                        {displayRoles.map((role) => (
                            <RoleRecommendationCard
                                key={role.id}
                                roleIcon={role.icon}
                                matchPercentage={role.matchPercentage}
                                roleTitle={role.title}
                                roleDescription={role.description}
                                skills={role.skills}
                                onLearnMorePress={() => handleLearnMore(role.id)}
                            />
                        ))}
                    </View>
                </View>

                {/* FAQ Section */}
                {displayFAQs.length > 0 && (
                    <View style={styles.faqSection}>
                        <Text style={styles.faqSectionTitle}>Frequently Asked Questions</Text>
                        <View style={styles.faqContainer}>
                            {displayFAQs.map((faq) => (
                                <FAQAccordionItem
                                    key={faq.id}
                                    question={faq.question}
                                    answer={faq.answer}
                                    isExpanded={expandedFAQs.has(faq.id)}
                                    onToggle={() => toggleFAQ(faq.id)}
                                />
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBgGrey,
    },
    content: {
        flex: 1,
        padding: spacing.cardPaddingH,
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        padding: 0,
        paddingBottom: 32,
        width: '100%',
        alignItems: 'center', // Center all sections
    },
    strengthsSection: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 8,
        paddingHorizontal: 16, // Exact Figma padding
        paddingVertical: 24, // Exact Figma padding
        marginTop: 24, // Gap from breadcrumb (132px - 64px header - 44px breadcrumb = 24px)
        marginBottom: spacing.sectionGap, // 48px gap
        marginHorizontal: 0, // No horizontal margin, centered by parent
        width: Dimensions.get('window').width, // Full screen width (360px)
        alignSelf: 'stretch',
        flexShrink: 0,
    },
    titleToggleSection: {
        flexDirection: 'column',
        gap: 16, // 16px gap between title and toggle
        width: '100%',
        marginBottom: 40, // 40px gap before chart section
    },
    sectionTitle: {
        ...typography.p2Bold, // 18px Bold, line-height 25px
        color: colors.primaryDarkBlue,
        width: '100%',
    },
    rolesSectionTitle: {
        ...typography.p2Bold, // 18px Bold, line-height 25px
        color: colors.primaryDarkBlue,
        paddingLeft: 16, // Exact Figma padding-left
        paddingRight: 0,
        paddingVertical: 0,
        width: '100%',
    },
    chartDescriptionsSection: {
        flexDirection: 'column',
        gap: 40, // 40px gap between chart and descriptions
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        alignSelf: 'stretch',
    },
    strengthDescriptionsContainer: {
        flexDirection: 'column',
        gap: 32, // 32px gap between descriptions
        width: '100%',
    },
    rolesSection: {
        flexDirection: 'column',
        gap: 20, // 20px gap between title and cards
        marginBottom: spacing.sectionGap, // 48px gap
        width: Dimensions.get('window').width, // Full screen width (360px)
        alignSelf: 'stretch',
        flexShrink: 0,
        paddingHorizontal: 0,
    },
    rolesContainer: {
        flexDirection: 'column',
        gap: 20, // 20px gap between cards
        width: '100%',
        alignSelf: 'stretch',
        flexShrink: 0,
    },
    roleCardWrapper: {
        width: '100%',
        flexShrink: 0,
    },
    faqSection: {
        flexDirection: 'column',
        gap: 32, // 32px gap between title and FAQ items
        marginBottom: 32,
        width: 328, // Exact Figma width
        alignSelf: 'flex-start', // Align to left
        marginLeft: 16, // Exact Figma left position (left: 16px)
    },
    faqSectionTitle: {
        ...typography.p2Bold, // 18px Bold, line-height 25px
        color: colors.primaryDarkBlue,
        width: '100%',
    },
    faqContainer: {
        flexDirection: 'column',
        gap: 0, // No gap, dividers separate items
        width: '100%',
    },
});

export default RoleRecommendationScreen;

