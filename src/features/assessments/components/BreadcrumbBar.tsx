import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, typography } from '../../../styles/theme';
import CreamCollarCRLogo from '../../../components/common/CreamCollarCRLogo';
import GreaterIcon from '../../../components/common/GreaterIcon';

// Icons removed - will be added later

interface BreadcrumbBarProps {
    items: string[];
}

const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({ items }) => {

    return (
        <View style={styles.container}>
            {/* CC Logo Icon */}
            <View style={styles.logoContainer}>
                <CreamCollarCRLogo width={18} height={16} />
            </View>

            {/* Greater Icon after CR Logo */}
            <View style={styles.chevronContainer}>
                <GreaterIcon size={16} />
            </View>

            {/* Breadcrumb Items */}
            <View style={styles.breadcrumbContainer}>
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && (
                            <View style={styles.chevronContainer}>
                                <GreaterIcon size={16} />
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
        width: 18,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
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
    breadcrumbText: {
        ...typography.p4,
        color: colors.primaryDarkBlue,
    },
});

export default BreadcrumbBar;

