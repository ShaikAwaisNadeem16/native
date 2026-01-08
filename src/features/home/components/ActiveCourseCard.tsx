import React from 'react';
import LearningJourneyCard, { LearningJourneyCardProps } from './LearningJourneyCard';

export interface ActiveCourseCardProps extends Omit<LearningJourneyCardProps, 'type'> {}

/**
 * ActiveCourseCard
 * Wrapper around LearningJourneyCard for ACTIVE / UNLOCKED courses.
 * Uses the "inProgress" visual variant from the Figma-aligned base card.
 */
const ActiveCourseCard: React.FC<ActiveCourseCardProps> = (props) => {
    return (
        <LearningJourneyCard
            type="inProgress"
            {...props}
        />
    );
};

export default ActiveCourseCard;



