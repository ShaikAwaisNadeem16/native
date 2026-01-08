import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface DeleteIconProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square icons
    style?: any;
}

/**
 * Delete Icon Component
 * 
 * Reusable component for the delete icon (deleteIcon.png).
 * Used in delete buttons, remove actions, and anywhere deletion is needed.
 */
const DeleteIcon: React.FC<DeleteIconProps> = ({ 
    width, 
    height,
    size,
    style 
}) => {
    // If size is provided, use it for both width and height (square)
    // Otherwise use width/height or default to 24x24
    const finalWidth = size || width || 24;
    const finalHeight = size || height || 24;

    return (
        <View style={[styles.container, { width: finalWidth, height: finalHeight }, style]}>
            <Image
                source={require('../../../assets/deleteIcon.png')}
                style={[styles.icon, { width: finalWidth, height: finalHeight }]}
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

