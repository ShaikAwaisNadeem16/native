import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../../styles/theme';

interface InstructionBulletListProps {
    items: Array<{ text: string; subItems?: string[] }>;
}

/**
 * Reusable bullet list component for instructions
 * Matches Figma design exactly
 * Supports nested sub-items (for "There are following sections in the test:")
 */
const InstructionBulletList: React.FC<InstructionBulletListProps> = ({ items }) => {
    return (
        <View style={styles.container}>
            {items.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                    {item.subItems ? (
                        // Item with sub-items (nested structure)
                        <View style={styles.itemWithSub}>
                            <View style={styles.bulletDotContainer}>
                                <View style={styles.bulletDot} />
                            </View>
                            <View style={styles.itemContent}>
                                <Text style={styles.itemText}>{item.text}</Text>
                                {item.subItems.length > 0 && (
                                    <View style={styles.subItemsContainer}>
                                        {item.subItems.map((subItem, subIndex) => (
                                            <Text key={subIndex} style={styles.subItemText}>
                                                {subItem}
                                            </Text>
                                        ))}
                                    </View>
                                )}
                            </View>
                        </View>
                    ) : (
                        // Regular bullet item
                        <View style={styles.item}>
                            <View style={styles.bulletDot} />
                            <Text style={styles.itemText}>{item.text}</Text>
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    itemContainer: {
        width: '100%',
    },
    item: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        width: '100%',
    },
    itemWithSub: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
        width: '100%',
    },
    bulletDotContainer: {
        width: 6,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 4.5, // Center vertically in 15px container
    },
    bulletDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.textGrey,
        flexShrink: 0,
    },
    itemContent: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
    },
    itemText: {
        ...typography.p3Regular,
        color: colors.textGrey,
        flex: 1,
    },
    subItemsContainer: {
        paddingLeft: 20,
        flexDirection: 'column',
        gap: 4,
    },
    subItemText: {
        ...typography.p3Regular,
        color: colors.textGrey,
    },
});

export default InstructionBulletList;

