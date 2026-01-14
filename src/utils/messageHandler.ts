import { Alert } from 'react-native';

/**
 * Extract message from API response or error
 * Checks multiple possible locations for the message
 */
export const extractMessage = (responseOrError: any): string | null => {
    if (!responseOrError) return null;

    // Check response.data.message (success response)
    if (responseOrError?.data?.message) {
        return responseOrError.data.message;
    }

    // Check response.message (direct response)
    if (responseOrError?.message && typeof responseOrError.message === 'string') {
        return responseOrError.message;
    }

    // Check error.response.data.message (error response)
    if (responseOrError?.response?.data?.message) {
        return responseOrError.response.data.message;
    }

    // Check error.response.data.error (alternative error field)
    if (responseOrError?.response?.data?.error) {
        return responseOrError.response.data.error;
    }

    // Check error.message (generic error)
    if (responseOrError?.message && typeof responseOrError.message === 'string') {
        return responseOrError.message;
    }

    return null;
};

/**
 * Show success message from API response
 */
export const showSuccessMessage = (response: any, defaultMessage: string = 'Operation completed successfully') => {
    const message = extractMessage(response) || defaultMessage;
    Alert.alert('Success', message);
};

/**
 * Show error message from API error
 */
export const showErrorMessage = (error: any, defaultMessage: string = 'An error occurred. Please try again.') => {
    const message = extractMessage(error) || defaultMessage;
    Alert.alert('Error', message);
};

/**
 * Show message from API response (auto-detect success/error)
 */
export const showMessage = (responseOrError: any, defaultSuccessMessage?: string, defaultErrorMessage?: string) => {
    // Check if it's an error (has response.status >= 400 or is an Error object)
    const isError = 
        responseOrError?.response?.status >= 400 ||
        responseOrError?.response?.statusCode >= 400 ||
        responseOrError instanceof Error ||
        (responseOrError?.response?.data?.statusCode && responseOrError.response.data.statusCode >= 400);

    if (isError) {
        showErrorMessage(responseOrError, defaultErrorMessage);
    } else {
        showSuccessMessage(responseOrError, defaultSuccessMessage);
    }
};



