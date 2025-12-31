import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Flag } from 'lucide-react-native';
import { colors, typography, borderRadius } from '../styles/theme';
import Header from '../components/Home/Header';
import BreadcrumbBar from '../components/Assessment/BreadcrumbBar';
import SummaryTable from '../components/Assessment/SummaryTable';
import PrimaryButton from '../components/SignUp/PrimaryButton';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type AssessmentReportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AssessmentReport'>;
type AssessmentReportScreenRouteProp = RouteProp<RootStackParamList, 'AssessmentReport'>;

const AssessmentReportScreen: React.FC = () => {
    const navigation = useNavigation<AssessmentReportScreenNavigationProp>();
    const route = useRoute<AssessmentReportScreenRouteProp>();
    const finalResult = route.params?.finalResult || 'Pass';

    // Image URLs from Figma - Pass state
    const beepBeepUfoUrlPass = 'https://www.figma.com/api/mcp/asset/43e15497-a0c8-4a93-b014-584f7989a370';
    const backgroundMaskUrlPass = 'https://www.figma.com/api/mcp/asset/1d563758-c709-4185-88ac-8096e10838de';
    const checkIconUrl = 'https://www.figma.com/api/mcp/asset/8dffde8d-7800-4598-a4ea-5b361c0914e0';
    const checkIconBgUrl = 'https://www.figma.com/api/mcp/asset/ff1c9409-e67b-4c72-a4d5-e3bc1246a439';
    
    // Image URLs from Figma - Fail state (node 4559-37541)
    const beepBeepUfoUrlFail = 'https://www.figma.com/api/mcp/asset/1d509eec-19d7-4769-9c5e-8b1ab47c72a5';
    const backgroundMaskUrlFail = 'https://www.figma.com/api/mcp/asset/d083ee2a-42f4-4eeb-a5d9-87b698623d66';
    const failIconUrl = 'https://www.figma.com/api/mcp/asset/38b57fdd-a220-4e77-bad6-3559290714dd';
    const failIconBgUrl = 'https://www.figma.com/api/mcp/asset/105599bb-7485-4d07-a44f-ee258ba11426';

    const isPass = finalResult === 'Pass';
    const beepBeepUfoUrl = isPass ? beepBeepUfoUrlPass : beepBeepUfoUrlFail;
    const backgroundMaskUrl = isPass ? backgroundMaskUrlPass : backgroundMaskUrlFail;

    // Table data
    const tableData = [
        { testPart: 'Science', result: 'Pass' as const, score: '8/10' },
        { testPart: 'Technology', result: 'Fail' as const, score: '5/10' },
        { testPart: 'Engineering', result: 'Fail' as const, score: '5/10' },
        { testPart: 'Mathematics', result: 'Fail' as const, score: '5/10' },
    ];

    const handleBackToHomepage = () => {
        navigation.navigate('Home');
    };

    const handleGiveFeedback = () => {
        console.log('Give feedback pressed');
    };

    const handleReportIssue = () => {
        console.log('Report issue pressed');
    };

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header onProfilePress={handleProfilePress} />

            {/* Breadcrumb Bar */}
            <BreadcrumbBar items={['STEM Assessment Report']} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Assessment Report Card */}
                <View style={styles.reportCard}>
                    {/* Illustration */}
                    <View style={styles.illustrationContainer}>
                        <View style={styles.backgroundMaskContainer}>
                            <Image
                                source={{ uri: backgroundMaskUrl }}
                                style={styles.backgroundMask}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={styles.ufoContainer}>
                            <Image
                                source={{ uri: beepBeepUfoUrl }}
                                style={styles.ufoImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    {/* Content Section */}
                    <View style={styles.contentSection}>
                        {/* Title and Message */}
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>STEM Assessment Report</Text>
                            <Text style={styles.message}>
                                Congratulations on clearing the assessment!
                            </Text>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Statistics */}
                        <View style={styles.statisticsSection}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>FINAL RESULT</Text>
                                <View style={styles.resultContainer}>
                                    <View style={styles.resultIconContainer}>
                                        {isPass ? (
                                            <>
                                                <Image
                                                    source={{ uri: checkIconBgUrl }}
                                                    style={styles.resultIconBg}
                                                    resizeMode="contain"
                                                />
                                                <Image
                                                    source={{ uri: checkIconUrl }}
                                                    style={styles.resultIcon}
                                                    resizeMode="contain"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Image
                                                    source={{ uri: failIconBgUrl }}
                                                    style={styles.resultIconBg}
                                                    resizeMode="contain"
                                                />
                                                <Image
                                                    source={{ uri: failIconUrl }}
                                                    style={styles.resultIcon}
                                                    resizeMode="contain"
                                                />
                                            </>
                                        )}
                                    </View>
                                    <Text style={styles.resultText}>{finalResult}</Text>
                                </View>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>FINAL SCORE</Text>
                                <Text style={styles.scoreText}>82/100</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Summary Section */}
                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>Summary Of Your Attempt</Text>
                    <SummaryTable rows={tableData} />

                    {/* Action Buttons */}
                    <View style={styles.actionsSection}>
                        <PrimaryButton
                            label="Back To Homepage"
                            onPress={handleBackToHomepage}
                        />
                        <View style={styles.actionLinks}>
                            <TouchableOpacity
                                style={styles.actionLink}
                                onPress={handleGiveFeedback}
                                activeOpacity={0.7}
                            >
                                <Star size={24} color={colors.textGrey} />
                                <Text style={styles.actionLinkText}>Give Us Feeback</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionLink}
                                onPress={handleReportIssue}
                                activeOpacity={0.7}
                            >
                                <Flag size={24} color={colors.textGrey} />
                                <Text style={styles.actionLinkText}>Report An Issue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBgGrey,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
        gap: 16,
    },
    reportCard: {
        backgroundColor: colors.reportBlue,
        borderRadius: 16,
        padding: 24,
        gap: 20,
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    illustrationContainer: {
        width: 70,
        height: 70,
        position: 'relative',
        alignSelf: 'flex-start',
    },
    backgroundMaskContainer: {
        position: 'absolute',
        width: 60,
        height: 60,
        top: 5,
        left: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundMask: {
        width: '100%',
        height: '100%',
    },
    ufoContainer: {
        position: 'absolute',
        width: 102.864,
        height: 107.278,
        top: -18.639,
        left: -16.432,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ufoImage: {
        width: '100%',
        height: '100%',
    },
    contentSection: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    titleSection: {
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    title: {
        ...typography.h6,
        color: colors.white,
    },
    message: {
        ...typography.p4,
        color: colors.white,
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: colors.lightGrey,
        opacity: 0.3,
    },
    statisticsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
    },
    statItem: {
        flexDirection: 'column',
        gap: 0,
        alignItems: 'flex-start',
    },
    statLabel: {
        ...typography.s1Regular,
        color: colors.lightGrey,
        marginBottom: 0,
    },
    resultContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 0,
    },
    resultIconContainer: {
        width: 24,
        height: 24,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultIconBg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    resultIcon: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    resultText: {
        ...typography.h5,
        color: colors.white,
    },
    scoreText: {
        ...typography.p2Bold,
        color: colors.white,
    },
    summarySection: {
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    summaryTitle: {
        ...typography.p2Bold,
        color: colors.primaryDarkBlue,
    },
    actionsSection: {
        flexDirection: 'column',
        gap: 24,
        width: '100%',
    },
    actionLinks: {
        flexDirection: 'row',
        gap: 20,
        width: '100%',
    },
    actionLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionLinkText: {
        ...typography.p4,
        color: colors.textGrey,
    },
});

export default AssessmentReportScreen;

