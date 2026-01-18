import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import GreenTickSvg from '../../../assets/GreenTick.svg';

interface GreenTickProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square icons
    style?: ViewStyle;
}

/**
 * Green Tick Icon Component
 * 
 * Reusable component for the green tick icon (GreenTick.svg).
 * Used to indicate success, completion (especially for assessments/surveys), or correct answers.
 */
const GreenTick: React.FC<GreenTickProps> = ({
    width,
    height,
    size,
    style
}) => {
    // If size is provided, use it for both width and height (square)
    // Otherwise use width/height or default to 24x24 (standard icon size, adjustable)
    const finalWidth = size || width || 24;
    const finalHeight = size || height || 24;

    return (
        <View style={[styles.container, { width: finalWidth, height: finalHeight }, style]}>
            <GreenTickSvg
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

export default GreenTick;
