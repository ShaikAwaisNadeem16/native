import GlobalAxiosConfig from './GlobalAxiosConfig';
import Storage from '../utils/storage';

/**
 * Assignment Attempt Response Types
 *
 * IMPORTANT: For all assignment attempt APIs, use moodleCourseId from Courses.moodleCourseId
 * as the value for the "lessonId" field. Do NOT use LID-xxxx from lesson.
 *
 * API field is "lessonId" but VALUE comes from Courses.moodleCourseId
 */
export interface AssignmentAttemptData {
    title: string;
    description: string;
    brief?: string;
    instructions?: string;
    maxCharacters?: number;
    allowedFileTypes?: string[];
    maxFileSize?: number;
}

export interface AssignmentAttemptInfo {
    status: 'not_started' | 'in_progress' | 'submitted' | 'evaluated';
    startTime?: string;
    deadline: string;
    fileStatus?: 'none' | 'uploaded' | 'pending' | 'not uploaded';
    file?: string | null;
    fileIds?: string[];
    is_draft: boolean;
    evaluated: boolean;
    submissionText?: string;
    uploadedFileName?: string;
}

export interface StartAssignmentResponse {
    id?: string;
    status?: string;
    startTime?: string;
    endTime?: string | null;
    lastAccess?: string | null;
    fileStatus?: string;
    file?: string | null;
    text?: string | null;
    url?: string | null;
    fileIds?: string[];
    is_draft?: boolean;
    evaluated?: boolean;
    evaluatedBy?: string | null;
    evaluateOn?: string | null;
    evaluation?: any;
    attemptCount?: number;
    deadline?: string;
    duration?: string | null;
    breif?: string; // Note: API has typo "breif" instead of "brief"
    assign_data?: {
        studentData?: {
            status?: string;
            startedAt?: string | null;
        };
        assign_data?: {
            shortName?: string;
            title?: string;
            duration?: string;
            description?: string;
            assignmentDetails?: any;
            html?: string;
            terms?: string;
            btntext?: string;
        };
    };
}

export interface SaveDraftPayload {
    lessonId: string;
    userId: string;
    submissionText: string;
    fileName?: string;
}

export interface SubmitAssignmentPayload {
    lessonId: string;
    userId: string;
    submissionText: string;
    fileName?: string;
}

