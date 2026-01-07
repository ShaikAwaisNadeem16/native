import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors, typography } from '../../../styles/theme';

// Icons removed - will be added later

interface BreadcrumbBarProps {
    items: string[];
}

const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({ items }) => {

    return (
        <View style={styles.container}>
            {/* CC Logo Icon - placeholder */}
            <View style={styles.logoContainer}>
                <View style={styles.logoIcon} />
            </View>

            {/* Breadcrumb Items */}
            <View style={styles.breadcrumbContainer}>
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && (
                            <View style={styles.chevronContainer}>
                                <ChevronRight size={16} color={colors.primaryDarkBlue} />
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

