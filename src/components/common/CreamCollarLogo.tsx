import React from 'react';
import { View, StyleSheet } from 'react-native';
import CreamCollarLogoSvg from '../../../assets/creamcollarMainLogo.svg';

interface CreamCollarLogoProps {
    width?: number;
    height?: number;
    style?: any;
}

/**
 * CreamCollarLogo Component
 * 
 * Reusable logo component using the SVG logo from assets.
 * Matches the exact dimensions from the SVG file (149x32).
 */
const CreamCollarLogo: React.FC<CreamCollarLogoProps> = ({ 
    width = 149, 
    height = 32,
    style 
}) => {
    return (
        <View style={[styles.container, style]}>
            <CreamCollarLogoSvg 
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
    },
});

export default CreamCollarLogo;

