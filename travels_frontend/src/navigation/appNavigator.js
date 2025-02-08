import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/auth/welcomeScreen";
import LoginScreen from "../screens/auth/loginScreen";
import SignUpScreen from "../screens/auth/signUpScreen";
import MainMenuScreen from "../screens/main/mainMenuScreen";
import TraveledTo from "../screens/main/traveledTo";
import WantToTravel from "../screens/main/wantToTravel";
import AddPlaceTraveledScreen from "../screens/main/addPlaceTraveledScreen";
import AddPlaceWantScreen from "../screens/main/addPlaceWantScreen";
import MapScreen from "../screens/main/mapScreen";
import PlaceDetails from "../screens/main/placeDetails";

// Create the stack navigator
const Stack = createStackNavigator();

export default function AppNavigator({ isAuthenticated }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          {/* Main app screens */}
          <Stack.Screen name="MainMenu" component={MainMenuScreen} />
          <Stack.Screen name="TraveledTo" component={TraveledTo} />
          <Stack.Screen name="WantToTravel" component={WantToTravel} />
          <Stack.Screen name="AddPlaceTraveled" component={AddPlaceTraveledScreen} />
          <Stack.Screen name="AddPlaceWant" component={AddPlaceWantScreen} />
          <Stack.Screen name="MapScreen" component={MapScreen} />
          <Stack.Screen name="PlaceDetails" component={PlaceDetails} />
        </>
      ) : (
        <>
          {/* Auth screens */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}