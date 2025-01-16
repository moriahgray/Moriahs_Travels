import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./navigation/authNavigator";
import MainNavigator from "./navigation/mainNavigator";
import { getToken } from "./utils/storage";
import jwtDecode from "jsonwebtoken";

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token) {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          setIsAuthenticated(true);
        }
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