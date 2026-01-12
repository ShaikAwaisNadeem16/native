import React from 'react';
import { View, StyleSheet } from 'react-native';
import ErrorNaughtyCatSvg from '../../../assets/Error Naughty Cat.svg';

interface ErrorNaughtyCatProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square sizing
    style?: any;
}

/**
 * Error Naughty Cat Component
 * 
 * Reusable component for the Error Naughty Cat SVG illustration.
 * Used in error modals and submit confirmation screens.
 */
const ErrorNaughtyCat: React.FC<ErrorNaughtyCatProps> = ({ 
    width, 
    height,
    size,
    style 
}) => {
    // Default dimensions from Figma: 175.102px width, 94px height
    const finalWidth = size || width || 175.102;
    const finalHeight = size || height || 94;

    return (
        <View style={[styles.container, { width: finalWidth, height: finalHeight }, style]}>
            <ErrorNaughtyCatSvg 
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

export default ErrorNaughtyCat;



