import React from 'react';
import { View, StyleSheet } from 'react-native';
import EditPencilIconSvg from '../../../assets/Editpencilicon.svg';

interface EditPencilIconProps {
    width?: number;
    height?: number;
    size?: number; // Convenience prop for square icons
    color?: string; // Optional color tint
    style?: any;
}

/**
 * EditPencilIcon Component
 * 
 * Reusable edit/pencil icon component using the SVG from assets.
 * Default dimensions: 24x24 (from SVG viewBox).
 * Can be customized with width/height or size prop for square icons.
 * 
 * Used for edit buttons, pencil icons, and editing actions.
 */
const EditPencilIcon: React.FC<EditPencilIconProps> = ({
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
            <EditPencilIconSvg
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
        overflow: 'hidden',
    },
});

export default EditPencilIcon;

