import { getToken } from "./storage";

// Function to login and get the JWT token
export const login = async ({ email, password }) => {
  try {
    const response = await fetch("http://your-backend-url.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return data; // Return the token
    } else {
      throw new Error(data.error || "Login failed");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Example of an API call that requires token authentication
export const fetchDataWithAuth = async () => {
  try {
    const token = await getToken(); // Retrieve the token
    const response = await fetch("http://your-backend-url.com/protected", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Add the token to the headers
      },
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data with auth:", error);
    throw error;
  }
};