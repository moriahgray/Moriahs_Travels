import React, { useEffect, useState } from "react";
import { Text, Platform } from "react-native";
import AppNavigator from "./src/navigation/appNavigator";
import { getToken, removeToken } from "./src/utils/storage";
import jwtDecode from "jwt-decode";
import API_URL from "./src/utils/api";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";

enableScreens();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          let decoded;
          try {
            decoded = jwtDecode(token);
          } catch (e) {
            await removeToken();
            setIsAuthenticated(false);
            setLoading(false);
            return;
          }

          const currentTime = Date.now() / 1000;
          if (decoded.exp > currentTime) {
            const response = await fetch(`${API_URL}/auth/verify`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              setIsAuthenticated(true);
            } else {
              await removeToken();
              setIsAuthenticated(false);
            }
          } else {
            await removeToken();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <NavigationContainer>
      <AppNavigator isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </NavigationContainer>
  );
}