import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { CourseDetailsSection } from '../../components/course-details';
import Header from './components/Header';
import BreadcrumbBar from '../assessments/components/BreadcrumbBar';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../styles/theme';
import AutomotiveHamburgerMenu, {
    ModuleSection,
} from '../../components/course-details/AutomotiveHamburgerMenu';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CourseDetails'>;
type CourseDetailsRouteProp = RouteProp<RootStackParamList, 'CourseDetails'>;

// Course sections data for hamburger menu
const courseSections: ModuleSection[] = [
    {
        id: '1',
        title: 'Introduction to Automotive Industry',
        items: [],
    },
    {
        id: '2',
        title: 'Automotive Industry Value Chain',
        items: [
            { id: '2-1', title: 'Size of Industry', type: 'video', status: 'completed' },
            { id: '2-2', title: 'Different Players in the Automotive Industry', type: 'read', status: 'current' },
            { id: '2-3', title: 'Segments Of Automotive Industry', type: 'quiz', status: 'locked' },
        ],
    },
    { id: '3', title: 'Size of Automotive Industry', isLocked: true },
    { id: '4', title: 'Major Players and Regions', isLocked: true },
    { id: '5', title: 'Career Opportunities and Success Development', isLocked: true },
    { id: '6', title: 'Next Module', isLocked: true },
    { id: '7', title: 'Next Module', isLocked: true },
    { id: '8', title: 'Quiz', isLocked: true },
    { id: '9', title: 'Quiz', isLocked: true },
    { id: '10', title: 'Next Module', isLocked: true },
];

/**
 * CourseDetailsScreen
 * Screen component that renders the course details page based on Figma design
 * Shows video player, tabs (Transcript, Code Examples, Key points, etc.), and content
 */
const CourseDetailsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<CourseDetailsRouteProp>();
    const { courseId, courseTitle } = route.params || {};
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

    const handleLogoPress = () => {
        navigation.navigate('Home');
    };

    const handleMenuClose = () => {
        setIsMenuVisible(false);
    };

    const handleMenuItemPress = (sectionId: string, itemId: string) => {
        setIsMenuVisible(false);
        // Navigate to Read Different Players screen when clicking on that item
        if (itemId === '2-2') {
            navigation.navigate('ReadDifferentPlayers');
        }
        // Handle other items as needed
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                onProfilePress={handleProfilePress}
                onLogoPress={handleLogoPress}
            />
            <BreadcrumbBar
                items={['Your Learning Journey', 'Awareness On Automotive Industry']}
            />
            <CourseDetailsSection
                courseId={courseId}
                courseTitle={courseTitle || 'Different Players In The Automotive Industry'}
                moduleTitle="Awareness On Automotive Industry"
                moduleSubtitle="Automotive Industry Value Chain"
                onHamburgerPress={() => setIsMenuVisible(true)}
            />

            {/* Hamburger Menu Modal */}
            <AutomotiveHamburgerMenu
                visible={isMenuVisible}
                onClose={handleMenuClose}
                title="Awareness On Automotive Industry"
                subtitle="Automotive Industry Value Chain"
                sections={courseSections}
                onItemPress={handleMenuItemPress}
                initialExpandedSection="2"
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBgGrey,
    },
});

export default CourseDetailsScreen;

