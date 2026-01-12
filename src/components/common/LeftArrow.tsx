import React from 'react';
import { View, StyleSheet } from 'react-native';
import LeftArrowSvg from '../../../assets/LeftArrowIcon.svg';

interface LeftArrowProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square icons
    style?: any;
    color?: string; // Icon color (fill color)
}

/**
 * LeftArrow Component
 * 
 * Reusable component for the left arrow icon (LeftArrowIcon.svg).
 * Used in navigation, back buttons, and anywhere a left arrow is needed.
 */
const LeftArrow: React.FC<LeftArrowProps> = ({ 
    width, 
    height,
    size,
    style,
    color
}) => {
    const finalWidth = size || width || 24;
    const finalHeight = size || height || 24;

    return (
        <View style={[styles.container, { width: finalWidth, height: finalHeight }, style]}>
            <LeftArrowSvg 
                width={finalWidth} 
                height={finalHeight}
                color={color || '#72818C'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
});

export default LeftArrow;

