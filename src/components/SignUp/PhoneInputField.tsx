import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

interface PhoneInputFieldProps {
    value: string;
    onChangeText: (text: string) => void;
    countryCode?: string;
    countryFlag?: string;
    error?: string;
    disabled?: boolean;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({ 
    value, 
    onChangeText, 
    countryCode = '+91',
    countryFlag = 'https://www.figma.com/api/mcp/asset/6c4d43ed-16ac-4867-a1e9-20b023ca4da8', // India flag from Figma
    error,
    disabled = false
}) => {
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    return (
        <View style={styles.container}>
            <View style={[
                styles.inputContainer, 
                error && styles.inputContainerError,
                disabled && styles.inputContainerDisabled
            ]}>
                <View style={styles.countryCodeContainer}>
                    <View style={styles.countryCodeWrapper}>
                        <Image 
                            source={{ uri: countryFlag }} 
                            style={styles.flagIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.countryCodeText}>{countryCode}</Text>
                        <TouchableOpacity 
                            style={styles.chevronContainer}
                            onPress={() => setShowCountryPicker(!showCountryPicker)}
                        >
                            <ChevronDown size={24} color={colors.textGrey} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.divider} />
                </View>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder="Mobile Number"
                    placeholderTextColor={colors.placeholderGrey}
                    keyboardType="phone-pad"
                    autoCorrect={false}
                    editable={!disabled}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: borderRadius.input,
        paddingHorizontal: spacing.inputPaddingH,
        paddingVertical: spacing.inputPaddingV,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputContainerError: {
        borderColor: colors.error,
    },
    inputContainerDisabled: {
        backgroundColor: '#ededed', // Exact grey from Figma
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 16,
    },
    countryCodeWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    flagIcon: {
        width: 24,
        height: 24,
    },
    countryCodeText: {
        ...typography.p4,
        color: colors.textGrey,
    },
    chevronContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: colors.lightGrey,
        marginLeft: 16,
    },
    input: {
        ...typography.p4,
        color: colors.textGrey,
        flex: 1,
        padding: 0,
        margin: 0,
        minHeight: 24,
    },
    errorText: {
        ...typography.s1Regular,
        color: colors.error,
        marginTop: spacing.titleSubtitleGap,
    },
});

export default PhoneInputField;

