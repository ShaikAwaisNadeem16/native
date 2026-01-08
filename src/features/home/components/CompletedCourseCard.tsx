import React from 'react';
import LearningJourneyCard, { LearningJourneyCardProps } from './LearningJourneyCard';

export interface CompletedCourseCardProps extends Omit<LearningJourneyCardProps, 'type' | 'progressPercentage' | 'completedModules' | 'totalModules'> {}

/**
 * CompletedCourseCard
 * Wrapper around LearningJourneyCard for COMPLETED courses.
 * Uses the "completed" visual variant from the Figma-aligned base card.
 */
const CompletedCourseCard: React.FC<CompletedCourseCardProps> = (props) => {
    return (
        <LearningJourneyCard
            type="completed"
            {...props}
        />
    );
};

export default CompletedCourseCard;



