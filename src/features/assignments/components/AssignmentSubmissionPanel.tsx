import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Upload, FileText, X, AlertCircle, Check, Download } from 'lucide-react-native';
import { getDocumentAsync, DocumentPickerResult } from 'expo-document-picker';
import { colors, typography, borderRadius } from '../../../styles/theme';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';
import SecondaryButton from '../../../components/SignUp/SecondaryButton';
import SubmitAssignmentConfirmationModal from './SubmitAssignmentConfirmationModal';

/**
 * AssignmentSubmissionPanel Component
 *
 * Renders the assignment submission panel exactly as per Figma design (node 8217-85764).
 * Includes instructions, assignment brief, text area, file upload, and action buttons.
 *
 * Usage:
 * - Render ONLY after successful API response from POST /api/lms/v1/attempt/assignment
 * - Text area character counter updates live
 * - File upload accepts only specified formats
 *
 * Data Binding:
 * - assign_data.instructions → instructions prop
 * - assign_data.brief → brief prop
 * - assign_data.maxCharacters → maxCharacters prop
 * - assign_data.allowedFileTypes → allowedFileTypes prop
 * - assign_data.maxFileSize → maxFileSize prop
 * - attempt.status → controls button states
 * - attempt.is_draft → indicates if submission is a draft
 * - attempt.submissionText → initial submission text (for drafts)
 * - attempt.uploadedFileName → initial uploaded file name (for drafts)
 */
export interface AssignmentSubmissionPanelProps {
    instructions?: string; // From assign_data.instructions
    brief: string; // From assign_data.brief - Assignment Brief content
    maxCharacters?: number; // From assign_data.maxCharacters (default: 5000)
    allowedFileTypes?: string[]; // From assign_data.allowedFileTypes (default: ['.pdf', '.doc', '.docx'])
    maxFileSize?: number; // From assign_data.maxFileSize in MB (default: 10)
    initialText?: string; // From attempt.submissionText (for drafts)
    initialFileName?: string; // From attempt.uploadedFileName or attempt.file (for drafts)
    fileStatus?: 'none' | 'uploaded' | 'pending' | 'not uploaded'; // From attempt.fileStatus
    fileIds?: string[]; // From attempt.fileIds
    isDraft?: boolean; // From attempt.is_draft
    isSubmitted?: boolean; // From attempt.status === 'submitted'
    isEvaluated?: boolean; // From attempt.evaluated
    isDeadlineExceeded?: boolean; // Whether deadline has been exceeded
    onSaveDraft: (text: string, fileName?: string) => Promise<void>;
    onSubmit: (text: string, fileName?: string) => Promise<void>;
}

