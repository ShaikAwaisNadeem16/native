import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../../../styles/theme';
import Svg, { Polygon, Line, Circle } from 'react-native-svg';

interface StrengthData {
    label: string;
    value: number; // 0-100
    abbreviation: string; // e.g., "ES", "DE", "CS", "DC"
}

interface RadarChartProps {
    strengths: StrengthData[];
    selectedStrength?: string; // Label of selected strength for tooltip
}

/**
 * RadarChart - Reusable radar/spider chart component for displaying strengths
 * Matches Figma design: node 12085:61733
 */
const RadarChart: React.FC<RadarChartProps> = ({ strengths, selectedStrength }) => {
    const size = 214;
    const center = size / 2;
    const radius = size / 2 - 20;
    
    // Calculate positions for each strength point
    const getPointPosition = (index: number, total: number, value: number) => {
        const angle = (index * 360) / total - 90; // Start from top
        const radian = (angle * Math.PI) / 180;
        const distance = (radius * value) / 100;
        const x = center + distance * Math.cos(radian);
        const y = center + distance * Math.sin(radian);
        return { x, y, angle, distance };
    };

    // Generate polygon points
    const points = strengths.map((_, index) => {
        const pos = getPointPosition(index, strengths.length, strengths[index].value);
        return `${pos.x},${pos.y}`;
    }).join(' ');

    // Generate label positions based on Figma exact positions
    // Order: ES (top), DE (right), CS (left), DC (bottom) - clockwise from top
    // Exact Figma pixel positions:
    // ES: center top (x: 164, y: 0)
    // DE: right (x: 271, y: 106)
    // CS: left (x: 0, y: 108)
    // DC: bottom (x: 134, y: 246.57)
    const getLabelPosition = (index: number, abbreviation: string) => {
        // Map abbreviations to exact Figma positions
        const positions: Record<string, { x: number; y: number; alignment: 'center' | 'left' }> = {
            'ES': { x: 164, y: 0, alignment: 'center' }, // Top center (328/2 = 164)
            'DE': { x: 271, y: 106, alignment: 'left' }, // Right
            'CS': { x: 0, y: 108, alignment: 'left' }, // Left
            'DC': { x: 134, y: 246.57, alignment: 'left' }, // Bottom
        };
        
        return positions[abbreviation] || { x: 0, y: 0, alignment: 'left' as const };
    };
    
    const labelPositions = strengths.map((strength, index) => {
        const pos = getLabelPosition(index, strength.abbreviation);
        return { ...pos, strength, index };
    });

    return (
        <View style={styles.container}>
            {/* SVG positioned at left: 57px, top: 28px within container (from Figma) */}
            <View style={styles.svgWrapper}>
                <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={styles.svg}>
                {/* Grid circles */}
                <Circle cx={center} cy={center} r={radius} fill="none" stroke={colors.lightGrey} strokeWidth="1" />
                <Circle cx={center} cy={center} r={radius * 0.6} fill="none" stroke={colors.lightGrey} strokeWidth="1" />
                
                {/* Grid lines */}
                {strengths.map((_, index) => {
                    const pos = getPointPosition(index, strengths.length, 100);
                    return (
                        <Line
                            key={`grid-${index}`}
                            x1={center}
                            y1={center}
                            x2={pos.x}
                            y2={pos.y}
                            stroke={colors.lightGrey}
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data polygon */}
                <Polygon
                    points={points}
                    fill={colors.primaryBlue}
                    fillOpacity="0.3"
                    stroke={colors.primaryBlue}
                    strokeWidth="2"
                />
                </Svg>
            </View>

            {/* Labels - positioned exactly as in Figma */}
            {labelPositions.map((labelPos, index) => {
                const isSelected = selectedStrength === labelPos.strength.label;
                const isHighest = strengths[index].value === Math.max(...strengths.map(s => s.value));
                const alignment = labelPos.alignment || 'left';
                
                return (
                    <View
                        key={index}
                        style={[
                            styles.labelContainer,
                            {
                                left: labelPos.x,
                                top: labelPos.y,
                                alignItems: alignment === 'center' ? 'center' : 'flex-start',
                            },
                        ]}
                    >
                        <Text style={[
                            styles.labelAbbr, 
                            isHighest && styles.labelHighlight,
                            alignment === 'center' && styles.labelCenter
                        ]}>
                            {labelPos.strength.abbreviation}:
                        </Text>
                        <Text style={[
                            styles.labelValue, 
                            isHighest && styles.labelHighlight,
                            alignment === 'center' && styles.labelCenter
                        ]}>
                            {labelPos.strength.value}%
                        </Text>
                    </View>
                );
            })}

            {/* Tooltip (if strength is selected) - positioned above ES label */}
            {selectedStrength && (
                <View style={[
                    styles.tooltip,
                    {
                        left: 84, // Figma position: left: 84px
                        top: -50, // Figma position: top: -50px (above chart)
                    }
                ]}>
                    <Text style={styles.tooltipText}>
                        {strengths.find(s => s.label === selectedStrength)?.label || selectedStrength}
                    </Text>
                    <View style={styles.tooltipTail} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 328, // Exact Figma width
        height: 267, // Exact Figma height
        position: 'relative',
        alignSelf: 'center',
        flexShrink: 0,
    },
    svgWrapper: {
        position: 'absolute',
        left: 57, // Exact Figma position
        top: 28, // Exact Figma position
        width: 214,
        height: 214,
    },
    svg: {
        flexShrink: 0,
        width: 214,
        height: 214,
    },
    labelContainer: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2.823, // Exact gap from Figma
    },
    labelAbbr: {
        fontFamily: 'Inter',
        fontSize: 16, // Some labels use 16px (p3Regular)
        fontWeight: '400',
        lineHeight: 25,
        color: colors.textGrey,
    },
    labelValue: {
        ...typography.p4SemiBold, // 14px SemiBold, line-height 20px
        color: colors.textGrey,
    },
    labelHighlight: {
        color: colors.highestStrengthGreen, // #239f57 from Figma
    },
    labelCenter: {
        textAlign: 'center',
    },
    tooltip: {
        position: 'absolute',
        backgroundColor: '#333', // Exact Figma color
        borderWidth: 1,
        borderColor: '#606060', // Exact Figma color
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tooltipText: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 16,
        color: colors.white,
        textAlign: 'center',
    },
    tooltipTail: {
        position: 'absolute',
        bottom: -8,
        left: '50%',
        transform: [{ translateX: -14 }], // Center the tail (28px wide / 2 = 14px)
        width: 0,
        height: 0,
        borderLeftWidth: 14,
        borderRightWidth: 14,
        borderTopWidth: 8.172, // Exact Figma height
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#606060',
    },
});

export default RadarChart;
