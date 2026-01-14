import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface DeleteIconProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square icons
    color?: string; // Optional color tint
    style?: any;
}

/**
 * Delete Icon Component
 * 
 * Reusable component for the delete icon (DeletIcon.png).
 * Used in delete buttons, remove actions, and anywhere deletion is needed.
 * Supports tintColor for customization.
 */
const DeleteIcon: React.FC<DeleteIconProps> = ({
    width,
    height,
    size,
    color,
    style
}) => {
    // If size is provided, use it for both width and height (square)
    // Otherwise use width/height or default to 24x24
    const finalWidth = size || width || 24;
    const finalHeight = size || height || 24;

    return (
        <View style={[styles.container, { width: finalWidth, height: finalHeight }, style]}>
            <Image
                source={require('../../../assets/DeletIcon.png')}
                style={[
                    styles.icon,
                    { width: finalWidth, height: finalHeight },
                    color ? { tintColor: color } : undefined
                ]}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: '100%',
        height: '100%',
    },
});

export default DeleteIcon;