const AssignmentSubmissionPanel: React.FC<AssignmentSubmissionPanelProps> = ({
    instructions,
    brief,
    maxCharacters = 5000,
    allowedFileTypes = ['.pdf', '.doc', '.docx'],
    maxFileSize = 10,
    initialText = '',
    initialFileName,
    fileStatus,
    fileIds = [],
    isDraft = false,
    isSubmitted = false,
    isEvaluated = false,
    isDeadlineExceeded = false,
    onSaveDraft,
    onSubmit,
}) => {
    const [submissionText, setSubmissionText] = useState(initialText);
    const [selectedFile, setSelectedFile] = useState<{ name: string; uri: string } | null>(
        initialFileName ? { name: initialFileName, uri: '' } : null
    );
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    // Determine if file is uploaded based on API response
    const isFileUploaded = fileStatus === 'uploaded' || (fileIds && fileIds.length > 0);

    // Determine if we're in Edit Draft state
    // Render Edit Draft UI ONLY when: fileStatus === "uploaded" AND is_draft === true AND assignment is NOT yet submitted
    const isEditDraftState = isDraft && isFileUploaded && !isSubmitted && !isEvaluated;

    // Update selectedFile when fileStatus or fileIds change
    useEffect(() => {
        if (isFileUploaded && initialFileName) {
            setSelectedFile({ name: initialFileName, uri: '' });
        } else if (!isFileUploaded && !initialFileName) {
            setSelectedFile(null);
        }
    }, [isFileUploaded, initialFileName]);

    // Character count
    const characterCount = submissionText.length;
    const isOverLimit = characterCount > maxCharacters;

    // Disable editing if already submitted or deadline exceeded
    const isEditable = !isSubmitted && !isEvaluated && !isDeadlineExceeded;

    // Format allowed file types for display
    const allowedTypesDisplay = allowedFileTypes.map(type => type.toUpperCase().replace('.', '')).join(', ');

    // Handle text change
    const handleTextChange = useCallback((text: string) => {
        if (isEditable) {
            setSubmissionText(text);
            setError(null);
        }
    }, [isEditable]);

    // Handle file selection
    const handleFileSelect = useCallback(async () => {
        if (!isEditable) return;

        try {
            setError(null);
            const result: DocumentPickerResult = await getDocumentAsync({
                type: [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];

                // Check file size (convert bytes to MB)
                const fileSizeMB = (file.size || 0) / (1024 * 1024);
                if (fileSizeMB > maxFileSize) {
                    setError(`File size exceeds ${maxFileSize}MB limit`);
                    return;
                }

                setSelectedFile({ name: file.name, uri: file.uri });
            }
        } catch (err) {
            console.error('[AssignmentSubmissionPanel] File selection error:', err);
            setError('Failed to select file. Please try again.');
        }
    }, [isEditable, maxFileSize]);

    // Handle file removal
    const handleFileRemove = useCallback(() => {
        if (isEditable) {
            setSelectedFile(null);
        }
    }, [isEditable]);

    // Handle save draft
    const handleSaveDraft = useCallback(async () => {
        if (!isEditable || isSaving || isSubmitting) return;

        try {
            setIsSaving(true);
            setError(null);
            await onSaveDraft(submissionText, selectedFile?.name);
        } catch (err: any) {
            setError(err?.message || 'Failed to save draft');
        } finally {
            setIsSaving(false);
        }
    }, [isEditable, isSaving, isSubmitting, onSaveDraft, submissionText, selectedFile]);

    // Handle submit button click - show confirmation modal
    const handleSubmitClick = useCallback(() => {
        if (!isEditable || isSaving || isSubmitting) return;

        // Validate submission
        if (!submissionText.trim() && !selectedFile) {
            setError('Please enter your submission text or upload a file');
            return;
        }

        if (isOverLimit) {
            setError(`Submission exceeds ${maxCharacters} character limit`);
            return;
        }

        // Show confirmation modal
        setShowConfirmationModal(true);
    }, [isEditable, isSaving, isSubmitting, submissionText, selectedFile, isOverLimit, maxCharacters]);

    // Handle confirmed submit
    const handleConfirmSubmit = useCallback(async () => {
        try {
            setIsSubmitting(true);
            setError(null);
            await onSubmit(submissionText, selectedFile?.name);
            // Close modal after successful submission
            setShowConfirmationModal(false);
        } catch (err: any) {
            setError(err?.message || 'Failed to submit assignment');
            // Keep modal open on error so user can retry
        } finally {
            setIsSubmitting(false);
        }
    }, [onSubmit, submissionText, selectedFile]);

    // Handle cancel confirmation
    const handleCancelConfirmation = useCallback(() => {
        setShowConfirmationModal(false);
    }, []);

    return (
        <View style={styles.container}>
            {/* Instructions Section */}
            {instructions && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    <Text style={styles.sectionContent}>{instructions}</Text>
                </View>
            )}

            {/* Divider */}
            {instructions && <View style={styles.divider} />}

            {/* Assignment Brief Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Assignment Brief</Text>
                <Text style={styles.sectionContent}>{brief}</Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* My Submission Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>My Submission</Text>

                {/* Summary - Show as read-only text in Edit Draft state, otherwise show TextInput */}
                {isEditDraftState ? (
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryLabel}>Summary</Text>
                        <View style={styles.summaryTextContainer}>
                            <Text style={styles.summaryText}>
                                {submissionText || 'No summary provided'}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <>
                        {/* Text Area */}
                        <View style={[
                            styles.textAreaContainer,
                            !isEditable && styles.textAreaDisabled,
                            isOverLimit && styles.textAreaError,
                        ]}>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Type your submission here..."
                                placeholderTextColor={colors.placeholderGrey}
                                value={submissionText}
                                onChangeText={handleTextChange}
                                multiline
                                numberOfLines={8}
                                textAlignVertical="top"
                                editable={isEditable}
                            />
                        </View>

                        {/* Character Counter */}
                        <View style={styles.characterCounterContainer}>
                            <Text style={[
                                styles.characterCounter,
                                isOverLimit && styles.characterCounterError,
                            ]}>
                                {characterCount}/{maxCharacters} characters
                            </Text>
                        </View>
                    </>
                )}
            </View>

            {/* File Upload Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    {isEditDraftState ? 'Your File' : 'Submit Your File*'}
                </Text>
                
                {/* File Upload Area - Show Edit Draft state OR uploaded state */}
                {isEditDraftState && selectedFile ? (
                    <View style={styles.editDraftFileContainer}>
                        <View style={styles.editDraftFileRow}>
                            <TouchableOpacity
                                style={styles.editDraftFileLink}
                                onPress={() => {
                                    // Handle file download/view action
                                    console.log('[AssignmentSubmissionPanel] File link pressed:', selectedFile.name);
                                }}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.editDraftFileLinkText}>{selectedFile.name}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.editDraftDownloadIcon}
                                onPress={() => {
                                    // Handle file download action
                                    console.log('[AssignmentSubmissionPanel] Download icon pressed:', selectedFile.name);
                                }}
                                activeOpacity={0.7}
                            >
                                <Download size={24} color={colors.primaryBlue} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : isFileUploaded && selectedFile ? (
                    <View style={styles.uploadedFileContainer}>
                        <TouchableOpacity
                            style={styles.uploadedFileRow}
                            onPress={isEditable ? handleFileSelect : undefined}
                            disabled={!isEditable}
                            activeOpacity={isEditable ? 0.7 : 1}
                        >
                            <View style={styles.uploadedFileInputContainer}>
                                <View style={styles.uploadedFileInput}>
                                    <View style={styles.uploadedFileIconContainer}>
                                        <Check size={24} color={colors.successGreen || '#27AE60'} />
                                    </View>
                                    <View style={styles.uploadedFileTextContainer}>
                                        <Text style={styles.uploadedFileText} numberOfLines={1}>
                                            {selectedFile.name}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            {isEditable && (
                                <TouchableOpacity
                                    style={styles.replaceFileButton}
                                    onPress={handleFileSelect}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.replaceFileText}>Replace File</Text>
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
                        <View style={styles.fileInfoRow}>
                            <Text style={styles.fileInfoText}>Maximum file size: {maxFileSize}MB</Text>
                            <View style={styles.fileInfoSeparator} />
                            <Text style={styles.fileInfoText}>File Types: {allowedTypesDisplay}</Text>
                        </View>
                    </View>
                ) : (
                    <>
                        <TouchableOpacity
                            style={[styles.uploadArea, !isEditable && styles.uploadAreaDisabled]}
                            onPress={handleFileSelect}
                            disabled={!isEditable}
                            activeOpacity={0.7}
                        >
                            <Upload size={32} color={colors.primaryBlue} />
                            <Text style={styles.uploadText}>Click to upload file</Text>
                            <Text style={styles.uploadSubtext}>or drag and drop</Text>
                        </TouchableOpacity>
                        <View style={styles.fileInfoRow}>
                            <Text style={styles.fileInfoText}>Maximum file size: {maxFileSize}MB</Text>
                            <View style={styles.fileInfoSeparator} />
                            <Text style={styles.fileInfoText}>File Types: {allowedTypesDisplay}</Text>
                        </View>
                    </>
                )}
            </View>

            {/* Error Message */}
            {error && (
                <View style={styles.errorContainer}>
                    <AlertCircle size={16} color={colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {/* Action Buttons */}
            {isEditable && (
                <View style={styles.buttonsContainer}>
                    {/* Edit Draft / Save Draft Button */}
                    {isEditDraftState ? (
                        <SecondaryButton
                            label={isSaving ? 'Saving...' : 'Edit Draft'}
                            onPress={handleSaveDraft}
                            disabled={isSaving || isSubmitting}
                        />
                    ) : (
                        <SecondaryButton
                            label={isSaving ? 'Saving...' : 'Save Draft'}
                            onPress={handleSaveDraft}
                            disabled={isSaving || isSubmitting}
                        />
                    )}

                    {/* Submit Assignment Button */}
                    <PrimaryButton
                        label={isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                        onPress={handleSubmitClick}
                        disabled={isSaving || isSubmitting || (isOverLimit && !isEditDraftState)}
                    />
                </View>
            )}

            {/* Submitted State Message */}
            {isSubmitted && (
                <View style={styles.submittedContainer}>
                    <Text style={styles.submittedText}>
                        {isEvaluated ? 'Assignment has been evaluated' : 'Assignment submitted successfully'}
                    </Text>
                </View>
            )}

            {/* Submit Assignment Confirmation Modal */}
            <SubmitAssignmentConfirmationModal
                visible={showConfirmationModal}
                onConfirm={handleConfirmSubmit}
                onCancel={handleCancelConfirmation}
                isSubmitting={isSubmitting}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.card, // 12px from Figma
        padding: 24, // 24px padding from Figma
        flexDirection: 'column',
        gap: 24, // 24px gap between sections from Figma
        width: '100%',
    },
    section: {
        flexDirection: 'column',
        gap: 12, // 12px gap between title and content from Figma
        width: '100%',
    },
    sectionTitle: {
        ...typography.p3Bold, // Inter Bold, 16px, line-height 23px from Figma
        color: colors.primaryDarkBlue, // #00213d from Figma
    },
    sectionContent: {
        ...typography.p4, // Inter Regular, 14px, line-height 20px from Figma
        color: colors.textGrey, // #696a6f from Figma
    },
    divider: {
        height: 1, // 1px divider from Figma
        width: '100%',
        backgroundColor: colors.lightGrey, // #e2ebf3 from Figma
    },
    textAreaContainer: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey, // #e2ebf3 from Figma
        borderRadius: borderRadius.input, // 8px from Figma
        padding: 16, // 16px padding from Figma
        minHeight: 200, // Minimum height for text area from Figma
    },
    textAreaDisabled: {
        backgroundColor: '#f5f5f5',
    },
    textAreaError: {
        borderColor: colors.error, // Red border for error
    },
    textArea: {
        ...typography.p4, // Inter Regular, 14px from Figma
        color: colors.textGrey, // #696a6f from Figma
        minHeight: 168, // Allow space for content
        textAlignVertical: 'top',
    },
    characterCounterContainer: {
        alignItems: 'flex-end',
        width: '100%',
    },
    characterCounter: {
        ...typography.s1Regular, // Inter Regular, 12px from Figma
        color: colors.textGrey, // #696a6f from Figma
    },
    characterCounterError: {
        color: colors.error, // Red when over limit
    },
    fileHint: {
        ...typography.s1Regular, // Inter Regular, 12px from Figma
        color: colors.textGrey, // #696a6f from Figma
    },
    uploadedFileContainer: {
        flexDirection: 'column',
        gap: 8, // 8px gap between elements from Figma
        width: '100%',
    },
    uploadedFileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12, // 12px gap between upload button and replace button from Figma
        width: '100%',
    },
    uploadedFileInputContainer: {
        flex: 1,
    },
    uploadedFileInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primaryBlue, // #0b6aea from Figma
        borderRadius: borderRadius.input, // 8px from Figma
        paddingHorizontal: 20, // 20px horizontal padding from Figma
        paddingVertical: 12, // 12px vertical padding from Figma
        height: 48, // 48px height from Figma
    },
    uploadedFileIconContainer: {
        marginRight: 16, // 16px gap between icon and text from Figma
    },
    uploadedFileTextContainer: {
        flex: 1,
    },
    uploadedFileText: {
        ...typography.p4, // Inter Regular, 14px from Figma
        color: colors.primaryBlue, // #0b6aea from Figma
    },
    replaceFileButton: {
        paddingVertical: 4, // 4px vertical padding from Figma
    },
    replaceFileText: {
        ...typography.p4SemiBold, // Inter SemiBold, 14px from Figma
        color: colors.primaryBlue, // #0b6aea from Figma
        textDecorationLine: 'underline',
    },
    fileInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // 8px gap between elements from Figma
    },
    fileInfoText: {
        ...typography.s1Regular, // Inter Regular, 12px from Figma
        color: colors.placeholderGrey || '#80919f', // #80919f from Figma
    },
    fileInfoSeparator: {
        width: 1,
        height: 16, // 16px height for separator from Figma
        backgroundColor: colors.placeholderGrey || '#80919f', // #80919f from Figma
        marginHorizontal: 4, // 4px margin from Figma
    },
    uploadArea: {
        borderWidth: 2,
        borderColor: colors.lightGrey, // #e2ebf3 from Figma
        borderStyle: 'dashed',
        borderRadius: borderRadius.input, // 8px from Figma
        padding: 32, // 32px padding from Figma
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8, // 8px gap between elements from Figma
        backgroundColor: colors.highlightBlue || '#f2f7fe', // Light blue background from Figma
    },
    uploadAreaDisabled: {
        opacity: 0.5,
    },
    uploadText: {
        ...typography.p4SemiBold, // Inter SemiBold, 14px from Figma
        color: colors.primaryBlue, // #0b6aea from Figma
    },
    uploadSubtext: {
        ...typography.s1Regular, // Inter Regular, 12px from Figma
        color: colors.textGrey, // #696a6f from Figma
    },
    selectedFileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.highlightBlue || '#f2f7fe', // Light blue background from Figma
        borderRadius: borderRadius.input, // 8px from Figma
        padding: 16, // 16px padding from Figma
    },
    selectedFileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12, // 12px gap between icon and name from Figma
        flex: 1,
    },
    selectedFileName: {
        ...typography.p4, // Inter Regular, 14px from Figma
        color: colors.primaryDarkBlue, // #00213d from Figma
        flex: 1,
    },
    removeFileButton: {
        padding: 8,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // 8px gap between icon and text from Figma
        backgroundColor: 'rgba(235, 87, 87, 0.1)', // Light red background
        padding: 12,
        borderRadius: borderRadius.input, // 8px from Figma
    },
    errorText: {
        ...typography.s1Regular, // Inter Regular, 12px from Figma
        color: colors.error, // Red from Figma
        flex: 1,
    },
    buttonsContainer: {
        flexDirection: 'column',
        gap: 16, // 16px gap between buttons from Figma
        width: '100%',
    },
    submittedContainer: {
        backgroundColor: 'rgba(39, 174, 96, 0.1)', // Light green background
        padding: 16,
        borderRadius: borderRadius.input, // 8px from Figma
        alignItems: 'center',
    },
    submittedText: {
        ...typography.p4SemiBold, // Inter SemiBold, 14px from Figma
        color: colors.successGreen || '#27ae60', // Green from Figma
    },
    summaryContainer: {
        flexDirection: 'column',
        gap: 4, // 4px gap between label and text from Figma
        width: '100%',
    },
    summaryLabel: {
        ...typography.s2SemiBold, // Inter SemiBold, 12px from Figma
        color: colors.primaryDarkBlue, // #00213d from Figma
    },
    summaryTextContainer: {
        flexDirection: 'row',
        gap: 8, // 8px gap from Figma
        alignItems: 'center',
        width: '100%',
    },
    summaryText: {
        flex: 1,
        ...typography.p4, // Inter Regular, 14px from Figma
        color: colors.textGrey, // #696a6f from Figma
    },
    editDraftFileContainer: {
        flexDirection: 'column',
        gap: 4, // 4px gap between label and file row from Figma
        width: '100%',
    },
    editDraftFileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16, // 16px gap between file link and download icon from Figma
    },
    editDraftFileLink: {
        flex: 1,
    },
    editDraftFileLinkText: {
        ...typography.p4, // Inter Regular, 14px from Figma
        color: colors.primaryBlue, // #0b6aea from Figma
        textDecorationLine: 'underline',
    },
    editDraftDownloadIcon: {
        width: 32, // 32px size from Figma
        height: 32,
        borderRadius: 19.2, // 19.2px border radius from Figma
        backgroundColor: colors.lightGrey, // #e2ebf3 from Figma
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AssignmentSubmissionPanel;
