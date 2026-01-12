import { ModuleSection, ModuleItem, ModuleItemStatus } from '../components/course-details/AutomotiveHamburgerMenu';

// Types matching LearningPathScreen
interface Lesson {
    lessonId: string;
    type: string;
    name: string;
    isLocked: boolean;
    lessonType: string;
    sub: string;
    order: number;
    url: string;
    duration: string;
    category: string | null;
    globalOrder: number;
    completionStatus?: string;
    completedAt?: string | null;
}

interface Module {
    unitId: string;
    order: number;
    skills: Record<string, any>;
    modules: number;
    summary: string;
    name: string;
    duration: string;
    durationInHrs: string;
    rawDuration: number;
    lessons: Lesson[];
    isLocked: boolean;
}

interface CourseViewResponse {
    id: string;
    name: string;
    type: string;
    summary: string;
    is_reviewed: boolean;
    lockLessons: boolean;
    learningJourney: boolean;
    duration: string;
    duartionInHr: string;
    module: Module[];
    noOfModules: number;
    skills: string[];
    can_review: boolean;
    resume1?: {
        lessonId: string;
        globalOrder: number;
        completedAt: string;
        lessonType: string;
        name: string;
    };
    resumeUrl: string;
    timeTaken: string;
    percent: number;
}

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
 */
const getLessonStatus = (lesson: Lesson, currentLessonId?: string): ModuleItemStatus => {
    if (lesson.isLocked) return 'locked';
    if (lesson.lessonId === currentLessonId) return 'current';
    if (lesson.completionStatus === 'completed' || lesson.completedAt) return 'completed';
    return 'current'; // Default to current if not locked
};

/**
 * Transform course data from API to ModuleSection format for hamburger menu
 */
export const transformCourseDataToMenuSections = (
    courseData: CourseViewResponse,
    currentLessonId?: string
): ModuleSection[] => {
    if (!courseData?.module || courseData.module.length === 0) {
        return [];
    }

    return courseData.module.map((module, index) => {
        const items: ModuleItem[] = module.lessons.map((lesson) => ({
            id: `${module.unitId}-${lesson.lessonId}`,
            title: lesson.name,
            type: getLessonTypeForMenu(lesson.lessonType, lesson.type),
            status: getLessonStatus(lesson, currentLessonId),
        }));

        return {
            id: module.unitId || `module-${index}`,
            title: module.name,
            items: items.length > 0 ? items : undefined,
            isLocked: module.isLocked,
        };
    });
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

