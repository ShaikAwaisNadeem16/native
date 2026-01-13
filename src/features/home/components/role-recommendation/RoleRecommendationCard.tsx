import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { colors, typography, borderRadius, shadows } from '../../../../styles/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH; // Full screen width for cards (360px in Figma)
import MatchPercentageBadge from './MatchPercentageBadge';
import SkillChip from './SkillChip';
import LearnMoreCTA from './LearnMoreCTA';

export interface RoleRecommendationCardProps {
    roleIcon?: string | number;
    matchPercentage: number;
    roleTitle: string;
    roleDescription: string;
    skills: string[];
    onLearnMorePress: () => void;
}

/**
 * RoleRecommendationCard - Reusable role recommendation card component
 * Matches Figma design: node 12085:61766
 */
const RoleRecommendationCard: React.FC<RoleRecommendationCardProps> = ({
    roleIcon,
    matchPercentage,
    roleTitle,
    roleDescription,
    skills,
    onLearnMorePress,
}) => {
    return (
        <View style={styles.container}>
            {/* Header Section: Icon + Match Badge, then Title + Description */}
            <View style={styles.headerSection}>
                {/* Icon + Match Badge Row */}
                <View style={styles.header}>
                    {roleIcon && (
                        <View style={styles.iconContainer}>
                            <Image
                                source={typeof roleIcon === 'string' ? { uri: roleIcon } : roleIcon}
                                style={styles.icon}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                    <MatchPercentageBadge 
                        percentage={matchPercentage} 
                        variant={matchPercentage >= 90 ? 'high' : 'medium'}
                    />
                </View>

                {/* Title and Description - 24px gap from header */}
                <View style={styles.content}>
                    <Text style={styles.title}>{roleTitle}</Text>
                    <Text style={styles.description}>{roleDescription}</Text>
                </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Skills Section + CTA */}
            <View style={styles.skillsCTASection}>
                {/* Skills Section */}
                <View style={styles.skillsSection}>
                    <Text style={styles.skillsLabel}>Skills Required</Text>
                    <View style={styles.skillsContainer}>
                        {skills.map((skill, index) => (
                            <SkillChip
                                key={index}
                                skill={skill}
                                variant={index < 2 ? 'default' : 'highlighted'}
                            />
                        ))}
                    </View>
                </View>

                {/* CTA - 32px gap from skills section */}
                <LearnMoreCTA onPress={onLearnMorePress} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.card, // 12px
        paddingHorizontal: 16, // Exact Figma padding
        paddingVertical: 27, // Exact Figma padding
        width: CARD_WIDTH, // 360px full screen width
        alignSelf: 'stretch',
        flexShrink: 0,
        ...shadows.activeElement, // 0px 8px 40px rgba(9,44,76,0.08)
    },
    headerSection: {
        flexDirection: 'column',
        gap: 24, // 24px gap between header row and title/description
        width: '100%',
        marginBottom: 25, // 25px gap before divider
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    iconContainer: {
        width: 64, // Exact Figma size
        height: 64, // Exact Figma size
        borderRadius: 32,
        overflow: 'hidden',
    },
    icon: {
        width: '100%',
        height: '100%',
    },
    content: {
        flexDirection: 'column',
        gap: 4, // 4px gap between title and description
        width: '100%',
    },
    title: {
        ...typography.p2Bold, // 18px Bold, line-height 25px
        color: colors.primaryDarkBlue,
    },
    description: {
        ...typography.p4, // 14px Regular, line-height 20px
        color: colors.textGrey,
    },
    divider: {
        height: 1,
        backgroundColor: colors.lightGrey,
        width: '100%',
        marginBottom: 25, // 25px gap after divider
    },
    skillsCTASection: {
        flexDirection: 'column',
        gap: 32, // 32px gap between skills section and CTA
        width: '100%',
        alignItems: 'flex-start',
    },
    skillsSection: {
        flexDirection: 'column',
        gap: 17, // 17px gap between label and chips
        width: '100%',
    },
    skillsLabel: {
        ...typography.s2SemiBold, // 12px SemiBold, line-height 13px
        color: '#000', // Black text from Figma (text-black)
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8, // 8px horizontal gap
        rowGap: 12, // 12px vertical gap
    },
});

export default RoleRecommendationCard;

