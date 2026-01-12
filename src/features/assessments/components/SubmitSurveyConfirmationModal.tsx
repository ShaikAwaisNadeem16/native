import React from 'react';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import ErrorNaughtyCat from '../../../components/common/ErrorNaughtyCat';

export interface SubmitSurveyConfirmationModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

/**
 * Submit Survey Confirmation Modal
 * 
 * Modal shown when user clicks "Submit" on the last question.
 * Displays Error Naughty Cat illustration and confirmation message.
 * Matches Figma design: node 10763-62358
 * 
 * Uses unified ConfirmationModal component
 */
const SubmitSurveyConfirmationModal: React.FC<SubmitSurveyConfirmationModalProps> = ({
    visible,
    onConfirm,
    onCancel,
    isSubmitting = false,
}) => {
    return (
        <ConfirmationModal
            visible={visible}
            title="Submit Survey?"
            description="Once submitted you won't be allowed to edit your submission"
            variant="default"
            illustration={
                <ErrorNaughtyCat 
                    width={175.102}
                    height={94}
                />
            }
            primaryButtonLabel="Submit"
            secondaryButtonLabel="Back"
            onConfirm={onConfirm}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            buttonLayout="column"
            contentBorderRadius={12}
            contentPaddingHorizontal={16}
            contentPaddingTop={24}
            contentGap={32}
        />
    );
};

export default SubmitSurveyConfirmationModal;

