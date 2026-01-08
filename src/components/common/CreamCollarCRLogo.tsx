import React from 'react';
import { View, StyleSheet } from 'react-native';
import CreamCollarCRLogoSvg from '../../../assets/creamcollarCRlogo.svg';

interface CreamCollarCRLogoProps {
    width?: number;
    height?: number;
    style?: any;
}

/**
 * CreamCollar CR Logo Component
 * 
 * Uses the creamcollarCRlogo.svg asset (same artwork as favicon) for CR logo usage.
 * Default dimensions: 18x16 (from SVG viewBox).
 */
const CreamCollarCRLogo: React.FC<CreamCollarCRLogoProps> = ({ 
    width = 18, 
    height = 16,
    style 
}) => {
    return (
        <View style={[styles.container, { width, height }, style]}>
            <CreamCollarCRLogoSvg 
                width={width} 
                height={height}
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

export default CreamCollarCRLogo;

