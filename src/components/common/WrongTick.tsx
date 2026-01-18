import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import WrongTickSvg from '../../../assets/WrongTick.svg';

interface WrongTickProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square icons
    style?: ViewStyle;
}

/**
 * Wrong Tick Icon Component
 * 
 * Reusable component for the wrong tick icon (WrongTick.svg).
 * Used to indicate errors, failed assessments, or incorrect answers.
 */
const WrongTick: React.FC<WrongTickProps> = ({
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
            <WrongTickSvg
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

export default WrongTick;
