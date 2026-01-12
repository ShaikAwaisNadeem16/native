import React from 'react';
import BaseCard from '../../../components/common/BaseCard';

/**
 * ComingSoonCourseCard Component
 * 
 * Renders a coming soon course card exactly as per Figma design (node 7875-71039).
 * Uses unified BaseCard component.
 * 
 * Usage:
 * - Render ONLY when course is UPCOMING / COMING SOON
 * - Card is NON-CLICKABLE
 * - No CTA buttons shown
 * - Displays "COMING SOON" tag
 */
export interface ComingSoonCourseCardProps {
    iconUrl?: string | number; // Course icon from Courses or course data
    subtitle: string; // From Courses.subTitle
    title: string; // From Courses.title
}

const ComingSoonCourseCard: React.FC<ComingSoonCourseCardProps> = ({
    iconUrl,
    subtitle,
    title,
}) => {
    return (
        <BaseCard
            variant="comingSoon"
            iconUrl={iconUrl}
            subtitle={subtitle}
            title={title}
            tagText="COMING SOON"
            iconPosition="left"
            iconSize={48}
        />
    );
};

export default ComingSoonCourseCard;
