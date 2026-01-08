import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface CalendarIconProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square icons
    style?: any;
}

/**
 * Calendar Icon Component
 * 
 * Reusable component for the calendar icon (CalendarIcon.png).
 * Used in date fields, profile screens, and anywhere date selection is needed.
 */
const CalendarIcon: React.FC<CalendarIconProps> = ({ 
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
            <Image
                source={require('../../../assets/CalendarIcon.png')}
                style={[styles.icon, { width: finalWidth, height: finalHeight }]}
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
    icon: {
        width: '100%',
        height: '100%',
    },
});

export default CalendarIcon;

