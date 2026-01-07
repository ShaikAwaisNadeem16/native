import GlobalAxiosConfig from './GlobalAxiosConfig';
import Storage from '../utils/storage';

export const AssessmentService = {
    /**
     * POST /api/lms/attempt/quiz
     * Attempt quiz API - used for STEM Assessment
     * Can be called with different page values: "start", "question-submit", "quiz-submit"
     */
    attemptQuiz: async (payload: {
        page: 'start' | 'question-submit' | 'quiz-submit';
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

            const response = await GlobalAxiosConfig.post(
                '/api/lms/attempt/quiz',
                payload
            );
            return response.data;
        } catch (error) {
            console.error('Failed to attempt quiz:', error);
            throw error;
        }
    },
};

export default AssessmentService;









