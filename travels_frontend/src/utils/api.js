import { API_URL } from "@env";
import { getFromStorage } from "./storage";
import axios from "axios";  // Import axios

// Get API URL from environment variable or fallback to default
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
    const headers = await getHeaders();
    const response = await axios.get(`${API_URL}/places`, {
      headers: headers,
      params: { category },
    });
    return response.data;  // Axios automatically parses the JSON response
  } catch (error) {
    console.error("Error fetching places:", error.response?.data || error.message);
    throw error;
  }
};

// Add a new place.
export const addPlace = async (placeData) => {
  try {
    const headers = await getHeaders();
    const response = await axios.post(`${API_URL}/places`, placeData, { headers });
    return response.data;  // Axios automatically parses the JSON response
  } catch (error) {
    console.error("Error adding place:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a place by ID.
export const deletePlace = async (placeId) => {
  try {
    const headers = await getHeaders();
    const response = await axios.delete(`${API_URL}/places/${placeId}`, { headers });
    return response.data;  // Axios automatically parses the JSON response
  } catch (error) {
    console.error("Error deleting place:", error.response?.data || error.message);
    throw error;
  }
};

// Log in a user.
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;  // Axios automatically parses the JSON response
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    throw error;
  }
};

// Sign up a new user.
export const signup = async (userData) => {
  try {
    // Log the JSON data that is about to be sent
    console.log("Signing up with data:", userData);

    const response = await axios.post(`${API_URL}/auth/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Log the response before returning
    console.log("Response:", response);

    return response.data;  // Axios automatically parses the JSON response
  } catch (error) {
    console.error("Error signing up:", error.response?.data || error.message);
    throw error;
  }
};

export default API_URL;