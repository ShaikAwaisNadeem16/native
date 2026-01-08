import React from 'react';
import { View, StyleSheet } from 'react-native';
import CrossIconSvg from '../../../assets/CrossIcon.svg';

interface CrossIconProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square icons
    style?: any;
}

/**
 * CrossIcon Component
 * 
 * Reusable cross/close icon component using the SVG from assets.
 * Default dimensions: 16x16 (from SVG viewBox).
 * Can be customized with width/height or size prop for square icons.
 * 
 * Used for closing modals, dismissing content, or cancel actions.
 */
const CrossIcon: React.FC<CrossIconProps> = ({ 
    width, 
    height,
    size,
    style 
}) => {
    const finalWidth = size || width || 16;
    const finalHeight = size || height || 16;

    return (
        <View style={[styles.container, { width: finalWidth, height: finalHeight }, style]}>
            <CrossIconSvg 
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

export default CrossIcon;

