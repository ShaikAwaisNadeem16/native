import React from 'react';
import { View, StyleSheet } from 'react-native';
import EyeOffSvg from '../../../assets/EyeOff.svg';

interface EyeOffIconProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square icons
    color?: string; // Optional color tint
    style?: any;
}

/**
 * Eye Off Icon Component (Closed)
 * 
 * Reusable component for the closed/slashed eye icon.
 * Used in password fields to hide password.
 */
const EyeOffIcon: React.FC<EyeOffIconProps> = ({
    width,
    height,
    size,
    color,
    style
}) => {
    const finalWidth = size || width || 24;
    const finalHeight = size || height || 24;

    return (
        <View style={[styles.container, { width: finalWidth, height: finalHeight }, style]}>
            <EyeOffSvg
                width={finalWidth}
                height={finalHeight}
                fill={color}
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

export default EyeOffIcon;
