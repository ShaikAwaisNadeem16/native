import { ModuleSection, ModuleItem, ModuleItemStatus } from '../components/course-details/AutomotiveHamburgerMenu';
import { CourseViewResponse, Lesson, Module } from '../store/useCourseStore';

/**
 * Transform lesson type to hamburger menu item type
 */
const getLessonTypeForMenu = (lessonType: string, type: string): 'video' | 'read' | 'quiz' => {
    if (lessonType === 'video' || type === 'videoPage') return 'video';
    if (lessonType === 'article' || type === 'article') return 'read';
    if (lessonType === 'quiz' || lessonType === 'nongraded' || lessonType === 'graded' || type === 'quiz') return 'quiz';
    if (lessonType === 'assignment' || type === 'assign') return 'quiz'; // Assignments shown as quiz in menu
    return 'read'; // Default to read
};

/**
 * Determine lesson status for hamburger menu
 * CRITICAL: Uses API flags - do NOT guess unlock logic
 */
const getLessonStatus = (lesson: Lesson, currentLessonId?: string): ModuleItemStatus => {
    // CRITICAL: Locked lessons are always locked (from API) - check this FIRST
    if (lesson.isLocked === true) {
        return 'locked';
    }
    
    // Current lesson is marked as current
    if (lesson.lessonId === currentLessonId) {
        return 'current';
    }
    
    // Completed lessons (from API completionStatus or completedAt)
    if (lesson.completionStatus === 'completed' || lesson.completedAt) {
        return 'completed';
    }
    
    // Unlocked but not completed = current (available to access)
    return 'current';
};

/**
 * Transform course data from API to ModuleSection format for hamburger menu
 * Uses API locking flags from course data
 */
export const transformCourseDataToMenuSections = (
    courseData: CourseViewResponse,
    currentLessonId?: string
): ModuleSection[] => {
    if (!courseData?.module || courseData.module.length === 0) {
        console.log('[courseDataTransform] No modules found in course data');
        return [];
    }

    console.log('[courseDataTransform] ===== TRANSFORMING COURSE DATA TO MENU SECTIONS =====');
    console.log('[courseDataTransform] Course name:', courseData.name);
    console.log('[courseDataTransform] Number of modules:', courseData.module.length);

    const sections = courseData.module.map((module, index) => {
        console.log(`[courseDataTransform] Module ${index + 1}:`, {
            unitId: module.unitId,
            name: module.name,
            summary: module.summary,
            duration: module.duration,
            isLocked: module.isLocked,
            lessonsCount: module.lessons?.length || 0,
        });

        const items: ModuleItem[] = module.lessons.map((lesson) => {
            const item = {
                id: `${module.unitId}-${lesson.lessonId}`,
                title: lesson.name || 'Untitled Lesson',
                type: getLessonTypeForMenu(lesson.lessonType, lesson.type),
                status: getLessonStatus(lesson, currentLessonId), // Use API flags to determine status
            };
            
            console.log(`[courseDataTransform]   Lesson:`, {
                lessonId: lesson.lessonId,
                name: lesson.name,
                sub: lesson.sub,
                type: item.type,
                status: item.status,
                isLocked: lesson.isLocked,
            });
            
            return item;
        });

        return {
            id: module.unitId || `module-${index}`,
            title: module.name || 'Untitled Module',
            items: items.length > 0 ? items : undefined,
            isLocked: module.isLocked || false, // Use API flag from course data
        };
    });

    console.log('[courseDataTransform] Transformed sections:', JSON.stringify(sections, null, 2));
    return sections;
};

/**
 * Get course title and subtitle from course data
 */
export const getCourseMenuTitle = (courseData: CourseViewResponse): { title: string; subtitle: string } => {
    return {
        title: courseData.name || 'Automotive Awareness Course',
        subtitle: courseData.module && courseData.module.length > 0 
            ? courseData.module[0].name 
            : 'Automotive Industry Value Chain',
    };
};


