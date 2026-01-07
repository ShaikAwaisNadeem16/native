// Exact Figma design specifications
export const colors = {
    // From Figma variables
    primaryBlue: '#0b6aea',
    primaryDarkBlue: '#00213d',
    white: '#ffffff',
    mainBgGrey: '#f6f9fc',
    lightGrey: '#e2ebf3',
    textGrey: '#696a6f',
    placeholderGrey: '#80919f',
    // Additional colors from design
    info: '#2F80ED',
    error: '#EB5757',
    grey1: '#333333',
    black2: '#1D1D1D',
    highlightBlue: '#f2f7fe', // Highlight blue for coming soon tag
    successGreen: '#27ae60', // Success green for percentage
    reportBlue: '#0049b5', // Blue color for assessment report card
    tableHeaderBlue: '#e6f3ff', // Light blue for table header background
    passBg: 'rgba(39, 174, 96, 0.05)', // Light green background for Pass tag
    failBg: 'rgba(235, 87, 87, 0.05)', // Light red background for Fail tag
    reviewOrange: '#f18522', // Orange color for marked-for-review questions (from Figma)
};

export const typography = {
    // Desktop/H6: Inter Bold, 20px, line-height 24px, weight 700
    h6: {
        fontFamily: 'Inter',
        fontSize: 20,
        fontWeight: '700' as const,
        lineHeight: 24,
        letterSpacing: 0,
    },
    // Desktop/P1 Bold: Inter Bold, 20px, line-height 28px, weight 700
    p1Bold: {
        fontFamily: 'Inter',
        fontSize: 20,
        fontWeight: '700' as const,
        lineHeight: 28,
        letterSpacing: 0,
    },
    // Desktop/P4 Regular: Inter Regular, 14px, line-height 20px, weight 400
    p4: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
        letterSpacing: 0,
    },
    // Desktop/S2 SemiBold: Inter SemiBold, 12px, line-height 13px, weight 600
    s2SemiBold: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: '600' as const,
        lineHeight: 13,
        letterSpacing: 0,
    },
    // Desktop/S1 Regular: Inter Regular, 12px, line-height 16px, weight 400
    s1Regular: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
        letterSpacing: 0,
    },
    // Desktop/P3 Bold: Inter Bold, 16px, line-height 23px, weight 700
    p3Bold: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: '700' as const,
        lineHeight: 23,
        letterSpacing: 0,
    },
    // Desktop/P3 Regular: Inter Regular, 16px, line-height 25px, weight 400
    p3Regular: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 25,
        letterSpacing: 0,
    },
    // Desktop/P2 Bold: Inter Bold, 18px, line-height 25px, weight 700
    p2Bold: {
        fontFamily: 'Inter',
        fontSize: 18,
        fontWeight: '700' as const,
        lineHeight: 25,
        letterSpacing: 0,
    },
    // Desktop/P4 SemiBold: Inter Semi Bold, 14px, line-height 20px, weight 600
    p4SemiBold: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '600' as const,
        lineHeight: 20,
        letterSpacing: 0,
    },
    // Placeholder text: Inter Regular, 14px, color #80919f
    placeholder: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
        letterSpacing: 0,
        color: '#80919f',
    },
    // Terms text: Inter Regular, 10px, line-height 14px
    terms: {
        fontFamily: 'Inter',
        fontSize: 10,
        fontWeight: '400' as const,
        lineHeight: 14,
        letterSpacing: 0,
    },
    // Inter_Regular_12: Inter Regular, 12px, line-height 1.13 (13.56px)
    interRegular12: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 13.56, // 1.13 * 12
        letterSpacing: 0,
    },
    // Desktop/H5: Inter Bold, 24px, line-height 26px, weight 700
    h5: {
        fontFamily: 'Inter',
        fontSize: 24,
        fontWeight: '700' as const,
        lineHeight: 26,
        letterSpacing: 0,
    },
};

export const spacing = {
    // Card padding: 48px horizontal, 32px vertical
    cardPaddingH: 48,
    cardPaddingV: 32,
    // Gap between sections: 48px
    sectionGap: 48,
    // Gap in progress steps: 8px
    stepGap: 8,
    // Gap in title section: 4px (between title and subtitle), 20px (between progress and title from Figma Frame 16389)
    titleSubtitleGap: 4,
    titleProgressGap: 20,
    // Input padding: 20px horizontal, 12px vertical
    inputPaddingH: 20,
    inputPaddingV: 12,
    // Footer padding: 32px horizontal
    footerPaddingH: 32,
};

export const borderRadius = {
    card: 12,
    input: 8,
    stepCircle: 24,
    connectorLine: 20,
};

export const sizes = {
    cardWidth: 560,
    stepCircle: 28,
    connectorLineHeight: 4,
    logoWidth: 152,
    logoHeight: 32,
};

// Shadow styles from Figma
export const shadows = {
    // Active Element Shadow: DROP_SHADOW, color: #092C4C14, offset: (0, 8), radius: 40, spread: 0
    activeElement: {
        shadowColor: '#092C4C',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08, // 14 in hex = ~0.08 opacity
        shadowRadius: 40,
        elevation: 8, // Android shadow
    },
};

