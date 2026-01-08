import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface AssessmentLogoProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square logos
    style?: any;
}

/**
 * Assessment Logo Component
 * 
 * Reusable component for the assessment logo (assesmentLogoSpace.png).
 * Used in assessment cards and assessment instruction screens.
 */
const AssessmentLogo: React.FC<AssessmentLogoProps> = ({ 
    width, 
    height,
    size,
    style 
}) => {
    // If size is provided, use it for both width and height (square)
    // Otherwise use width/height or default dimensions
    const finalWidth = size || width || 64;
    const finalHeight = size || height || 64;

    return (
        <View style={[styles.container, { width: finalWidth, height: finalHeight }, style]}>
            <Image
                source={require('../../../assets/assesmentLogoSpace.png')}
                style={[styles.logo, { width: finalWidth, height: finalHeight }]}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
});

export default AssessmentLogo;

