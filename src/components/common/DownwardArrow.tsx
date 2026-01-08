import React from 'react';
import { View, StyleSheet } from 'react-native';
import DownwardArrowSvg from '../../../assets/downwardArrow.svg';

interface DownwardArrowProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square icons
    style?: any;
}

/**
 * Downward Arrow Component
 * 
 * Reusable component for the downward arrow icon (downwardArrow.svg).
 * Used in dropdowns, expandable sections, and anywhere a downward arrow is needed.
 */
const DownwardArrow: React.FC<DownwardArrowProps> = ({ 
    width, 
    height,
    size,
    style 
}) => {
    const finalWidth = size || width || 24;
    const finalHeight = size || height || 24;

    return (
        <View style={[styles.container, { width: finalWidth, height: finalHeight }, style]}>
            <DownwardArrowSvg 
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
        overflow: 'hidden',
    },
});

export default DownwardArrow;

