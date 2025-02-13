import axios from "axios";

const GOOGLE_MAPS_API_KEY = your_api_key;

export const getCoordinatesFromAddress = async (address) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error("Failed to get location data.");
    }
  } catch (error) {
    console.error("Error getting coordinates:", error);
    throw error;
  }
};