import React from 'react';
import HeaderCard from '../../../components/common/HeaderCard';

/**
 * AssignmentHeaderCard Component
 * 
 * Renders the assignment header card exactly as per Figma design (node 8217-85452).
 * This is the top card with blue background showing assignment icon, title, description, and duration.
 * Uses unified HeaderCard component.
 * 
 * Data Binding:
 * - assign_data.title → title prop
 * - assign_data.description → description prop
 * - assign_data.duration → duration prop
 * - assign_data.iconUrl → iconUrl prop (if available)
 */
export interface AssignmentHeaderCardProps {
    iconUrl?: string | number; // Assignment icon
    title: string; // From assign_data.title
    description: string; // From assign_data.description
    duration: string; // From assign_data.duration (e.g., "7 days")
}

const AssignmentHeaderCard: React.FC<AssignmentHeaderCardProps> = ({
    iconUrl,
    title,
    description,
    duration,
}) => {
    return (
        <HeaderCard
            variant="assignment"
            iconUrl={iconUrl}
            shortName="ASSIGNMENT"
            title={title}
            description={description}
            duration={duration}
            showIcon={!!iconUrl}
        />
    );
};

export default AssignmentHeaderCard;

