import React from 'react';
import { View, StyleSheet } from 'react-native';
import PlusIconSvg from '../../../assets/PlusIcon.svg';

interface PlusIconProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square icons
    style?: any;
}

/**
 * PlusIcon Component
 * 
 * Reusable plus icon component using the SVG from assets.
 * Default dimensions: 16x16 (from SVG viewBox).
 * Can be customized with width/height or size prop for square icons.
 */
const PlusIcon: React.FC<PlusIconProps> = ({ 
    width, 
    height,
    size,
    style 
}) => {
    const finalWidth = size || width || 16;
    const finalHeight = size || height || 16;

    return (
        <View style={[styles.container, { width: finalWidth, height: finalHeight }, style]}>
            <PlusIconSvg 
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

export default PlusIcon;

