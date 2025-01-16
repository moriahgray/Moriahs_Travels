import { Platform } from "react-native";
import { getFromStorage } from "./storage";

// Local development IP addresses
const LOCAL_IP = "127.0.0.1";
const LOCAL_ANDROID = "10.0.2.2";
const LOCAL_PORT = "8000";

export const API_URL =
  Platform.OS === "android"
    ? `http://${LOCAL_ANDROID}:${LOCAL_PORT}`
    : `http://${LOCAL_IP}:${LOCAL_PORT}`;

/**
 * Helper function to get headers, including Authorization token.
 */
const getHeaders = async () => {
  const token = await getFromStorage("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch places based on category.
 */
export const getPlaces = async (category) => {
  try {
    const response = await fetch(`${API_URL}/places?category=${category}`, {
      headers: await getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch places: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching places:", error);
    throw error;
  }
};

/**
 * Add a new place.
 */
export const addPlace = async (placeData) => {
  try {
    const response = await fetch(`${API_URL}/places`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(placeData),
    });
    if (!response.ok) {
      throw new Error(`Failed to add place: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding place:", error);
    throw error;
  }
};

/**
 * Delete a place by ID.
 */
export const deletePlace = async (placeId) => {
  try {
    const response = await fetch(`${API_URL}/places/${placeId}`, {
      method: "DELETE",
      headers: await getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete place: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting place:", error);
    throw error;
  }
};

/**
 * Log in a user.
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      throw new Error(`Failed to log in: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/**
 * Sign up a new user.
 */
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`Failed to sign up: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};