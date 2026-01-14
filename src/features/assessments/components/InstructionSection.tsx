import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../../styles/theme';
import InstructionBulletList from './InstructionBulletList';

interface InstructionItem {
    text: string;
    subItems?: string[];
}

interface InstructionSectionProps {
    title: string;
    items?: InstructionItem[];
    children?: React.ReactNode;
}

/**
 * Reusable instruction section component
 * Displays a section title and content (bullet list or custom children)
 * Matches Figma design exactly
 */
const InstructionSection: React.FC<InstructionSectionProps> = ({
    title,
    items,
    children,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {items && items.length > 0 ? (
                <InstructionBulletList items={items} />
            ) : (
                children
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 24,
    },
    title: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
        marginBottom: 12,
    },
});

export default InstructionSection;




