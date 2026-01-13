import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../features/auth/login/LoginScreen';
import SignUpScreen from '../features/auth/signup/SignUpScreen';
import VerificationOTPScreen from '../features/auth/verification/VerificationOTPScreen';
import PersonalDetailsScreen from '../features/auth/personal-details/PersonalDetailsScreen';
import CollegeCourseDetailsScreen from '../features/auth/college-course/CollegeCourseDetailsScreen';
import AccountCreatedSuccessScreen from '../features/auth/account-created/AccountCreatedSuccessScreen';
import HomeScreen from '../features/home/HomeScreen';
import StemAssessmentReportScreen from '../features/assessments/StemAssessmentReportScreen';
import StemAssessmentInstructionsScreen from '../features/assessments/StemAssessmentInstructionsScreen';
import StemAssessmentTestScreen from '../features/assessments/StemAssessmentTestScreen';
import EngineeringSystemsAssessmentScreen from '../features/assessments/EngineeringSystemsAssessmentScreen';
import EngineeringAssessmentInstructionsScreen from '../features/assessments/EngineeringAssessmentInstructionsScreen';
import SurveyAssessmentQuestions from '../features/assessments/SurveyAssessmentQuestions';
import ProfileScreen from '../features/profile/ProfileScreen';
import EditPersonalDetailsScreen from '../features/profile/EditPersonalDetailsScreen';
import EditEducationDetailsScreen from '../features/profile/EditEducationDetailsScreen';
import EditWorkInternshipDetailsScreen from '../features/profile/EditWorkInternshipDetailsScreen';
import EditTechnicalCompetenciesScreen from '../features/profile/EditTechnicalCompetenciesScreen';
import EditCertificatesScreen from '../features/profile/EditCertificatesScreen';
import AutomotiveAwarenessScreen from '../features/home/AutomotiveAwarenessScreen';
import CourseDetailsScreen from '../features/home/CourseDetailsScreen';
import ReadDifferentPlayersScreen from '../features/home/ReadDifferentPlayersScreen';
import ReadingCompletionScreen from '../features/home/ReadingCompletionScreen';
import AutomotiveQuizInstructionsScreen from '../features/home/AutomotiveQuizInstructionsScreen';
import AutomotiveTestScreen from '../features/home/AutomotiveTestScreen';
import QuizCompletedScreen from '../features/home/QuizCompletedScreen';
import QuizFailedScreen from '../features/home/QuizFailedScreen';
import CourseCompletedScreen from '../features/home/CourseCompletedScreen';
import AssignmentInstructionsScreen from '../features/assignments/AssignmentInstructionsScreen';
import AssignmentAttemptScreen from '../features/assignments/AssignmentAttemptScreen';
import AssignmentSubmittedSuccessScreen from '../features/assignments/AssignmentSubmittedSuccessScreen';
import AssessmentClearedSuccessScreen from '../features/assessments/AssessmentClearedSuccessScreen';
import AssessmentFailedScreen from '../features/assessments/AssessmentFailedScreen';
import LearningPathScreen from '../features/home/LearningPathScreen';
import RoleRecommendationFAQScreen from '../features/home/RoleRecommendationFAQScreen';
import RoleRecommendationScreen from '../features/home/RoleRecommendationScreen';
import { AssignmentAttemptData, AssignmentAttemptInfo } from '../api/assignment';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    VerificationOTP: { 
        phoneNumber?: string; 
        email?: string;
        firstName?: string;
        lastName?: string;
        password?: string;
    };
    PersonalDetails: { email?: string } | undefined;
    CollegeCourseDetails: { 
        email?: string;
        firstName?: string;
        lastName?: string;
        mobileNumber?: string;
        password?: string;
        branches?: Array<{ branchId: number; branch: string }>;
    } | undefined;
    AccountCreatedSuccess: undefined;
    Home: undefined;
    StemAssessmentReport: { finalResult?: 'Pass' | 'Fail'; lessonId?: string; moodleCourseId?: string; assignmentData?: any; quizReportData?: any } | undefined;
    StemAssessmentInstructions: { lessonId?: string } | undefined;
    StemAssessmentTest: { lessonId?: string; moodleCourseId?: string } | undefined;
    EngineeringSystemsAssessment: undefined;
    EngineeringAssessmentInstructions: { lessonId?: string; moodleCourseId?: string; attemptId?: string } | undefined;
    SurveyAssessmentQuestions: { lessonId?: string; moodleCourseId?: string; attemptId?: string; questionData?: any; quizResult?: any } | undefined;
    Profile: undefined;
    EditPersonalDetails: undefined;
    EditEducationDetails: undefined;
    EditWorkInternshipDetails: undefined;
    EditTechnicalCompetencies: undefined;
    EditCertificates: undefined;
    AutomotiveAwareness: undefined;
    CourseDetails: { courseId?: string; courseTitle?: string; lessonId?: string; parentCourseId?: string } | undefined;
    ReadDifferentPlayers: { courseId?: string; lessonId?: string } | undefined;
    ReadingCompletion: { courseId?: string; lessonId?: string } | undefined;
    AutomotiveQuizInstructions: { courseId?: string; lessonId?: string } | undefined;
    AutomotiveTest: undefined;
    QuizCompleted: { accuracy: number; timeTaken: string } | undefined;
    QuizFailed: { accuracy: number; timeTaken: string } | undefined;
    CourseCompleted: { timeTaken: string } | undefined;
    AssignmentInstructions: { lessonId?: string; assignmentId?: string; moodleCourseId?: string } | undefined;
    AssignmentAttempt: {
        moodleCourseId?: string;
        assignData?: AssignmentAttemptData;
        attemptData?: AssignmentAttemptInfo;
    } | undefined;
    AssignmentSubmittedSuccess: {
        startTime?: string;
        submissionTime?: string;
    } | undefined;
    AssessmentClearedSuccess: {
        lessonId?: string;        // lessonId for "View Report" button
        moodleCourseId?: string;  // Alternative lessonId
        quizReportData?: any;     // Full quiz report data for "View Report" button
        finalResult?: 'Pass' | 'Fail';  // Final result status
        finalScore?: number;      // Percentage (e.g., 60)
        correctAnswers?: string;  // String format "40/60"
        timeTaken?: string;       // String format "01m 15s"
    } | undefined;
    AssessmentFailed: {
        lessonId?: string;        // lessonId to fetch data from API
        moodleCourseId?: string;  // Alternative lessonId
        quizReportData?: any;     // Full quiz report data for "View Report" button
        finalResult?: 'Pass' | 'Fail';  // Final result status
        finalScore?: number;      // Percentage (e.g., 30) - fallback if API fails
        correctAnswers?: string;  // String format "0/7" - fallback if API fails
        timeTaken?: string;       // String format "01m 15s" - fallback if API fails
        failMessage?: string;     // Fail message/reason from API - fallback if API fails
        cooldownDays?: number;    // Number of days for cooldown (e.g., 60) - fallback if API fails
        minimumScore?: number;    // Minimum score required (e.g., 50) - fallback if API fails
    } | undefined;
    LearningPath: { courseId: string } | undefined;
    RoleRecommendationFAQ: undefined;
    RoleRecommendation: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: '#f6f9fc' },
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={SignUpScreen} />
                <Stack.Screen name="VerificationOTP" component={VerificationOTPScreen} />
                <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
                <Stack.Screen name="CollegeCourseDetails" component={CollegeCourseDetailsScreen} />
                <Stack.Screen name="AccountCreatedSuccess" component={AccountCreatedSuccessScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="StemAssessmentReport" component={StemAssessmentReportScreen} />
                <Stack.Screen name="StemAssessmentInstructions" component={StemAssessmentInstructionsScreen} />
                <Stack.Screen name="StemAssessmentTest" component={StemAssessmentTestScreen} />
                <Stack.Screen name="EngineeringSystemsAssessment" component={EngineeringSystemsAssessmentScreen} />
                <Stack.Screen name="EngineeringAssessmentInstructions" component={EngineeringAssessmentInstructionsScreen} />
                <Stack.Screen name="SurveyAssessmentQuestions" component={SurveyAssessmentQuestions} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="EditPersonalDetails" component={EditPersonalDetailsScreen} />
                <Stack.Screen name="EditEducationDetails" component={EditEducationDetailsScreen} />
                <Stack.Screen name="EditWorkInternshipDetails" component={EditWorkInternshipDetailsScreen} />
                <Stack.Screen name="EditTechnicalCompetencies" component={EditTechnicalCompetenciesScreen} />
                <Stack.Screen name="EditCertificates" component={EditCertificatesScreen} />
                <Stack.Screen name="AutomotiveAwareness" component={AutomotiveAwarenessScreen} />
                <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
                <Stack.Screen name="ReadDifferentPlayers" component={ReadDifferentPlayersScreen} />
                <Stack.Screen name="ReadingCompletion" component={ReadingCompletionScreen} />
                <Stack.Screen name="AutomotiveQuizInstructions" component={AutomotiveQuizInstructionsScreen} />
                <Stack.Screen name="AutomotiveTest" component={AutomotiveTestScreen} />
                <Stack.Screen name="QuizCompleted" component={QuizCompletedScreen} />
                <Stack.Screen name="QuizFailed" component={QuizFailedScreen} />
                <Stack.Screen name="CourseCompleted" component={CourseCompletedScreen} />
                <Stack.Screen name="AssignmentInstructions" component={AssignmentInstructionsScreen} />
                <Stack.Screen name="AssignmentAttempt" component={AssignmentAttemptScreen} />
                <Stack.Screen name="AssignmentSubmittedSuccess" component={AssignmentSubmittedSuccessScreen} />
                <Stack.Screen name="AssessmentClearedSuccess" component={AssessmentClearedSuccessScreen} />
                <Stack.Screen name="AssessmentFailed" component={AssessmentFailedScreen} />
                <Stack.Screen name="LearningPath" component={LearningPathScreen} />
                <Stack.Screen name="RoleRecommendationFAQ" component={RoleRecommendationFAQScreen} />
                <Stack.Screen name="RoleRecommendation" component={RoleRecommendationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

