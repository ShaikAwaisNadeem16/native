import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors, typography } from '../../styles/theme';

interface BreadcrumbBarProps {
    items: string[];
}

const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({ items }) => {
    // CC Logo icon URL from Figma (node I8937:52717;951:8337) - img13
    const ccLogoIconUrl = 'https://www.figma.com/api/mcp/asset/2e220357-2e98-4db5-97c2-10580172208b';
    // Chevron icon URL from Figma (node I8937:52717;951:8386;3676:8182;2086:193656;2076:190532) - img14
    const chevronIconUrl = 'https://www.figma.com/api/mcp/asset/9e1ca4f5-6c43-4fe0-a209-aa97004f2fac';

    return (
        <View style={styles.container}>
            {/* CC Logo Icon */}
            <View style={styles.logoContainer}>
                <Image
                    source={{ uri: ccLogoIconUrl }}
                    style={styles.logoIcon}
                    resizeMode="contain"
                />
            </View>

            {/* Breadcrumb Items */}
            <View style={styles.breadcrumbContainer}>
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && (
                            <View style={styles.chevronContainer}>
                                <Image
                                    source={{ uri: chevronIconUrl }}
                                    style={styles.chevronIcon}
                                    resizeMode="contain"
                                />
                            </View>
                        )}
                        <Text style={styles.breadcrumbText}>{item}</Text>
                    </React.Fragment>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.mainBgGrey,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 5,
    },
    logoContainer: {
        width: 17.303,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoIcon: {
        width: '100%',
        height: '100%',
    },
    breadcrumbContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    chevronContainer: {
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chevronIcon: {
        width: '100%',
        height: '100%',
    },
    breadcrumbText: {
        ...typography.p4,
        color: colors.primaryDarkBlue,
    },
});

export default BreadcrumbBar;

