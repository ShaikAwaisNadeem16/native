import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AutomotiveAwarenessSection } from '../../components/automotive-awareness';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AutomotiveHamburgerMenu, {
    ModuleSection,
} from '../../components/course-details/AutomotiveHamburgerMenu';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AutomotiveAwareness'>;

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
 * AutomotiveAwarenessScreen
 * Screen component that renders the "Automotive Awareness" page
 * Shows list of course details items that can be clicked to navigate to CourseDetailsScreen
 */
const AutomotiveAwarenessScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
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

    const handleItemClick = (itemId: string) => {
        // Handle item click - navigate to Course Details screen
        console.log('Awareness item clicked:', itemId);
        navigation.navigate('CourseDetails', {
            courseId: itemId,
            courseTitle: 'Different Players In The Automotive Industry',
        });
    };

    const handleMenuItemPress = (sectionId: string, itemId: string) => {
        setIsMenuVisible(false);
        // Navigate to Course Details screen when clicking on menu items
        if (itemId === '2-2') {
            navigation.navigate('CourseDetails', {
                courseId: itemId,
                courseTitle: 'Different Players In The Automotive Industry',
            });
        }
        // Handle other items as needed
    };

    return (
        <>
            <AutomotiveAwarenessSection
                onProfilePress={handleProfilePress}
                onLogoPress={handleLogoPress}
                onItemClick={handleItemClick}
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
        </>
    );
};

export default AutomotiveAwarenessScreen;
