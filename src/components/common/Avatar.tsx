import React from 'react';
import { View, StyleSheet } from 'react-native';
import AvatarSvg from '../../../assets/Avatar.svg';

interface AvatarProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square avatars
    style?: any;
}

/**
 * Avatar Component
 * 
 * Reusable avatar component using the SVG avatar from assets.
 * Default dimensions: 120x121 (from SVG viewBox).
 * Can be customized with width/height or size prop for square avatars.
 */
const Avatar: React.FC<AvatarProps> = ({ 
    width, 
    height,
    size,
    style 
}) => {
    // If size is provided, use it for both width and height (square)
    // Otherwise use width/height or default to SVG dimensions
    const finalWidth = size || width || 120;
    const finalHeight = size || height || 121;

    return (
        <View style={[styles.container, { width: finalWidth, height: finalHeight }, style]}>
            <AvatarSvg 
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

export default Avatar;

