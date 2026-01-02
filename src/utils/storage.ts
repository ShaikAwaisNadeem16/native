import AsyncStorage from '@react-native-async-storage/async-storage';

const Storage = {
    setItem: async (key: string, value: string | number | boolean | null | undefined) => {
        try {
            // Convert all values to strings to prevent type casting errors on Android
            let stringValue: string;
            
            if (value === null || value === undefined) {
                stringValue = '';
            } else if (typeof value === 'object') {
                stringValue = JSON.stringify(value);
            } else {
                stringValue = String(value);
            }
            
            if (stringValue === 'NaN' || stringValue === 'Infinity' || stringValue === '-Infinity') {
                stringValue = '';
            }
            
            await AsyncStorage.setItem(key, stringValue);
        } catch (error) {
            console.error(`Error setting item '${key}' in AsyncStorage:`, error);
            try {
                await AsyncStorage.removeItem(key);
            } catch (removeError) {
                console.error(`Error removing corrupted key '${key}':`, removeError);
            }
        }
    },
    getItem: async (key: string) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value ?? null;
        } catch (error) {
            console.error(`Error getting item '${key}' from AsyncStorage:`, error);
            return null;
        }
    },
    removeItem: async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing item '${key}' from AsyncStorage:`, error);
        }
    },
    clear: async () => {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    },
};

export default Storage;





