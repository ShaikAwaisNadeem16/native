import React from 'react';
import ConfirmationModal from '../../../components/common/ConfirmationModal';

/**
 * SubmitTestConfirmationModal Component
 *
 * A reusable confirmation modal shown when user clicks "Submit Test"
 * and there are unanswered or review-marked questions.
 * Matches Figma design: node 7875-74422
 * Uses unified ConfirmationModal component.
 *
 * Usage:
 * ```tsx
 * <SubmitTestConfirmationModal
 *   visible={showConfirmation}
 *   unansweredCount={5}
 *   reviewMarkedCount={2}
 *   onConfirm={handleConfirmSubmit}
 *   onCancel={handleReturnToAttempt}
 * />
 * ```
 */
export interface SubmitTestConfirmationModalProps {
    visible: boolean;
    unansweredCount: number;
    reviewMarkedCount: number;
    onConfirm: () => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const SubmitTestConfirmationModal: React.FC<SubmitTestConfirmationModalProps> = ({
    visible,
    unansweredCount,
    reviewMarkedCount,
    onConfirm,
    onCancel,
    isSubmitting = false,
}) => {
    const warningItems = [
        ...(unansweredCount > 0 ? [{ label: 'Unanswered Questions:', value: unansweredCount }] : []),
        ...(reviewMarkedCount > 0 ? [{ label: 'Questions Marked For Review:', value: reviewMarkedCount }] : []),
    ];

    return (
        <ConfirmationModal
            visible={visible}
            title="Submit All Answers?"
            description="You have unanswered questions or questions marked for review. Are you sure you want to submit the test?"
            variant="warning"
            warningItems={warningItems}
            primaryButtonLabel="Submit Test"
            secondaryButtonLabel="Return To Attempt"
            onConfirm={onConfirm}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            buttonLayout="row"
        />
    );
};

export default SubmitTestConfirmationModal;

