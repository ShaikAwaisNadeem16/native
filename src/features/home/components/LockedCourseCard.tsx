import React from 'react';
import BaseCard from '../../../components/common/BaseCard';

/**
 * LockedCourseCard Component
 *
 * Renders a locked course card exactly as per Figma design (node 7875-71038).
 * Uses unified BaseCard component.
 *
 * Usage:
 * - Render ONLY when CourseProgress.lockedOrUnlocked === "locked"
 *   AND CourseProgress.courseProgress !== "completed"
 * - Card is NON-CLICKABLE
 * - No CTA buttons shown
 * - Displays "LOCKED" tag
 */
export interface LockedCourseCardProps {
    iconUrl?: string | number; // Course icon from Courses or course data
    subtitle: string; // From Courses.subTitle
    title: string; // From Courses.title
    description: string; // From Courses.description
    level?: string; // From Courses.level (e.g., "Beginner")
    duration?: string; // From Courses.duration (e.g., "3 hours")
}

const LockedCourseCard: React.FC<LockedCourseCardProps> = ({
    iconUrl,
    subtitle,
    title,
    description,
    level,
    duration,
}) => {
    return (
        <BaseCard
            variant="locked"
            iconUrl={iconUrl}
            subtitle={subtitle}
            title={title}
            description={description}
            level={level}
            duration={duration}
            tagText="LOCKED"
            iconPosition="left"
            iconSize={48}
        />
    );
};

export default LockedCourseCard;
