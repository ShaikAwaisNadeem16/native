import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../../styles/theme';
import CrossIcon from '../../../components/common/CrossIcon';

interface EditableSkillTagProps {
    skill: string;
    onRemove: () => void;
    isHighlighted?: boolean; // If true, uses darker blue background (#e6f3ff)
}

const EditableSkillTag: React.FC<EditableSkillTagProps> = ({ 
    skill, 
    onRemove,
    isHighlighted = false 
}) => {
    return (
        <View style={[
            styles.container,
            isHighlighted && styles.highlightedContainer
        ]}>
            <Text style={styles.text}>{skill}</Text>
            <TouchableOpacity
                onPress={onRemove}
                style={styles.removeButton}
                activeOpacity={0.7}
            >
                <CrossIcon size={16} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(205, 231, 255, 0.5)', // Figma: bg-[rgba(205,231,255,0.5)]
        borderRadius: 20, // Figma: rounded-[20px]
        paddingHorizontal: 16, // Figma: px-[16px]
        paddingVertical: 8, // Figma: py-[8px]
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // Figma: gap-[8px] between text and icon
        justifyContent: 'center',
    },
    highlightedContainer: {
        backgroundColor: colors.tableHeaderBlue, // Figma: bg-[#e6f3ff]
    },
    text: {
        ...typography.p4, // Figma: Desktop/P4 Regular, 14px, line-height 20px
        color: colors.textGrey, // Figma: text-[color:var(--text-grey,#696a6f)]
    },
    removeButton: {
        width: 16, // Figma: size-[16px]
        height: 16, // Figma: size-[16px]
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditableSkillTag;

