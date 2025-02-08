import React, { useEffect, useState, useRef } from "react";
import { Text } from "react-native"; 
import AppNavigator from "./src/navigation/appNavigator";
import { getToken, removeToken } from "./src/utils/storage";
import jwtDecode from "jwt-decode";
import API_URL from "./src/utils/api";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigationRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        console.log("Retrieved token:", token);

        if (!token) {
          console.log("No token found, user not authenticated.");
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        let decoded;
        try {
          decoded = jwtDecode(token);
          console.log("Decoded Token:", decoded);
        } catch (e) {
          console.error("Invalid token:", e);
          await removeToken();
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const currentTime = Date.now() / 1000;
        console.log("⏳ Current Time:", currentTime, "| Token Expiry:", decoded.exp);

        if (decoded.exp > currentTime) {
          console.log("Token is valid locally. Checking with backend...");

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

            const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
            console.log(`Token will expire in ${timeUntilExpiry / 1000} seconds.`);

            setTimeout(async () => {
              setIsAuthenticated(false);
              await removeToken();
              console.log("Token expired and removed from storage.");
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
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    console.log("Authentication state changed:", isAuthenticated);
    if (isAuthenticated && navigationRef.current) {
      console.log("Navigating to MainMenuScreen...");
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: "MainMenuScreen" }],
      });
    }
  }, [isAuthenticated]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} navigationRef={navigationRef} />
    </NavigationContainer>
  );
}