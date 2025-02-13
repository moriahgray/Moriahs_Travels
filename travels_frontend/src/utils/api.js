import * as storage from "./storage";
import axios from "axios"; 

const API_URL = "http://192.168.1.20:8000";

const getHeaders = async () => {
  const token = await storage.getFromStorage("token");

  if (!token) {
    console.warn("Authentication token not found. User may not be logged in.");
  } else {
    console.log("Retrieved token:", token);
  }

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Fetch places based on category
export const getPlaces = async (category) => {
  try {
    const headers = await getHeaders();
    const response = await axios.get(`${API_URL}/places?category=${encodeURIComponent(category)}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching places:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch a single place by ID
export const getPlaceDetails = async (placeId) => {
  try {
    const headers = await getHeaders();
    const response = await axios.get(`${API_URL}/places/${placeId}`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching place details:", error.response?.data || error.message);
    throw error;
  }
};

// Add place
export const addPlace = async (placeData) => {
  try {
    const headers = await getHeaders();

    const formattedData = {
      ...placeData,
      image_uri: placeData.imageUri,
    };
    delete formattedData.imageUri;

    console.log("Sending place data to backend:", JSON.stringify(formattedData, null, 2));

    const response = await axios.post(`${API_URL}/places`, formattedData, { headers });
    console.log("Place added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding place:", error.response?.data || error.message);
    throw error;
  }
};

// Update place
export const updatePlace = async (placeId, updatedData) => {
  try {
    const headers = await getHeaders();

    const formattedData = {
      ...updatedData,
      image_uri: updatedData.imageUri,
    };
    delete formattedData.imageUri;

    console.log("Sending updated place data to backend:", JSON.stringify(formattedData, null, 2));

    const response = await axios.put(`${API_URL}/places/${placeId}`, formattedData, { headers });
    console.log("Place updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating place:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a place
export const deletePlace = async (placeId) => {
  try {
    const headers = await getHeaders();

    const response = await axios.delete(`${API_URL}/places/${placeId}`, { headers });
    console.log("Place deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting place:", error.response?.data || error.message);
    throw error;
  }
};

// Log in a user
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: { "Content-Type": "application/json" },
    });

    const { token } = response.data;

    if (token) {
      console.log("Login successful, saving token:", token);
      await storage.saveToStorage("token", token);
    } else {
      console.error("Login response did not contain a token.");
    }

    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    throw error;
  }
};


// Sign up a new user
export const signup = async (userData) => {
  try {
    console.log("Registering new user:", userData);
    const response = await axios.post(`${API_URL}/auth/register`, userData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("User registered successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error.response?.data || error.message);
    throw error;
  }
};

export default API_URL;