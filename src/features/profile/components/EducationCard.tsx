import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';
import DeleteIcon from '../../../components/common/DeleteIcon';
import EditPencilIcon from '../../../components/common/EditPencilIcon';

/**
 * EducationCard Component
 * Displays education details with Edit and Delete action buttons.
 *
 * IMPORTANT: Edit/Delete actions are bound ONLY to their respective buttons.
 * The container is a non-pressable View - clicking anywhere except the
 * Edit/Delete buttons will do NOTHING. This is intentional behavior.
 *
 * Props:
 * - title: Education level (e.g., "Class X")
 * - subtitle: Board/Year info (e.g., "Maharashtra Board - 2023")
 * - onEditPress: Callback ONLY for Edit button press
 * - onDeletePress: Callback ONLY for Delete button press
 */

interface EducationCardProps {
    title: string;
    subtitle: string;
    // Callback triggered ONLY when Edit button is pressed (not the container)
    onEditPress?: () => void;
    // Callback triggered ONLY when Delete button is pressed (not the container)
    onDeletePress?: () => void;
}

const EducationCard: React.FC<EducationCardProps> = ({
    title,
    subtitle,
    onEditPress,
    onDeletePress,
}) => {

    return (
        // Container is a non-pressable View - clicking it does NOTHING
        // Only the Edit/Delete buttons trigger their respective actions
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title || ''}</Text>
                    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                </View>
                <View style={styles.actionsContainer}>
                    {/* Edit Button - ONLY this button triggers onEditPress */}
                    {/* Clicking anywhere else on the card does NOTHING */}
                    {onEditPress && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={onEditPress}
                            activeOpacity={0.7}
                        >
                            <EditPencilIcon size={16} color={colors.primaryBlue} />
                        </TouchableOpacity>
                    )}
                    {/* Delete Button - ONLY this button triggers onDeletePress */}
                    {onDeletePress && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={onDeletePress}
                            activeOpacity={0.7}
                        >
                            <DeleteIcon size={16} color={colors.primaryBlue} />
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
        borderRadius: 16,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Removed unused iconBg, iconBgImage, iconWrapper styles
});

export default EducationCard;






