import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../components/SignUp/SignUpScreen';
import VerificationOTPScreen from '../screens/VerificationOTPScreen';
import PersonalDetailsScreen from '../screens/PersonalDetailsScreen';
import CollegeCourseDetailsScreen from '../screens/CollegeCourseDetailsScreen';
import AccountCreatedSuccessScreen from '../screens/AccountCreatedSuccessScreen';
import HomeScreen from '../screens/HomeScreen';
import AssessmentReportScreen from '../screens/AssessmentReportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditPersonalDetailsScreen from '../screens/EditPersonalDetailsScreen';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    VerificationOTP: undefined;
    PersonalDetails: undefined;
    CollegeCourseDetails: undefined;
    AccountCreatedSuccess: undefined;
    Home: undefined;
    AssessmentReport: { finalResult?: 'Pass' | 'Fail' } | undefined;
    Profile: undefined;
    EditPersonalDetails: undefined;
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
                <Stack.Screen name="AssessmentReport" component={AssessmentReportScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="EditPersonalDetails" component={EditPersonalDetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

