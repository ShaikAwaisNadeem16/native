import { create } from 'zustand';
import { HomeService } from '../api/home';

// Types matching API response
export interface Lesson {
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

export interface Module {
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

export interface CourseViewResponse {
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

interface CourseState {
    courseData: CourseViewResponse | null;
    currentCourseId: string | null;
    loading: boolean;
    error: string | null;
    fetchCourseView: (courseId: string) => Promise<void>;
    clearCourseData: () => void;
}

const useCourseStore = create<CourseState>((set, get) => ({
    courseData: null,
    currentCourseId: null,
    loading: false,
    error: null,

    fetchCourseView: async (courseId: string) => {
        // If we already have this course data, don't refetch
        if (get().currentCourseId === courseId && get().courseData) {
            console.log('[CourseStore] Course data already loaded for:', courseId);
            return;
        }

        set({ loading: true, error: null });

        try {
            console.log('[CourseStore] ===== FETCHING COURSE VIEW =====');
            console.log('[CourseStore] Course ID:', courseId);
            console.log('[CourseStore] Calling POST /api/lms/course/course-view...');
            
            const data = await HomeService.getCourseView(courseId);
            
            console.log('[CourseStore] ===== COURSE DATA RECEIVED =====');
            console.log('[CourseStore] Course name:', data?.name);
            console.log('[CourseStore] Course type:', data?.type);
            console.log('[CourseStore] Number of modules:', data?.module?.length || 0);
            console.log('[CourseStore] Full course data:', JSON.stringify(data, null, 2));
            console.log('[CourseStore] ===================================');
            
            set({
                courseData: data,
                currentCourseId: courseId,
                loading: false,
                error: null,
            });
        } catch (error: any) {
            console.error('[CourseStore] ===== FAILED TO FETCH COURSE VIEW =====');
            console.error('[CourseStore] Course ID:', courseId);
            console.error('[CourseStore] Error:', error);
            console.error('[CourseStore] Error message:', error?.message);
            console.error('[CourseStore] =========================================');
            set({
                error: error?.message || 'Failed to load course data',
                loading: false,
            });
        }
    },

    clearCourseData: () => {
        set({
            courseData: null,
            currentCourseId: null,
            error: null,
        });
    },
}));

export default useCourseStore;

