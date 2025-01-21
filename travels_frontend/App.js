import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./src/navigation/authNavigator";
import MainNavigator from "./src/navigation/mainNavigator";
import { getToken, removeToken } from "./src/utils/storage";
import jwtDecode from "jwt-decode";

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        console.log("Retrieved token:", token);

        if (token) {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp > currentTime) {
            setIsAuthenticated(true);

            // Automatically log out when the token expires
            const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
            setTimeout(async () => {
              setIsAuthenticated(false);
              await removeToken();
              console.log("Token expired and removed from storage.");
            }, timeUntilExpiry);
          } else {
            console.log("Token expired, removing...");
            await removeToken();
          }
        } else {
          console.log("No token found, user not authenticated.");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainNavigator" component={MainNavigator} />
        ) : (
          <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}