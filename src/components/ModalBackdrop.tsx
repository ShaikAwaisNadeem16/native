import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

interface ModalBackdropProps {
    /**
     * Optional onPress handler for backdrop tap
     */
    onPress?: () => void;
    /**
     * Optional testID for testing
     */
    testID?: string;
}

/**
 * ModalBackdrop Component
 * 
 * A reusable backdrop/overlay component for modals and dialogs.
 * Matches Figma design: Background color #191a1b with 60% opacity.
 * 
 * Usage:
 * ```tsx
 * <ModalBackdrop onPress={() => setModalVisible(false)} />
 * ```
 */
const ModalBackdrop: React.FC<ModalBackdropProps> = ({ onPress, testID }) => {
    const content = <View style={styles.backdrop} />;

    if (onPress) {
        return (
            <Pressable
                style={styles.pressable}
                onPress={onPress}
                testID={testID}
            >
                {content}
            </Pressable>
        );
    }

    return (
        <View style={styles.pressable} testID={testID}>
            {content}
        </View>
    );
};

const styles = StyleSheet.create({
    pressable: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    backdrop: {
        flex: 1,
        backgroundColor: '#191a1b',
        opacity: 0.6, // 60% opacity as per Figma
    },
});

export default ModalBackdrop;

