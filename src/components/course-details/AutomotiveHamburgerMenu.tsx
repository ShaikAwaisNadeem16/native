import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Pressable,
} from 'react-native';
import { colors, typography } from '../../styles/theme';
import CrossIcon from '../common/CrossIcon';

// Types for module items
export type ModuleItemStatus = 'completed' | 'current' | 'locked';

export interface ModuleItem {
    id: string;
    title: string;
    type: 'video' | 'read' | 'quiz';
    status: ModuleItemStatus;
}

export interface ModuleSection {
    id: string;
    title: string;
    items?: ModuleItem[];
    isLocked?: boolean;
}

interface AutomotiveHamburgerMenuProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    sections?: ModuleSection[];
    onItemPress?: (sectionId: string, itemId: string) => void;
    onSectionPress?: (sectionId: string) => void;
    initialExpandedSection?: string;
}

/**
 * AutomotiveHamburgerMenu Component
 * Drawer/modal menu showing course modules with expandable sections
 * Based on Figma design node-id=7381-69504
 */
const AutomotiveHamburgerMenu: React.FC<AutomotiveHamburgerMenuProps> = ({
    visible,
    onClose,
    title = 'Awareness On Automotive Industry',
    subtitle = 'Automotive Industry Value Chain',
    sections = [],
    onItemPress,
    onSectionPress,
    initialExpandedSection,
}) => {
    const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
        initialExpandedSection || null
    );

    const handleSectionPress = (sectionId: string, isLocked?: boolean) => {
        if (isLocked) return;

        setExpandedSectionId(prev => prev === sectionId ? null : sectionId);
        onSectionPress?.(sectionId);
    };

    const handleItemPress = (sectionId: string, itemId: string, status: ModuleItemStatus) => {
        if (status === 'locked') return;
        onItemPress?.(sectionId, itemId);
    };

    // Render status icon based on item status
    const renderStatusIcon = (status: ModuleItemStatus) => {
        switch (status) {
            case 'completed':
                return (
                    <View style={styles.completedDot} />
                );
            case 'current':
                return (
                    <View style={styles.currentCircle} />
                );
            case 'locked':
                return (
                    <View style={styles.lockIconContainer}>
                        <View style={styles.lockBody}>
                            <View style={styles.lockShackle} />
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    // Render lock icon for locked sections
    const renderSectionLockIcon = () => (
        <View style={styles.sectionLockIcon}>
            <View style={styles.lockBody}>
                <View style={styles.lockShackle} />
            </View>
        </View>
    );

    // Render chevron icon
    const renderChevronIcon = (isExpanded: boolean) => (
        <View style={[styles.chevronContainer, isExpanded && styles.chevronExpanded]}>
            <View style={styles.chevronLine1} />
            <View style={styles.chevronLine2} />
        </View>
    );

    // Render close (X) icon
    const renderCloseIcon = () => (
        <CrossIcon size={14} />
    );

    // Render module item
    const renderModuleItem = (item: ModuleItem, sectionId: string) => {
        const isLocked = item.status === 'locked';

        return (
            <TouchableOpacity
                key={item.id}
                style={[
                    styles.moduleItem,
                    item.status === 'current' && styles.moduleItemCurrent,
                ]}
                onPress={() => handleItemPress(sectionId, item.id, item.status)}
                activeOpacity={isLocked ? 1 : 0.7}
                disabled={isLocked}
            >
                <View style={styles.moduleItemIconContainer}>
                    {renderStatusIcon(item.status)}
                </View>
                <Text
                    style={[
                        styles.moduleItemText,
                        isLocked && styles.moduleItemTextLocked,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {item.type === 'video' && 'Video: '}
                    {item.type === 'read' && 'Read: '}
                    {item.type === 'quiz' && 'Quiz: '}
                    {item.title}
                </Text>
            </TouchableOpacity>
        );
    };

    // Render module section
    const renderSection = (section: ModuleSection, index: number) => {
        const isExpanded = expandedSectionId === section.id;
        const hasItems = section.items && section.items.length > 0;
        const isLocked = section.isLocked;

        return (
            <View key={section.id} style={styles.sectionContainer}>
                <TouchableOpacity
                    style={[
                        styles.sectionHeader,
                        isExpanded && styles.sectionHeaderExpanded,
                    ]}
                    onPress={() => handleSectionPress(section.id, isLocked)}
                    activeOpacity={isLocked ? 1 : 0.7}
                >
                    <View style={styles.sectionIconContainer}>
                        {isLocked ? (
                            renderSectionLockIcon()
                        ) : (
                            renderChevronIcon(isExpanded)
                        )}
                    </View>
                    <Text
                        style={[
                            styles.sectionTitle,
                            isExpanded && styles.sectionTitleExpanded,
                        ]}
                        numberOfLines={2}
                    >
                        {section.title}
                    </Text>
                </TouchableOpacity>

                {/* Expanded items */}
                {isExpanded && hasItems && (
                    <View style={styles.itemsContainer}>
                        {section.items!.map(item => renderModuleItem(item, section.id))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Background overlay - tap to close */}
                <Pressable style={styles.backgroundOverlay} onPress={onClose} />

                {/* Drawer content */}
                <View style={styles.drawer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
                                {title}
                            </Text>
                            <Text style={styles.headerSubtitle} numberOfLines={1} ellipsizeMode="tail">
                                {subtitle}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            {renderCloseIcon()}
                        </TouchableOpacity>
                    </View>

                    {/* Sections list */}
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {sections.map((section, index) => renderSection(section, index))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(25, 26, 27, 0.6)',
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    drawer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '90%',
        maxWidth: 360,
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
    },
    headerTextContainer: {
        flex: 1,
        marginRight: 12,
    },
    headerTitle: {
        ...typography.p3Bold,
        color: colors.primaryDarkBlue,
        lineHeight: 23,
    },
    headerSubtitle: {
        ...typography.s1Regular,
        color: colors.textGrey,
        marginTop: 2,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.mainBgGrey,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 8,
    },
    sectionContainer: {
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    sectionHeaderExpanded: {
        backgroundColor: colors.highlightBlue,
    },
    sectionIconContainer: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        flex: 1,
        ...typography.p4SemiBold,
        color: colors.primaryDarkBlue,
        lineHeight: 20,
    },
    sectionTitleExpanded: {
        color: colors.primaryBlue,
    },
    chevronContainer: {
        width: 12,
        height: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chevronExpanded: {
        transform: [{ rotate: '90deg' }],
    },
    chevronLine1: {
        position: 'absolute',
        width: 6,
        height: 2,
        backgroundColor: colors.textGrey,
        borderRadius: 1,
        transform: [{ rotate: '45deg' }, { translateY: -2 }],
    },
    chevronLine2: {
        position: 'absolute',
        width: 6,
        height: 2,
        backgroundColor: colors.textGrey,
        borderRadius: 1,
        transform: [{ rotate: '-45deg' }, { translateY: 2 }],
    },
    sectionLockIcon: {
        width: 14,
        height: 16,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    lockBody: {
        width: 12,
        height: 9,
        backgroundColor: colors.textGrey,
        borderRadius: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    lockShackle: {
        position: 'absolute',
        top: -5,
        width: 8,
        height: 6,
        borderWidth: 2,
        borderColor: colors.textGrey,
        borderBottomWidth: 0,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        backgroundColor: 'transparent',
    },
    itemsContainer: {
        paddingLeft: 32,
        paddingBottom: 8,
    },
    moduleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 12,
    },
    moduleItemCurrent: {
        backgroundColor: colors.highlightBlue,
    },
    moduleItemIconContainer: {
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.successGreen,
    },
    currentCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: colors.lightGrey,
        backgroundColor: 'transparent',
    },
    lockIconContainer: {
        width: 12,
        height: 14,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    moduleItemText: {
        flex: 1,
        ...typography.p4,
        color: colors.primaryDarkBlue,
        lineHeight: 20,
    },
    moduleItemTextLocked: {
        color: colors.textGrey,
    },
});

export default AutomotiveHamburgerMenu;
