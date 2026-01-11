import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';
import DeleteIcon from '../../../components/common/DeleteIcon';
import EditPencilIcon from '../../../components/common/EditPencilIcon';

/**
 * CertificateCard Component
 * Displays certificate details with Edit and Delete action buttons.
 *
 * IMPORTANT: Edit/Delete actions are bound ONLY to their respective buttons.
 * The container is a non-pressable View - clicking anywhere except the
 * Edit/Delete buttons will do NOTHING. This is intentional behavior.
 *
 * Props:
 * - certificateName: Certificate name/title
 * - issuingOrganization: Issuing organization
 * - issueDate: Issue date or completion date
 * - onEditPress: Callback ONLY for Edit button press
 * - onDeletePress: Callback ONLY for Delete button press
 */

interface CertificateCardProps {
    certificateName: string;
    issuingOrganization?: string;
    issueDate?: string;
    onEditPress?: () => void;
    onDeletePress?: () => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({
    certificateName,
    issuingOrganization,
    issueDate,
    onEditPress,
    onDeletePress,
}) => {
    // Format subtitle: "Issuing Organization • Issue Date"
    const subtitle = [issuingOrganization, issueDate]
        .filter(Boolean)
        .join(' • ');

    return (
        // Container is a non-pressable View - clicking it does NOTHING
        // Only the Edit/Delete buttons trigger their respective actions
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{certificateName || ''}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
                <View style={styles.actionsContainer}>
                    {/* Edit Button - ONLY this button triggers onEditPress */}
                    {onEditPress && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={onEditPress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.iconBg}>
                                <View style={styles.iconBgImage} />
                            </View>
                            <View style={styles.iconWrapper}>
                                <EditPencilIcon size={24} />
                            </View>
                        </TouchableOpacity>
                    )}
                    {/* Delete Button - ONLY this button triggers onDeletePress */}
                    {onDeletePress && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={onDeletePress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.iconBg}>
                                <View style={styles.iconBgImage} />
                            </View>
                            <View style={styles.iconWrapper}>
                                <DeleteIcon size={24} />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.tableHeaderBlue, // #e6f3ff from Figma
        borderRadius: borderRadius.input,
        padding: 16,
        width: '100%',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        width: '100%',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
    },
    title: {
        ...typography.s2SemiBold,
        color: colors.primaryDarkBlue,
        lineHeight: 13,
    },
    subtitle: {
        ...typography.p4,
        color: colors.textGrey,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    iconButton: {
        width: 32,
        height: 32,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBg: {
        position: 'absolute',
        width: 32,
        height: 32,
        top: 0,
        left: 0,
    },
    iconBgImage: {
        width: '100%',
        height: '100%',
    },
    iconWrapper: {
        position: 'absolute',
        width: 24,
        height: 24,
        top: 4,
        left: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CertificateCard;



