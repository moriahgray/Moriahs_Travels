import { getFromStorage } from "./storage";
import axios from "axios"; 

const API_URL = "http://192.168.1.20:8000";

// Standardized Header Handling
const getHeaders = async () => {
  const token = await getFromStorage("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Fetch places (Retrieves all and filters manually)
export const getPlaces = async () => {
  try {
    const headers = await getHeaders();
    const response = await axios.get(`${API_URL}/places`, { headers });

    if (!response.data || response.data.length === 0) {
      console.warn("No places found");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching places:", error.response?.data || error.message);
    throw error;
  }
};

// Add a new place (Ensuring category is always included)
export const addPlace = async (placeData) => {
  try {
    const headers = await getHeaders();
    
    // Ensure category is set
    const updatedPlaceData = {
      ...placeData,
      category: placeData.category || "traveled",
    };

    console.log("Adding place with data:", JSON.stringify(updatedPlaceData, null, 2));

    const response = await axios.post(`${API_URL}/places`, updatedPlaceData, { headers });
    console.log("Place added successfully! Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error adding place:", error.response?.data || error.message);
    throw error;
  }
};

// Update a place
export const updatePlace = async (placeId, updatedData) => {
  try {
    const headers = await getHeaders();
    const response = await axios.put(`${API_URL}/places/${placeId}`, updatedData, { headers });

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

    return response.data;
  } catch (error) {
    console.error("Error deleting place:", error.response?.data || error.message);
    throw error;
  }
};