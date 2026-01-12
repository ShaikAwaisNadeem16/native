import React from 'react';
import HeaderCard from '../../../components/common/HeaderCard';

interface AssessmentHeaderCardProps {
    shortName?: string; // "Assessment" or "SURVEY"
    title: string; // "Engineering Assessment"
    description: string;
    duration?: string; // "1 Hour 30 Mins"
    questions?: string; // "60 Questions"
}

/**
 * Blue background header card component matching Figma design
 * Displays assessment icon, shortName, title, description, and metadata
 * Uses unified HeaderCard component
 */
const AssessmentHeaderCard: React.FC<AssessmentHeaderCardProps> = ({
    shortName = 'ASSESSMENT',
    title,
    description,
    duration,
    questions,
}) => {
    return (
        <HeaderCard
            variant="assessment"
            shortName={shortName}
            title={title}
            description={description}
            duration={duration}
            questions={questions}
            showIcon={false}
        />
    );
};

export default AssessmentHeaderCard;

