import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/appNavigatorNavigator";
import { getToken, removeToken } from "./src/utils/storage";
import jwtDecode from "jwt-decode";
import API_URL from "./src/utils/api";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        console.log("Retrieved token:", token);

        if (token) {
          let decoded;
          try {
            decoded = jwtDecode(token);
            console.log("Decoded Token:", decoded);
          } catch (e) {
            console.error("Invalid token:", e);
            await removeToken(); // Remove invalid token
            setIsAuthenticated(false);
            return;
          }

          const currentTime = Date.now() / 1000;
          console.log("Current Time:", currentTime, "Token Expiry:", decoded.exp);

          if (decoded.exp > currentTime) {
            console.log("Token is valid locally. Checking with backend...");

            // Step 1: Verify the token with the backend
            const response = await fetch(`${API_URL}/auth/verify`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            const data = await response.json();
            console.log("Backend Token Verification Response:", data);

            if (response.ok) {
              console.log("Token is valid on the server. User is authenticated.");
              setIsAuthenticated(true);

              // Step 2: Auto logout when token expires
              const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
              console.log(`⌛ Token will expire in ${timeUntilExpiry / 1000} seconds.`);

              setTimeout(async () => {
                setIsAuthenticated(false);
                await removeToken();
                console.log("⚠️ Token expired and removed from storage.");
              }, timeUntilExpiry);
            } else {
              console.log("Server rejected the token. Logging out...");
              await removeToken();
              setIsAuthenticated(false);
            }
          } else {
            console.log("Token expired locally, removing...");
            await removeToken();
            setIsAuthenticated(false);
          }
        } else {
          console.log("No token found, user not authenticated.");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator isAuthenticated={isAuthenticated} />
    </NavigationContainer>
  );
}