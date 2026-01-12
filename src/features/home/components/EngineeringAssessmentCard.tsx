import React from 'react';
import BaseCard, { CardVariant } from '../../../components/common/BaseCard';

interface EngineeringAssessmentCardProps {
    subtitle?: string; // "TEST" label
    title: string; // "Engineering Systems Assessment"
    description: string;
    level?: string; // "Beginner"
    duration?: string; // "3 hours"
    buttonLabel?: string; // "Test Details"
    onButtonPress?: () => void;
}

/**
 * EngineeringAssessmentCard - Wrapper around BaseCard for assessment cards
 * Maintains existing API while using unified BaseCard component
 */
const EngineeringAssessmentCard: React.FC<EngineeringAssessmentCardProps> = ({
    subtitle = 'TEST',
    title = '',
    description = '',
    level = 'Beginner',
    duration = '3 hours',
    buttonLabel = 'Start Assessment',
    onButtonPress,
}) => {
    // Ensure component always renders with valid data
    const displayTitle = title || 'Assessment';
    const displayDescription = description || 'Complete this assessment to progress in your learning journey.';
    
    return (
        <BaseCard
            variant="assessment"
            subtitle={subtitle}
            title={displayTitle}
            description={displayDescription}
            level={level}
            duration={duration}
            primaryButtonLabel={buttonLabel}
            onPrimaryButtonPress={onButtonPress}
            useAssessmentLogo={true}
            iconPosition="top"
        />
    );
};

export default EngineeringAssessmentCard;

