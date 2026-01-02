import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography, borderRadius } from '../../styles/theme';

interface EducationCardProps {
    title: string;
    subtitle: string;
    onEditPress?: () => void;
    onDeletePress?: () => void;
}

const EducationCard: React.FC<EducationCardProps> = ({
    title,
    subtitle,
    onEditPress,
    onDeletePress,
}) => {
    // Icon URLs from Figma
    const editIconUrl = 'https://www.figma.com/api/mcp/asset/2e220357-2e98-4db5-97c2-10580172208b';
    const deleteIconUrl = 'https://www.figma.com/api/mcp/asset/9e1ca4f5-6c43-4fe0-a209-aa97004f2fac';
    const ellipseUrl = 'https://www.figma.com/api/mcp/asset/c37516e5-ea86-4593-a0b0-32fd5388c673';

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title || ''}</Text>
                    <Text style={styles.subtitle}>{subtitle || ''}</Text>
                </View>
                <View style={styles.actionsContainer}>
                    {onEditPress && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={onEditPress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.iconBg}>
                                <Image
                                    source={{ uri: ellipseUrl }}
                                    style={styles.iconBgImage}
                                    resizeMode="cover"
                                />
                            </View>
                            <View style={styles.iconWrapper}>
                                <Image
                                    source={{ uri: editIconUrl }}
                                    style={styles.icon}
                                    resizeMode="contain"
                                />
                            </View>
                        </TouchableOpacity>
                    )}
                    {onDeletePress && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={onDeletePress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.iconBg}>
                                <Image
                                    source={{ uri: ellipseUrl }}
                                    style={styles.iconBgImage}
                                    resizeMode="cover"
                                />
                            </View>
                            <View style={styles.iconWrapper}>
                                <Image
                                    source={{ uri: deleteIconUrl }}
                                    style={styles.icon}
                                    resizeMode="contain"
                                />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.tableHeaderBlue, // #e6f3ff from Figma
        borderRadius: borderRadius.input,
        padding: 16,
        width: '100%',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        width: '100%',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
    },
    title: {
        ...typography.s2SemiBold,
        color: colors.primaryDarkBlue,
        lineHeight: 13,
    },
    subtitle: {
        ...typography.p4,
        color: colors.textGrey,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    iconButton: {
        width: 32,
        height: 32,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBg: {
        position: 'absolute',
        width: 32,
        height: 32,
        top: 0,
        left: 0,
    },
    iconBgImage: {
        width: '100%',
        height: '100%',
    },
    iconWrapper: {
        position: 'absolute',
        width: 24,
        height: 24,
        top: 4,
        left: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: '100%',
        height: '100%',
    },
});

export default EducationCard;





