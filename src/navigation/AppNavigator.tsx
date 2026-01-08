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
import ProfileScreen from '../features/profile/ProfileScreen';
import EditPersonalDetailsScreen from '../features/profile/EditPersonalDetailsScreen';
import EditEducationDetailsScreen from '../features/profile/EditEducationDetailsScreen';
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
import { AssignmentAttemptData, AssignmentAttemptInfo } from '../api/assignment';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    VerificationOTP: undefined;
    PersonalDetails: undefined;
    CollegeCourseDetails: undefined;
    AccountCreatedSuccess: undefined;
    Home: undefined;
    StemAssessmentReport: { finalResult?: 'Pass' | 'Fail'; lessonId?: string; moodleCourseId?: string } | undefined;
    StemAssessmentInstructions: undefined;
    StemAssessmentTest: { lessonId?: string; moodleCourseId?: string } | undefined;
    EngineeringSystemsAssessment: undefined;
    Profile: undefined;
    EditPersonalDetails: undefined;
    EditEducationDetails: undefined;
    AutomotiveAwareness: undefined;
    CourseDetails: { courseId?: string; courseTitle?: string } | undefined;
    ReadDifferentPlayers: undefined;
    ReadingCompletion: undefined;
    AutomotiveQuizInstructions: undefined;
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
        finalScore?: number;      // Percentage (e.g., 60)
        correctAnswers?: string;  // String format "40/60"
        timeTaken?: string;       // String format "01m 15s"
    } | undefined;
    AssessmentFailed: {
        finalScore?: number;      // Percentage (e.g., 30)
        correctAnswers?: string;  // String format "40/60"
        timeTaken?: string;       // String format "01m 15s"
        failMessage?: string;     // Fail message/reason from API
        cooldownDays?: number;    // Number of days for cooldown (e.g., 60)
        minimumScore?: number;    // Minimum score required (e.g., 50)
    } | undefined;
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
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="EditPersonalDetails" component={EditPersonalDetailsScreen} />
                <Stack.Screen name="EditEducationDetails" component={EditEducationDetailsScreen} />
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
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

