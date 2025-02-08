import { getFromStorage } from "./storage";

// Get API URL from environment variable or fallback to default
const API_URL = process.env.REACT_NATIVE_APP_API_URL || "http://localhost:8000";

console.log("API URL:", API_URL);

const getHeaders = async () => {
  const token = await getFromStorage("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Fetch places based on category.
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

// Add a new place.
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

// Delete a place by ID.
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

// Log in a user.
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

// Sign up a new user.
export const signup = async (userData) => {
  try {
    console.log("Signing up with data:", userData);

    const response = await fetch(`${API_URL}/auth/register`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log("Raw Response:", response);
    
    const data = await response.json();
    console.log("Response Data:", data);

    if (!response.ok) {
      throw new Error(data?.message || "Failed to sign up.");
    }

    return data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export default API_URL;