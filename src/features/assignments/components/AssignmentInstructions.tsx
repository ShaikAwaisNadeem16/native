import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '../../../styles/theme';
import Checkbox from '../../../components/SignUp/Checkbox';
import PrimaryButton from '../../../components/SignUp/PrimaryButton';

/**
 * AssignmentInstructions Component
 * 
 * Renders the assignment instructions section exactly as per Figma design (node 8217-85489).
 * Includes instructions content, "How To Submit" section, terms checkbox, and Start button.
 * 
 * Data Binding:
 * - assign_data.html → instructionsHtml prop (parsed and rendered)
 * - assign_data.terms → termsText prop
 * - assign_data.btntext → buttonLabel prop
 * - studentData.status → controls button state if needed
 */
export interface AssignmentInstructionsProps {
    instructionsHtml: string; // From assign_data.html - HTML content to render
    howToSubmitHtml?: string; // Optional separate HTML for "How To Submit" section
}

/**
 * Parse HTML to extract list items from <ul><li> structure
 * Handles the actual HTML format from the API
 */
const parseHtmlToBulletPoints = (html: string): string[] => {
    if (!html) return [];
    
    const items: string[] = [];
    
    // Extract all <li> tags and their content
    const liRegex = /<li[^>]*>(.*?)<\/li>/gs;
    let match;
    
    while ((match = liRegex.exec(html)) !== null) {
        let text = match[1];
        // Remove nested HTML tags but keep text
        text = text
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
            .replace(/&amp;/g, '&') // Replace &amp; with &
            .replace(/&lt;/g, '<') // Replace &lt; with <
            .replace(/&gt;/g, '>') // Replace &gt; with >
            .replace(/&quot;/g, '"') // Replace &quot; with "
            .replace(/&#39;/g, "'") // Replace &#39; with '
            .trim();
        
        if (text.length > 0) {
            items.push(text);
        }
    }
    
    return items;
};

/**
 * Split HTML into Instructions and How To Submit sections
 */
const splitInstructionsHtml = (html: string): { instructions: string; howToSubmit: string } => {
    if (!html) return { instructions: '', howToSubmit: '' };
    
    // Find the divider (hr tag) and "How To Submit" heading
    const howToSubmitIndex = html.indexOf('How To Submit');
    
    if (howToSubmitIndex === -1) {
        // No "How To Submit" section, return all as instructions
        return { instructions: html, howToSubmit: '' };
    }
    
    // Find the start of "How To Submit" section (look for the div or heading before the ul)
    const instructionsEnd = html.lastIndexOf('<hr', howToSubmitIndex);
    const instructions = instructionsEnd !== -1 
        ? html.substring(0, instructionsEnd)
        : html.substring(0, howToSubmitIndex);
    
    // Extract "How To Submit" section (from "How To Submit" to end)
    const howToSubmitStart = html.indexOf('<ul', howToSubmitIndex);
    const howToSubmit = howToSubmitStart !== -1
        ? html.substring(howToSubmitStart)
        : '';
    
    return {
        instructions: instructions.trim(),
        howToSubmit: howToSubmit.trim(),
    };
};

const AssignmentInstructions: React.FC<AssignmentInstructionsProps> = ({
    instructionsHtml,
    howToSubmitHtml,
}) => {
    // Split HTML into instructions and "How To Submit" sections if not already split
    const { instructions: instructionsSection, howToSubmit: howToSubmitSection } = 
        howToSubmitHtml ? { instructions: instructionsHtml, howToSubmit: howToSubmitHtml } 
                        : splitInstructionsHtml(instructionsHtml);
    
    // Parse HTML to bullet points
    const instructions = parseHtmlToBulletPoints(instructionsSection);
    const howToSubmit = parseHtmlToBulletPoints(howToSubmitSection);

    return (
        <View style={styles.container}>
            {/* Instructions Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Instructions</Text>
                <View style={styles.bulletList}>
                    {instructions.map((instruction, index) => (
                        <View key={index} style={styles.bulletItem}>
                            <View style={styles.bulletDot} />
                            <Text style={styles.bulletText}>{instruction}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* How To Submit Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>How To Submit</Text>
                <View style={styles.bulletList}>
                    {howToSubmit.map((item, index) => (
                        <View key={index} style={styles.bulletItem}>
                            <View style={styles.bulletDot} />
                            <Text style={styles.bulletText}>{item}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

/**
 * Terms and Button Section (separate component for reusability)
 */
export interface AssignmentTermsAndButtonProps {
    termsText: string;
    deadlineText?: string;
    buttonLabel: string;
    onStartAssignment: () => void;
    isButtonDisabled?: boolean;
}

/**
 * Parse HTML terms text to extract plain text and deadline
 */
const parseTermsHtml = (html: string): { text: string; deadline?: string } => {
    if (!html) return { text: '' };
    
    // Extract text from <p> tag
    const pMatch = html.match(/<p[^>]*>(.*?)<\/p>/s);
    if (!pMatch) {
        // Not HTML, return as is
        return { text: html };
    }
    
    let text = pMatch[1];
    
    // Extract deadline from <strong> tag
    const strongMatch = text.match(/<strong[^>]*>(.*?)<\/strong>/);
    const deadline = strongMatch ? strongMatch[1].trim() : undefined;
    
    // Remove <strong> tags from text
    text = text.replace(/<strong[^>]*>(.*?)<\/strong>/g, '$1');
    
    // Remove any remaining HTML tags
    text = text
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .trim();
    
    return { text, deadline };
};

export const AssignmentTermsAndButton: React.FC<AssignmentTermsAndButtonProps> = ({
    termsText,
    deadlineText,
    buttonLabel,
    onStartAssignment,
    isButtonDisabled: externalDisabled,
}) => {
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    
    // Button is disabled if terms not accepted or externally disabled
    const isButtonDisabled = !isTermsAccepted || externalDisabled === true;

    // Parse terms HTML to extract text and deadline
    const { text: parsedTermsText, deadline: parsedDeadline } = parseTermsHtml(termsText);
    
    // Use provided deadlineText or parsed deadline
    const finalDeadline = deadlineText || parsedDeadline;
    
    // Format terms text - the deadline is already in the parsed text if it was in HTML
    // If deadlineText prop is provided, use it; otherwise use parsed deadline
    let formattedTerms = parsedTermsText;
    if (finalDeadline && !parsedTermsText.includes(finalDeadline)) {
        // Replace placeholder or append deadline if not already present
        formattedTerms = parsedTermsText.replace(
            /Your deadline will be set for\s*(?:<strong>.*?<\/strong>)?/i,
            `Your deadline will be set for ${finalDeadline}`
        );
    }

    return (
        <View style={styles.termsContainer}>
            {/* Terms Checkbox */}
            <View style={styles.termsRow}>
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        checked={isTermsAccepted}
                        onToggle={() => setIsTermsAccepted(!isTermsAccepted)}
                        size={16}
                    />
                </View>
                <Text style={styles.termsText}>
                    {formattedTerms.split(finalDeadline || '').map((part, index, array) => (
                        <React.Fragment key={index}>
                            {part}
                            {index < array.length - 1 && finalDeadline && (
                                <Text style={styles.deadlineText}>{finalDeadline}</Text>
                            )}
                        </React.Fragment>
                    ))}
                </Text>
            </View>

            {/* Start Assignment Button */}
            <PrimaryButton
                label={buttonLabel}
                onPress={onStartAssignment}
                disabled={isButtonDisabled}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.card,
        padding: 24, // 24px padding from Figma
        flexDirection: 'column',
        gap: 24, // 24px gap between sections from Figma
        width: '100%',
    },
    section: {
        flexDirection: 'column',
        gap: 12, // 12px gap between title and bullet list from Figma
        width: '100%',
    },
    sectionTitle: {
        ...typography.p3Bold, // Inter Bold, 16px, line-height 23px from Figma
        color: colors.primaryDarkBlue, // #00213d from Figma
    },
    bulletList: {
        flexDirection: 'column',
        gap: 8, // 8px gap between bullet items from Figma
        width: '100%',
    },
    bulletItem: {
        flexDirection: 'row',
        gap: 12, // 12px gap between dot and text from Figma
        alignItems: 'center',
        width: '100%',
    },
    bulletDot: {
        width: 6, // 6x6px dot from Figma
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.textGrey, // #696a6f from Figma
        flexShrink: 0,
    },
    bulletText: {
        ...typography.p3Regular, // Inter Regular, 16px, line-height 25px from Figma
        color: colors.textGrey, // #696a6f from Figma
        flex: 1,
    },
    divider: {
        height: 1, // 1px divider from Figma
        width: '100%',
        backgroundColor: colors.lightGrey, // #e2ebf3 from Figma
    },
    termsContainer: {
        flexDirection: 'column',
        gap: 16, // 16px gap between terms and button from Figma
        paddingHorizontal: 16, // 16px horizontal padding from Figma
        width: '100%',
    },
    termsRow: {
        flexDirection: 'row',
        gap: 12, // 12px gap between checkbox and text from Figma
        alignItems: 'flex-start',
        width: '100%',
    },
    checkboxContainer: {
        paddingTop: 2, // 2px top padding to align with text from Figma
        flexShrink: 0,
    },
    termsText: {
        ...typography.s1Regular, // Inter Regular, 12px, line-height 16px from Figma
        color: colors.primaryDarkBlue, // #00213d from Figma
        flex: 1,
    },
    deadlineText: {
        ...typography.s1Regular,
        fontWeight: '700', // Bold for deadline text
        color: colors.primaryDarkBlue,
    },
});

export default AssignmentInstructions;

