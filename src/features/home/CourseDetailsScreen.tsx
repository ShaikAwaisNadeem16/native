import React, { useState, useEffect } from 'react';
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
import { HomeService } from '../../api/home';
import { transformCourseDataToMenuSections, getCourseMenuTitle } from '../../utils/courseDataTransform';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CourseDetails'>;
type CourseDetailsRouteProp = RouteProp<RootStackParamList, 'CourseDetails'>;

/**
 * CourseDetailsScreen
 * Screen component that renders the course details page based on Figma design
 * Shows video player, tabs (Transcript, Code Examples, Key points, etc.), and content
 */
const CourseDetailsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<CourseDetailsRouteProp>();
    const { courseId, courseTitle, lessonId, parentCourseId } = route.params || {};
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [courseSections, setCourseSections] = useState<ModuleSection[]>([]);
    const [menuTitle, setMenuTitle] = useState('Awareness On Automotive Industry');
    const [menuSubtitle, setMenuSubtitle] = useState('Automotive Industry Value Chain');

    // Fetch course data for hamburger menu if parentCourseId is available
    useEffect(() => {
        if (parentCourseId) {
            fetchCourseData();
        }
    }, [parentCourseId]);

    const fetchCourseData = async () => {
        try {
            const courseData = await HomeService.getCourseView(parentCourseId);
            console.log('[CourseDetails] Course data fetched:', JSON.stringify(courseData, null, 2));
            
            const sections = transformCourseDataToMenuSections(courseData, lessonId || courseId);
            setCourseSections(sections);
            
            const { title, subtitle } = getCourseMenuTitle(courseData);
            setMenuTitle(title);
            setMenuSubtitle(subtitle);
        } catch (error: any) {
            console.error('[CourseDetails] Failed to fetch course data:', error);
        }
    };

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
        
        const parts = itemId.split('-');
        if (parts.length >= 2) {
            const extractedLessonId = parts.slice(1).join('-');
            
            let lessonType: string | null = null;
            for (const section of courseSections) {
                const item = section.items?.find(item => item.id === itemId);
                if (item) {
                    lessonType = item.type;
                    break;
                }
            }
            
            if (lessonType === 'video') {
                navigation.navigate('CourseDetails', {
                    courseId: extractedLessonId,
                    courseTitle: courseSections.find(s => s.items?.some(i => i.id === itemId))?.items?.find(i => i.id === itemId)?.title || '',
                    parentCourseId,
                });
            } else if (lessonType === 'read') {
                navigation.navigate('ReadDifferentPlayers', {
                    courseId: parentCourseId,
                    lessonId: extractedLessonId,
                });
            } else if (lessonType === 'quiz') {
                navigation.navigate('EngineeringAssessmentInstructions', {
                    lessonId: extractedLessonId,
                    moodleCourseId: parentCourseId,
                });
            }
        }
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
                title={menuTitle}
                subtitle={menuSubtitle}
                sections={courseSections}
                onItemPress={handleMenuItemPress}
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

