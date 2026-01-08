import React from 'react';
import { View, StyleSheet } from 'react-native';
import CheckIconGreenSvg from '../../../assets/Check IconGreen.svg';

interface CheckIconGreenProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square icons
    style?: any;
}

/**
 * Green Check Icon Component
 * 
 * Reusable component for the green check icon (Check IconGreen.svg).
 * Used in completed activities, especially for completed assessments.
 */
const CheckIconGreen: React.FC<CheckIconGreenProps> = ({ 
    width, 
    height,
    size,
    style 
}) => {
    // If size is provided, use it for both width and height (square)
    // Otherwise use width/height or default to 48x48
    const finalWidth = size || width || 48;
    const finalHeight = size || height || 48;

    return (
        <View style={[styles.container, { width: finalWidth, height: finalHeight }, style]}>
            <CheckIconGreenSvg 
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

export default CheckIconGreen;

