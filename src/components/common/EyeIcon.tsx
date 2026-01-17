import React from 'react';
import { View, StyleSheet } from 'react-native';
import EyeSvg from '../../../assets/Eye.svg';

interface EyeIconProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square icons
    color?: string; // Optional color tint
    style?: any;
}

/**
 * Eye Icon Component (Open)
 * 
 * Reusable component for the open eye icon.
 * Used in password fields to show password.
 */
const EyeIcon: React.FC<EyeIconProps> = ({
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
            <EyeSvg
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

export default EyeIcon;
