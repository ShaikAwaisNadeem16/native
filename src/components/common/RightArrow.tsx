import React from 'react';
import { View, StyleSheet } from 'react-native';
import RightArrowSvg from '../../../assets/rightsideArrow.svg';

interface RightArrowProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square icons
    style?: any;
}

/**
 * RightArrow Component
 * 
 * Reusable component for the right arrow icon (rightsideArrow.svg).
 * Used in collapsible sections, navigation, and anywhere a right arrow is needed.
 */
const RightArrow: React.FC<RightArrowProps> = ({ 
    width, 
    height,
    size,
    style 
}) => {
    const finalWidth = size || width || 24;
    const finalHeight = size || height || 24;

    return (
        <View style={[styles.container, { width: finalWidth, height: finalHeight }, style]}>
            <RightArrowSvg 
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

export default RightArrow;

