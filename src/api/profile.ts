import GlobalAxiosConfig from './GlobalAxiosConfig';
import Storage from '../utils/storage';

export const ProfileService = {
    /**
     * STEP 1: GET /api/student/user-profile/data
     * Fetches basic user profile data
     */
    fetchProfileData: async () => {
        try {
            console.log('[ProfileService] fetchProfileData - Calling GET /api/student/user-profile/data');
            const response = await GlobalAxiosConfig.get('/api/student/user-profile/data');
            console.log('[ProfileService] fetchProfileData - Response status:', response.status);
            console.log('[ProfileService] fetchProfileData - Full response.data:', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error: any) {
            console.error('[ProfileService] Failed to fetch profile data:', error);
            console.error('[ProfileService] Error response:', error?.response?.data);
            console.error('[ProfileService] Error status:', error?.response?.status);
            throw error;
        }
    },

    /**
     * STEP 3: POST /api/student/user-profile/details
     * Fetches detailed user profile information
     * Request body: { userId: string }
     */
    fetchProfileDetails: async () => {
        try {
            const userId = await Storage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found');
            }

            const response = await GlobalAxiosConfig.post(
                '/api/student/user-profile/details',
                { userId }
            );

            // Check if response and response.data exist
            if (!response) {
                throw new Error('No response received from server');
            }

            if (!response.data) {
                console.warn('[ProfileService] Response data is undefined, returning empty object');
                return {};
            }

            // Transform data to handle JSON strings in response (from existing pattern)
            const transformData = (item: any): any => {
                if (!item || typeof item !== 'object') {
                    return item || {};
                }

                for (const key in item) {
                    if (
                        item.hasOwnProperty(key) &&
                        typeof item[key] === "string" &&
                        item[key].startsWith("[") &&
                        item[key].endsWith("]")
                    ) {
                        try {
                            item[key] = JSON.parse(item[key]);
                        } catch (error) {
                            console.error(`Error parsing ${key}:`, error);
                        }
                    }
                }
                return item;
            };

            const finalData = transformData(response.data);
            return finalData;
        } catch (error: any) {
            console.error('[ProfileService] Failed to fetch profile details:', error);
            console.error('[ProfileService] Error details:', {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status,
                statusText: error?.response?.statusText,
            });
            
            // Re-throw with more context
            const errorMessage = error?.response?.data?.message || 
                                error?.message || 
                                'Failed to fetch profile details';
            throw new Error(errorMessage);
        }
    },

    /**
     * STEP 5: POST /api/student/user-profile/get-profile-percentage
     * Fetches profile completion percentage
     * Request body: { email: string, userId: string }
     */
    fetchProfilePercentage: async () => {
        try {
            const userId = await Storage.getItem('userId');
            const email = await Storage.getItem('username'); // Using username as email from login

            if (!userId) {
                throw new Error('User ID not found');
            }

            if (!email) {
                throw new Error('Email not found');
            }

            // Send as form-urlencoded as per existing pattern in codebase
            const response = await GlobalAxiosConfig.post(
                '/api/student/user-profile/get-profile-percentage',
                { email, userId },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    transformRequest: [(data) => {
                        const str = Object.keys(data).map(key =>
                            `${encodeURIComponent(key)}=${encodeURIComponent(data[key] || '')}`
                        ).join('&');
                        return str;
                    }]
                }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to fetch profile percentage:', error);
            // Non-blocking, return null
            return null;
        }
    },

    /**
     * PUT /api/student/user-profile
     * Updates user profile details
     * Request body: profile data object with email, userId, and other fields
     * This method merges the update data with existing profile data to ensure all fields are preserved
     */
    updateProfileDetails: async (updateData: any, existingProfileData?: any) => {
        try {
            const userId = await Storage.getItem('userId');
            const email = await Storage.getItem('username'); // Using username as email from login

            if (!userId) {
                throw new Error('User ID not found');
            }

            if (!email) {
                throw new Error('Email not found');
            }

            // Clean up: Remove any undefined values from the payload
            // Convert empty strings to null for optional fields to match Prisma schema
            const cleanPayload = (obj: any): any => {
                const cleaned: any = {};
                for (const key in obj) {
                    if (!obj.hasOwnProperty(key)) continue;
                    const value = obj[key];
                    // Only skip undefined
                    if (value !== undefined) {
                        if (Array.isArray(value)) {
                            // For PreferredJobLocation and project, Prisma requires nested input objects
                            // Empty arrays should be omitted entirely, not sent as []
                            if (key === 'PreferredJobLocation' || key === 'project') {
                                // Only include if array has items, otherwise skip this field entirely
                                if (value.length > 0) {
                                    cleaned[key] = value.map((item: any) => {
                                        if (typeof item === 'object' && item !== null) {
                                            return cleanPayload(item);
                                        }
                                        return item;
                                    });
                                }
                                // If empty array, do NOT add to cleaned - skip entirely
                                continue; // Skip to next iteration, don't add this field
                            } else {
                                // For other arrays, clean array items
                                cleaned[key] = value.map((item: any) => {
                                    if (typeof item === 'object' && item !== null) {
                                        return cleanPayload(item);
                                    }
                                    return item;
                                });
                            }
                        } else if (typeof value === 'object' && value !== null) {
                            // Recursively clean nested objects
                            cleaned[key] = cleanPayload(value);
                        } else if (value === '') {
                            // Convert empty strings to null for optional fields
                            // Keep empty strings only for required string fields
                            // For workExperience, dates and descriptions should be null if empty
                            // For educationalDetails, optional fields should be null
                            // For certificates, optional fields should be null
                            // Convert empty strings to null for optional fields
                            // Special handling for specialization - it's an object, not a string
                            if (key === 'specialization') {
                                // If specialization is an empty object or invalid, set to null
                                if (typeof value === 'object' && value !== null) {
                                    // Check if specialization has valid branch and branchId
                                    if (!value.branch || !value.branchId || value.branchId <= 0) {
                                        cleaned[key] = null;
                                    } else {
                                        cleaned[key] = value; // Keep valid specialization object
                                    }
                                } else {
                                    cleaned[key] = null;
                                }
                            } else if (key === 'workEndDate' || key === 'jobDesc' || key === 'certDate' || 
                                key === 'collegeEndDate' || key === 'collegeStartDate' || 
                                key === 'schoolMedium' || key === 'gradingSystem' || key === 'grade' || 
                                key === 'percentage' || key === 'certUrl' || key === 'certProvider' || 
                                key === 'certCourseName' || 
                                key === 'aboutYou' || key === 'gender' || key === 'dob' || 
                                key === 'nationality' || key === 'state' || key === 'city' || 
                                key === 'permanentAddress' || key === 'pinCode' || key === 'linkedinLink' || 
                                key === 'githubLink' || key === 'district' || key === 'locality') {
                                cleaned[key] = null;
                            } else {
                                cleaned[key] = value;
                            }
                        } else {
                            cleaned[key] = value;
                        }
                    }
                }
                return cleaned;
            };

            // If existing profile data is provided, merge it with update data
            // Otherwise, just use the update data (API will handle merging on backend)
            let mergedData: any = {};
            
            // Fields that should NOT be sent in the update (read-only/system fields)
            const readOnlyFields = [
                'id', 'createdAt', 'updatedAt', 'moodleUserId', 
                'emailVerified', 'isPhoneValidated', 'profilePicture',
                'tools', 'skills', 'githubLink', 'branchId', 'collegeId'
            ];
            
            // Fields that should be omitted if empty arrays (Prisma relation fields)
            const relationArrayFields = ['PreferredJobLocation', 'project'];
            
            if (existingProfileData) {
                // Start with a copy of existing profile data, excluding read-only fields
                mergedData = JSON.parse(JSON.stringify(existingProfileData));
                
                // Remove read-only fields from merged data
                readOnlyFields.forEach(field => {
                    delete mergedData[field];
                });
                
                // Remove empty relation arrays from existing data
                relationArrayFields.forEach(field => {
                    if (Array.isArray(mergedData[field]) && mergedData[field].length === 0) {
                        delete mergedData[field];
                    }
                });
                
                // Override with update data fields
                Object.keys(updateData).forEach(key => {
                    const value = updateData[key];
                    
                    // Skip read-only fields in update data
                    if (readOnlyFields.includes(key)) {
                        return;
                    }
                    
                    // Handle relation array fields - only include if non-empty
                    if (relationArrayFields.includes(key)) {
                        if (value !== undefined && Array.isArray(value) && value.length > 0) {
                            mergedData[key] = value;
                        } else {
                            // Remove if empty or undefined
                            delete mergedData[key];
                        }
                        return;
                    }
                    
                    // Handle arrays - replace entire array if provided
                    if (key === 'educationalDetails' || key === 'workExperience' || 
                        key === 'technicalSkills' || key === 'certificate' || key === 'languages') {
                        if (value !== undefined && Array.isArray(value)) {
                            // Clean array items - remove undefined values and ensure proper structure
                            // Use cleanPayload recursively to handle nested objects and arrays
                            mergedData[key] = value.map((item: any) => {
                                if (typeof item === 'object' && item !== null) {
                                    // Recursively clean nested objects (like specialization, skillsAcquired)
                                    return cleanPayload(item);
                                }
                                return item;
                            });
                        }
                    } else {
                        // For other fields, update if value is provided
                        // Filter out undefined, but keep null, empty strings, booleans, and numbers
                        if (value !== undefined) {
                            mergedData[key] = value;
                        }
                    }
                });
            } else {
                // No existing data, use update data as-is, but remove read-only fields
                mergedData = { ...updateData };
                readOnlyFields.forEach(field => {
                    delete mergedData[field];
                });
                
                // Remove empty relation arrays
                relationArrayFields.forEach(field => {
                    if (Array.isArray(mergedData[field]) && mergedData[field].length === 0) {
                        delete mergedData[field];
                    }
                });
            }

            // Prepare payload with email and userId (required fields)
            let payload = cleanPayload({
                email,
                userId,
                ...mergedData,
            });

            // Final cleanup: Explicitly remove empty relation arrays that might have slipped through
            relationArrayFields.forEach(field => {
                if (payload[field] !== undefined) {
                    if (Array.isArray(payload[field]) && payload[field].length === 0) {
                        delete payload[field];
                    } else if (!Array.isArray(payload[field])) {
                        // If it's not an array, remove it (shouldn't happen, but defensive)
                        delete payload[field];
                    }
                }
            });

            console.log('[ProfileService] updateProfileDetails - Request payload:', JSON.stringify(payload, null, 2));
            console.log('[ProfileService] updateProfileDetails - Payload keys:', Object.keys(payload));
            console.log('[ProfileService] updateProfileDetails - Payload size:', JSON.stringify(payload).length, 'bytes');
            
            // Debug: Check for empty relation arrays
            relationArrayFields.forEach(field => {
                if (payload[field] !== undefined) {
                    console.warn(`[ProfileService] WARNING: ${field} is still in payload:`, payload[field]);
                }
            });

            const response = await GlobalAxiosConfig.put(
                '/api/student/user-profile',
                payload
            );

            console.log('[ProfileService] updateProfileDetails - Response status:', response.status);
            console.log('[ProfileService] updateProfileDetails - Response received:', JSON.stringify(response.data, null, 2));

            return response.data;
        } catch (error: any) {
            console.error('[ProfileService] Failed to update profile details:', error);
            console.error('[ProfileService] Error details:', {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status,
            });
            throw error;
        }
    },

    /**
     * GET /api/auth/post-office/pincode/{pincode}
     * Fetches state, district, and locality data for a given pincode
     * Response format: { pincode: number, state: string, district: string, locality: string[] }
     */
    fetchPincodeData: async (pincode: string) => {
        try {
            if (!pincode || pincode.length !== 6) {
                throw new Error('Invalid pincode');
            }

            console.log('[ProfileService] fetchPincodeData - Fetching data for pincode:', pincode);

            const response = await GlobalAxiosConfig.get(
                `/api/auth/post-office/pincode/${pincode}`
            );

            console.log('[ProfileService] fetchPincodeData - Response received:', JSON.stringify(response.data, null, 2));

            // Validate response structure
            if (!response.data || typeof response.data !== 'object') {
                throw new Error('Invalid response format from pincode API');
            }

            return response.data;
        } catch (error: any) {
            console.error('[ProfileService] fetchPincodeData - Error occurred:', error);
            console.error('[ProfileService] fetchPincodeData - Error message:', error?.message);
            console.error('[ProfileService] fetchPincodeData - Error response:', error?.response?.data);
            throw error;
        }
    },
};

export default ProfileService;

