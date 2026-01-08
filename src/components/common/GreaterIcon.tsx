import React from 'react';
import { View, StyleSheet } from 'react-native';
import GreaterIconSvg from '../../../assets/GreaterIconWrapper.svg';

interface GreaterIconProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square icons
    color?: string; // Optional color override (if SVG supports it)
    style?: any;
}

/**
 * Greater Icon Component (>)
 * 
 * Reusable component for the greater than symbol (used in breadcrumbs, navigation, etc.).
 * Default dimensions: 16x16 (from SVG viewBox).
 */
const GreaterIcon: React.FC<GreaterIconProps> = ({ 
    width, 
    height,
    size,
    style 
}) => {
    // If size is provided, use it for both width and height (square)
    // Otherwise use width/height or default to SVG dimensions
    const finalWidth = size || width || 16;
    const finalHeight = size || height || 16;

    return (
        <View style={[styles.container, { width: finalWidth, height: finalHeight }, style]}>
            <GreaterIconSvg 
                width={finalWidth} 
                height={finalHeight}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default GreaterIcon;

