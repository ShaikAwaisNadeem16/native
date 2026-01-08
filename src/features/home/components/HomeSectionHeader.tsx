import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../../styles/theme';

interface HomeSectionHeaderProps {
    title: string;
}

const HomeSectionHeader: React.FC<HomeSectionHeaderProps> = ({ title }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    title: {
        ...typography.h6,
        color: colors.black2 || colors.primaryDarkBlue,
        width: '100%',
    },
});

export default HomeSectionHeader;



