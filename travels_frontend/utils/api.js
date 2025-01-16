import { Platform } from 'react-native';

// Local development IP addresses
const LOCAL_IP = '127.0.0.1';
const LOCAL_ANDROID = '10.0.2.2';
const LOCAL_PORT = '8000';

// Determine the correct backend URL based on the platform
export const API_URL =
    Platform.OS === 'android'
        ? `http://${LOCAL_ANDROID}:${LOCAL_PORT}` // For Android Emulator
        : `http://${LOCAL_IP}:${LOCAL_PORT}`;    // For iOS Simulator or physical devices

// Function to fetch places based on category
export const getPlaces = async (category) => {
    try {
        const response = await fetch(`${API_URL}/places?category=${category}`);
        if (!response.ok) {
            throw new Error('Failed to fetch places');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching places:', error);
        throw error;
    }
};

// Function to add a new place
export const addPlace = async (placeData) => {
    try {
        const response = await fetch(`${API_URL}/places`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(placeData),
        });
        if (!response.ok) {
            throw new Error('Failed to add place');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding place:', error);
        throw error;
    }
};

// Function to delete a place by its ID
export const deletePlace = async (placeId) => {
    try {
        const response = await fetch(`${API_URL}/places/${placeId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete place');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting place:', error);
        throw error;
    }
};

// Function to log in a user
export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            throw new Error('Failed to log in');
        }
        return await response.json();
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

// Function to sign up a new user
export const signup = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Failed to sign up');
        }
        return await response.json();
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
};