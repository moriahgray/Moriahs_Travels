import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import MainMenuScreen from "../screens/main/mainMenuScreen";
import TraveledTo from "../screens/main/traveledTo";
import WantToTravel from "../screens/main/wantToTravel";
import PlaceDetails from "../screens/main/placeDetails";
import AddPlacesTraveledScreen from "../screens/main/addPlaceTraveledScreen";
import AddPlacesWantScreen from "../screens/main/addPlaceWantScreen";
import MapScreen from "../screens/main/mapScreen";
import WelcomeScreen from "../screens/auth/welcomeScreen";
import LoginScreen from "../screens/auth/loginScreen";
import SignUpScreen from "../screens/auth/signUpScreen";

const Stack = createStackNavigator();

export default function AppNavigator({ isAuthenticated, setIsAuthenticated, navigationRef }) {
  useEffect(() => {
    if (isAuthenticated && navigationRef.current) {
      console.log("Navigating to MainMenuScreen...");
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: "MainMenuScreen" }],
      });
    }
  }, [isAuthenticated]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {/* Authentication Screens */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        {/* Main Screens (Accessible after Login) */}
        <Stack.Screen name="MainMenuScreen" component={MainMenuScreen} />
        <Stack.Screen name="TraveledTo" component={TraveledTo} />
        <Stack.Screen name="WantToTravel" component={WantToTravel} />
        <Stack.Screen name="PlaceDetails" component={PlaceDetails} />
        <Stack.Screen name="AddPlaceTraveledScreen" component={AddPlacesTraveledScreen} />
        <Stack.Screen name="AddPlaceWantScreen" component={AddPlacesWantScreen} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}