import GlobalAxiosConfig from './GlobalAxiosConfig';
import Storage from '../utils/storage';

export const AssessmentService = {
    /**
     * POST /api/lms/attempt/quiz
     * Attempt quiz API - used for STEM Assessment
     * Can be called with different page values: "start", "question-submit", "quiz-submit", "score"
     */
    attemptQuiz: async (payload: {
        page: 'start' | 'question-submit' | 'quiz-submit' | 'score';
        userId?: string;
        lessonId?: string;
        attemptId?: string;
        questionId?: string;
        chosenAnswer?: string[];
        status?: 'submitted' | 'toReview' | 'notSubmitted';
        qdata?: Array<{
            questionId: string;
            chosenAnswer: string[];
            status: 'submitted' | 'toReview' | 'notSubmitted';
            section?: string;
        }>;
    }) => {
        try {
            // If userId is not provided, fetch from storage
            if (!payload.userId) {
                const userId = await Storage.getItem('userId');
                if (userId) {
                    payload.userId = userId;
                }
            }

            console.log('========================================');
            console.log('[AssessmentService] ===== ATTEMPT QUIZ API CALL =====');
            console.log('[AssessmentService] Endpoint: POST /api/lms/attempt/quiz');
            console.log('[AssessmentService] Request payload:', JSON.stringify(payload, null, 2));
            console.log('[AssessmentService] Page:', payload.page);
            console.log('[AssessmentService] LessonId:', payload.lessonId);
            console.log('[AssessmentService] UserId:', payload.userId);
            console.log('[AssessmentService] AttemptId:', payload.attemptId);

            const response = await GlobalAxiosConfig.post(
                '/api/lms/attempt/quiz',
                payload
            );

            console.log('[AssessmentService] ===== ATTEMPT QUIZ API RESPONSE =====');
            console.log('[AssessmentService] Response status:', response.status);
            console.log('[AssessmentService] Full response.data:', JSON.stringify(response.data, null, 2));
            console.log('[AssessmentService] Response keys:', response.data ? Object.keys(response.data) : 'null/undefined');
            
            // Log questionData if present
            if (response.data?.questionData) {
                console.log('[AssessmentService] QuestionData exists');
                console.log('[AssessmentService] QuestionData sections:', Object.keys(response.data.questionData));
                Object.keys(response.data.questionData).forEach((section) => {
                    const questions = response.data.questionData[section];
                    console.log(`[AssessmentService] Section "${section}": ${Array.isArray(questions) ? questions.length : 0} questions`);
                });
            }
            
            // Log attemptId and result
            if (response.data?.attemptId) {
                console.log('[AssessmentService] AttemptId:', response.data.attemptId);
            }
            if (response.data?.result) {
                console.log('[AssessmentService] Result:', JSON.stringify(response.data.result, null, 2));
            }
            console.log('========================================');

            return response.data;
        } catch (error: any) {
            console.error('========================================');
            console.error('[AssessmentService] ===== ATTEMPT QUIZ API ERROR =====');
            console.error('[AssessmentService] Error message:', error?.message);
            console.error('[AssessmentService] Error response:', error?.response ? JSON.stringify(error.response, null, 2) : 'No response');
            console.error('[AssessmentService] Error response data:', error?.response?.data ? JSON.stringify(error.response.data, null, 2) : 'No response data');
            console.error('[AssessmentService] Error response status:', error?.response?.status);
            console.error('[AssessmentService] Full error object:', JSON.stringify(error, null, 2));
            console.error('========================================');
            throw error;
        }
    },

    /**
     * POST /api/lms/lesson/contents
     * Fetches lesson contents for assessment/quiz instructions
     * Request body: { lessonId: string, userId: string }
     * Note: lessonId is actually the moodleCourseId
     */
    getLessonContents: async (lessonId: string) => {
        try {
            const userId = await Storage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found');
            }

            if (!lessonId) {
                throw new Error('Lesson ID is required');
            }

            console.log('[AssessmentService] ===== CALLING LESSON CONTENTS API =====');
            console.log('[AssessmentService] API: POST /api/lms/lesson/contents');
            console.log('[AssessmentService] getLessonContents - lessonId:', lessonId);
            console.log('[AssessmentService] getLessonContents - userId:', userId);

            const requestPayload = { lessonId, userId };
            console.log('[AssessmentService] getLessonContents - Request payload:', JSON.stringify(requestPayload, null, 2));

            const response = await GlobalAxiosConfig.post(
                '/api/lms/lesson/contents',
                requestPayload
            );

            console.log('[AssessmentService] ===== LESSON CONTENTS API RESPONSE =====');
            console.log('[AssessmentService] getLessonContents - Response status:', response.status);
            console.log('[AssessmentService] getLessonContents - Full response.data:', JSON.stringify(response.data, null, 2));
            console.log('[AssessmentService] Response keys:', response.data ? Object.keys(response.data) : 'null/undefined');
            
            // Return the response data (may be wrapped in quiz_data or directly available)
            const responseData = response.data?.quiz_data || response.data;
            console.log('[AssessmentService] Returning data:', JSON.stringify(responseData, null, 2));
            console.log('[AssessmentService] =========================================');
            
            return responseData;
        } catch (error: any) {
            console.error('[AssessmentService] ===== LESSON CONTENTS API ERROR =====');
            console.error('[AssessmentService] getLessonContents - Error occurred:', error);
            console.error('[AssessmentService] getLessonContents - Error message:', error?.message);
            console.error('[AssessmentService] getLessonContents - Error response:', error?.response?.data);
            console.error('[AssessmentService] getLessonContents - Error status:', error?.response?.status);
            console.error('[AssessmentService] =====================================');
            throw error;
        }
    },

    /**
     * POST /api/lms/lesson/contents
     * Fetches lesson contents for STEM assessment
     * Request body: { lessonId: string, userId: string }
     * Response structure: { quiz_data: { ... } }
     */
    getStemLessonContents: async (lessonId: string) => {
        try {
            const userId = await Storage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found');
            }

            if (!lessonId) {
                throw new Error('Lesson ID is required');
            }

            console.log('[AssessmentService] getStemLessonContents - lessonId:', lessonId);
            console.log('[AssessmentService] getStemLessonContents - userId:', userId);

            const requestPayload = { lessonId, userId };
            console.log('[AssessmentService] getStemLessonContents - Request payload:', JSON.stringify(requestPayload, null, 2));

            const response = await GlobalAxiosConfig.post(
                '/api/lms/lesson/contents',
                requestPayload
            );

            console.log('[AssessmentService] getStemLessonContents - Response status:', response.status);
            console.log('[AssessmentService] getStemLessonContents - Full response.data:', JSON.stringify(response.data, null, 2));

            // Return quiz_data if it exists, otherwise return the full response
            return response.data?.quiz_data || response.data;
        } catch (error: any) {
            console.error('[AssessmentService] getStemLessonContents - Error occurred:', error);
            console.error('[AssessmentService] getStemLessonContents - Error message:', error?.message);
            console.error('[AssessmentService] getStemLessonContents - Error response:', error?.response?.data);
            console.error('[AssessmentService] getStemLessonContents - Error status:', error?.response?.status);
            throw error;
        }
    },

    /**
     * POST /api/lms/contents/questions
     * Fetches survey questions when survey is already started
     * Request body: { userId: string, lessonId: string }
     * Response structure: { quizTitle, numberOfQuestions, questionData: [...], attemptId }
     */
    getSurveyQuestions: async (lessonId: string) => {
        try {
            const userId = await Storage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found');
            }

            if (!lessonId) {
                throw new Error('Lesson ID is required');
            }

            console.log('[AssessmentService] getSurveyQuestions - lessonId:', lessonId);
            console.log('[AssessmentService] getSurveyQuestions - userId:', userId);

            const requestPayload = { userId, lessonId };
            console.log('[AssessmentService] getSurveyQuestions - Request payload:', JSON.stringify(requestPayload, null, 2));
            console.log('[AssessmentService] getSurveyQuestions - Calling POST /api/lms/contents/questions');

            const response = await GlobalAxiosConfig.post(
                '/api/lms/contents/questions',
                requestPayload
            );

            console.log('[AssessmentService] getSurveyQuestions - Response status:', response.status);
            console.log('[AssessmentService] getSurveyQuestions - Full response.data:', JSON.stringify(response.data, null, 2));

            return response.data;
        } catch (error: any) {
            console.error('[AssessmentService] getSurveyQuestions - Error occurred:', error);
            console.error('[AssessmentService] getSurveyQuestions - Error message:', error?.message);
            console.error('[AssessmentService] getSurveyQuestions - Error response:', error?.response?.data);
            console.error('[AssessmentService] getSurveyQuestions - Error status:', error?.response?.status);
            throw error;
        }
    },
};

export default AssessmentService;









