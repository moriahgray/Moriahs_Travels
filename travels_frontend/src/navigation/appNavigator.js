import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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

// Create the stack and bottom tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator for each section
function TraveledStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TraveledTo" component={TraveledTo} />
      <Stack.Screen name="AddPlaceTraveled" component={AddPlaceTraveledScreen} />
    </Stack.Navigator>
  );
}

function WantToTravelStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WantToTravel" component={WantToTravel} />
      <Stack.Screen name="AddPlaceWant" component={AddPlaceWantScreen} />
    </Stack.Navigator>
  );
}

// Main Tab Navigator (for logged-in users)
function MainMenuTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Traveled" component={TraveledStack} />
      <Tab.Screen name="WantToTravel" component={WantToTravelStack} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator({ isAuthenticated }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // If the user is authenticated, show the bottom tab navigator
        <Stack.Screen name="MainMenu" component={MainMenuTabNavigator} />
      ) : (
        // If not authenticated, show the auth screens
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}