// Animation timing from Figma design
export const animations = {
    // Input field transition timing
    inputTransition: {
        duration: 200, // 200ms
        easing: 'ease-out',
    },
    // Floating label animation
    floatingLabel: {
        duration: 200, // 200ms
        // Label positions
        defaultTop: 14, // Centered in input (44px height - 16px label height / 2)
        floatedTop: -8, // Above input border
        // Label font sizes
        defaultFontSize: 14, // Same as input text
        floatedFontSize: 12, // Smaller when floated
        // Label padding
        horizontalPadding: 4, // Padding around floated label
    },
};

// ============================================
// CENTRALIZED INPUT VARIANT SYSTEM
// Based on Figma design specifications
// ============================================

export type InputVariant = 'default' | 'focused' | 'error' | 'disabled' | 'filled';

export interface InputVariantStyles {
    borderColor: string;
    backgroundColor: string;
    textColor: string;
    placeholderColor: string;
}

// Input variant definitions - single source of truth
export const inputVariants: Record<InputVariant, InputVariantStyles> = {
    default: {
        borderColor: colors.lightGrey,     // #e2ebf3
        backgroundColor: colors.white,      // #ffffff
        textColor: colors.textGrey,         // #696a6f
        placeholderColor: colors.placeholderGrey, // #80919f
    },
    focused: {
        borderColor: colors.primaryBlue,   // #0b6aea
        backgroundColor: colors.white,      // #ffffff
        textColor: colors.primaryBlue,      // #0b6aea
        placeholderColor: colors.placeholderGrey, // #80919f
    },
    error: {
        borderColor: colors.error,          // #EB5757
        backgroundColor: colors.white,      // #ffffff
        textColor: colors.textGrey,         // #696a6f
        placeholderColor: colors.placeholderGrey, // #80919f
    },
    disabled: {
        borderColor: colors.lightGrey,      // #e2ebf3
        backgroundColor: '#ededed',         // Disabled grey from Figma
        textColor: colors.textGrey,         // #696a6f
        placeholderColor: colors.placeholderGrey, // #80919f
    },
    filled: {
        borderColor: colors.lightGrey,      // #e2ebf3
        backgroundColor: colors.white,      // #ffffff
        textColor: colors.textGrey,         // #696a6f
        placeholderColor: colors.placeholderGrey, // #80919f
    },
};

// Helper function to get input container styles for a given variant
export const getInputContainerStyle = (variant: InputVariant) => ({
    backgroundColor: inputVariants[variant].backgroundColor,
    borderWidth: 1,
    borderColor: inputVariants[variant].borderColor,
    borderRadius: borderRadius.input,
    paddingHorizontal: spacing.inputPaddingH,
    paddingVertical: spacing.inputPaddingV,
});

// Helper function to get input text style for a given variant
export const getInputTextStyle = (variant: InputVariant) => ({
    ...typography.p4,
    color: inputVariants[variant].textColor,
    padding: 0,
    margin: 0,
});

// Helper function to determine variant based on state
export const getInputVariant = (options: {
    isFocused?: boolean;
    hasError?: boolean;
    isDisabled?: boolean;
    hasValue?: boolean;
}): InputVariant => {
    const { isFocused, hasError, isDisabled, hasValue } = options;

    if (isDisabled) return 'disabled';
    if (hasError) return 'error';
    if (isFocused) return 'focused';
    if (hasValue) return 'filled';
    return 'default';
};

// Input field dimensions from Figma node 6076-36897
export const inputDimensions = {
    // Standard input height: 44px (20px text + 12px top padding + 12px bottom padding)
    minHeight: 44,
    // Multiline input minimum height
    multilineMinHeight: 100,
    // Input text minimum height
    textMinHeight: 20,
    // Border width
    borderWidth: 1,
};

// Base input container styles (common across all variants)
export const inputBaseStyles = {
    container: {
        width: '100%' as const,
    },
    inputContainer: {
        backgroundColor: colors.white,
        borderWidth: inputDimensions.borderWidth,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input,
        paddingHorizontal: spacing.inputPaddingH,
        paddingVertical: spacing.inputPaddingV,
        minHeight: inputDimensions.minHeight,
    },
    inputContainerFocused: {
        borderColor: colors.primaryBlue,
    },
    inputContainerError: {
        borderColor: colors.error,
    },
    inputContainerDisabled: {
        backgroundColor: '#ededed',
    },
    input: {
        ...typography.p4,
        color: colors.textGrey,
        padding: 0,
        margin: 0,
        minHeight: 20,
    },
    inputFocused: {
        color: colors.primaryBlue,
    },
    placeholderText: {
        color: colors.placeholderGrey,
    },
    label: {
        ...typography.s1Regular,
        color: colors.textGrey,
        marginBottom: 8,
    },
    required: {
        color: colors.primaryBlue,
    },
    errorText: {
        ...typography.s1Regular,
        color: colors.error,
        marginTop: 4,
    },
    helperText: {
        ...typography.s1Regular,
        color: colors.textGrey,
        marginTop: 8,
    },
    charCount: {
        ...typography.s1Regular,
        color: colors.textGrey,
        textAlign: 'right' as const,
        marginTop: 4,
    },
};

export const theme = {
    colors,
    typography,
    spacing,
    borderRadius,
    sizes,
    shadows,
    animations,
    inputDimensions,
    inputVariants,
    inputBaseStyles,
    getInputVariant,
    getInputContainerStyle,
    getInputTextStyle,
};

export default theme;