export const AssignmentService = {
    /**
     * POST /api/lms/lesson/contents
     * Fetches assignment content and instructions
     * Request body: { lessonId: string, userId: string }
     */
    /**
     * POST /api/lms/lesson/contents
     * Fetches assignment content and instructions
     * Request body: { lessonId: string, userId: string }
     * This API is used when viewing assignment submission
     */
    getLessonContents: async (lessonId: string) => {
        try {
            const userId = await Storage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found');
            }

            console.log('[AssignmentService] ===== CALLING LESSON CONTENTS API =====');
            console.log('[AssignmentService] API: POST /api/lms/lesson/contents');
            console.log('[AssignmentService] Purpose: Fetch assignment details for view submission');
            console.log('[AssignmentService] lessonId:', lessonId);
            console.log('[AssignmentService] userId:', userId);

            const payload = { lessonId, userId };
            console.log('[AssignmentService] Request payload:', JSON.stringify(payload, null, 2));

            const response = await GlobalAxiosConfig.post(
                '/api/lms/lesson/contents',
                payload
            );

            console.log('[AssignmentService] ===== LESSON CONTENTS API RESPONSE =====');
            console.log('[AssignmentService] Response status:', response.status);
            console.log('[AssignmentService] Response keys:', response.data ? Object.keys(response.data) : 'null/undefined');
            console.log('[AssignmentService] Full response:', JSON.stringify(response.data, null, 2));
            
            // Log key fields from response
            if (response.data) {
                console.log('[AssignmentService] assign_data:', response.data.assign_data);
                console.log('[AssignmentService] assign_data.assign_data:', response.data.assign_data?.assign_data);
                console.log('[AssignmentService] studentData:', response.data.assign_data?.studentData);
            }
            console.log('[AssignmentService] ========================================');
            
            return response.data;
        } catch (error: any) {
            console.error('[AssignmentService] ===== LESSON CONTENTS API ERROR =====');
            console.error('[AssignmentService] Failed to fetch lesson contents:', error);
            console.error('[AssignmentService] Error message:', error?.message);
            console.error('[AssignmentService] Error response:', error?.response?.data);
            console.error('[AssignmentService] Error status:', error?.response?.status);
            console.error('[AssignmentService] =====================================');
            throw error;
        }
    },

    /**
     * POST /api/lms/v1/attempt/assignment
     * Starts an assignment attempt and gets attempt summary
     * Request body: { lessonId: <moodleCourseId>, page: "attempt-summary", userId: string }
     *
     * IMPORTANT: Pass moodleCourseId (from Courses.moodleCourseId) as the parameter.
     * The API field is "lessonId" but the VALUE comes from moodleCourseId.
     *
     * This API is called when user clicks "Start Assignment" button.
     * Returns assignment data and attempt details needed for the submission screen.
     *
     * Response includes:
     * - status, startTime, deadline, fileStatus, is_draft, evaluated
     * - breif (assignment brief text)
     * - assign_data.assign_data (title, description, html, terms, btntext)
     */
    startAssignment: async (moodleCourseId: string): Promise<StartAssignmentResponse> => {
        try {
            const userId = await Storage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found');
            }

            // API field is "lessonId" but VALUE comes from moodleCourseId
            // Use page: "attempt-summary" to get/start the assignment attempt
            const payload = { 
                lessonId: moodleCourseId, 
                page: 'attempt-summary', 
                userId 
            };
            console.log('[AssignmentService] Start Assignment payload (using moodleCourseId):', JSON.stringify(payload, null, 2));

            const response = await GlobalAxiosConfig.post(
                '/api/lms/v1/attempt/assignment',
                payload
            );

            console.log('[AssignmentService] Start Assignment response:', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error: any) {
            console.error('[AssignmentService] Failed to start assignment:', error);
            console.error('[AssignmentService] Error response:', error?.response?.data);
            console.error('[AssignmentService] Error status:', error?.response?.status);
            throw error;
        }
    },

    /**
     * POST /api/lms/v1/attempt/assignment
     * Gets assignment attempt summary
     * Request body: { lessonId: <moodleCourseId>, page: "attempt-summary", userId: string }
     *
     * IMPORTANT: Pass moodleCourseId (from Courses.moodleCourseId) in the lessonId field.
     */
    getAttemptSummary: async (moodleCourseId: string) => {
        try {
            const userId = await Storage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found');
            }

            // API field is "lessonId" but VALUE comes from moodleCourseId
            const payload = { lessonId: moodleCourseId, page: 'attempt-summary', userId };
            console.log('[AssignmentService] Get Attempt Summary payload (using moodleCourseId):', JSON.stringify(payload, null, 2));

            const response = await GlobalAxiosConfig.post(
                '/api/lms/v1/attempt/assignment',
                payload
            );

            console.log('[AssignmentService] Get Attempt Summary response:', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error: any) {
            console.error('[AssignmentService] Failed to get attempt summary:', error);
            throw error;
        }
    },

    /**
     * POST /api/lms/v1/attempt/assignment
     * Saves assignment as draft
     * Request body: { lessonId: <moodleCourseId>, page: "save_draft", userId: string, submissionText: string, fileName?: string }
     *
     * IMPORTANT: The lessonId field should contain moodleCourseId value (from Courses.moodleCourseId).
     */
    saveDraft: async (payload: SaveDraftPayload) => {
        try {
            const requestPayload = {
                ...payload,
                page: 'save_draft',
            };
            console.log('[AssignmentService] Save Draft payload:', JSON.stringify(requestPayload, null, 2));

            const response = await GlobalAxiosConfig.post(
                '/api/lms/v1/attempt/assignment',
                requestPayload
            );

            console.log('[AssignmentService] Save Draft response:', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error: any) {
            console.error('[AssignmentService] Failed to save draft:', error);
            throw error;
        }
    },

    /**
     * POST /api/lms/v1/attempt/assignment
     * Submits assignment permanently
     * Request body: { lessonId: <moodleCourseId>, page: "submit", userId: string, submissionText: string, fileName?: string }
     *
     * IMPORTANT: The lessonId field should contain moodleCourseId value (from Courses.moodleCourseId).
     */
    submitAssignment: async (payload: SubmitAssignmentPayload) => {
        try {
            const requestPayload = {
                ...payload,
                page: 'submit',
            };
            console.log('[AssignmentService] Submit Assignment payload:', JSON.stringify(requestPayload, null, 2));

            const response = await GlobalAxiosConfig.post(
                '/api/lms/v1/attempt/assignment',
                requestPayload
            );

            console.log('[AssignmentService] Submit Assignment response:', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error: any) {
            console.error('[AssignmentService] Failed to submit assignment:', error);
            throw error;
        }
    },
};

export default AssignmentService;
