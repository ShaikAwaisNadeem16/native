/**
 * HTML Parser Utility for Assessment Instructions
 * Extracts structured data from HTML including nested lists
 */

export interface InstructionItem {
    text: string;
    subItems?: string[];
}

export interface ParsedInstructions {
    aboutItems?: InstructionItem[];
    instructions?: InstructionItem[];
    procedureItems?: InstructionItem[];
}

/**
 * Extracts text content from HTML, handling nested structures
 */
const extractTextFromHTML = (html: string): string => {
    // Remove HTML tags but preserve text content
    return html
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
};

/**
 * Parses a list item and extracts text and nested sub-items
 */
const parseListItem = (liHTML: string): InstructionItem | null => {
    const textMatch = liHTML.match(/<li[^>]*>([\s\S]*?)<\/li>/i);
    if (!textMatch || !textMatch[1]) return null;

    const content = textMatch[1];
    
    // Check for nested lists
    const nestedListMatch = content.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
    
    if (nestedListMatch) {
        // Has nested list - extract main text and sub-items
        const mainText = extractTextFromHTML(content.replace(/<ul[^>]*>[\s\S]*?<\/ul>/i, ''));
        const nestedListContent = nestedListMatch[1];
        
        // Extract sub-items
        const subItemMatches = nestedListContent.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi);
        const subItems: string[] = [];
        
        for (const match of subItemMatches) {
            if (match[1]) {
                const subText = extractTextFromHTML(match[1]);
                if (subText.length > 0) {
                    subItems.push(subText);
                }
            }
        }
        
        return {
            text: mainText,
            subItems: subItems.length > 0 ? subItems : undefined,
        };
    } else {
        // Regular list item
        const text = extractTextFromHTML(content);
        return text.length > 0 ? { text } : null;
    }
};

/**
 * Parses HTML to extract instruction sections
 * Handles nested lists and various HTML structures
 */
export const parseInstructionsFromHTML = (html: string): ParsedInstructions => {
    if (!html) {
        return {};
    }

    const result: ParsedInstructions = {};

    try {
        // Extract "About The Assessment" section
        const aboutMatch = html.match(/<div[^>]*>About The Assessment<\/div>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i);
        if (aboutMatch && aboutMatch[1]) {
            const aboutListHTML = aboutMatch[1];
            const aboutItems: InstructionItem[] = [];
            const liMatches = aboutListHTML.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi);
            
            for (const match of liMatches) {
                if (match[0]) {
                    const item = parseListItem(match[0]);
                    if (item) {
                        aboutItems.push(item);
                    }
                }
            }
            
            if (aboutItems.length > 0) {
                result.aboutItems = aboutItems;
            }
        }

        // Extract "Instructions" or "General Instructions" section
        const instructionsMatch = html.match(/<div[^>]*>Instructions<\/div>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i) ||
                                   html.match(/<p[^>]*>Instructions<\/p>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i) ||
                                   html.match(/<div[^>]*>General Instructions<\/div>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i);
        
        if (instructionsMatch && instructionsMatch[1]) {
            const instructionsListHTML = instructionsMatch[1];
            const instructions: InstructionItem[] = [];
            const liMatches = instructionsListHTML.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi);
            
            for (const match of liMatches) {
                if (match[0]) {
                    const item = parseListItem(match[0]);
                    if (item) {
                        instructions.push(item);
                    }
                }
            }
            
            if (instructions.length > 0) {
                result.instructions = instructions;
            }
        }

        // Extract "Procedure For Answering A Question" section
        const procedureMatch = html.match(/<div[^>]*>Procedure For Answering A Question<\/div>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i);
        if (procedureMatch && procedureMatch[1]) {
            const procedureListHTML = procedureMatch[1];
            const procedureItems: InstructionItem[] = [];
            const liMatches = procedureListHTML.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi);
            
            for (const match of liMatches) {
                if (match[0]) {
                    const item = parseListItem(match[0]);
                    if (item) {
                        procedureItems.push(item);
                    }
                }
            }
            
            if (procedureItems.length > 0) {
                result.procedureItems = procedureItems;
            }
        }

        // Fallback: If no structured sections found, try to extract all list items
        if (!result.aboutItems && !result.instructions && !result.procedureItems) {
            const allLiMatches = html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi);
            const fallbackItems: InstructionItem[] = [];
            
            for (const match of allLiMatches) {
                if (match[0]) {
                    const item = parseListItem(match[0]);
                    if (item && !item.text.toLowerCase().includes('about') && !item.text.toLowerCase().includes('procedure')) {
                        fallbackItems.push(item);
                    }
                }
            }
            
            if (fallbackItems.length > 0) {
                result.instructions = fallbackItems;
            }
        }
    } catch (error) {
        console.error('[HTMLParser] Error parsing HTML:', error);
    }

    return result;
};

