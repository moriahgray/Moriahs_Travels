import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Auth Screens
import WelcomeScreen from "../screens/auth/welcomeScreen";
import LoginScreen from "../screens/auth/loginScreen";
import SignUpScreen from "../screens/auth/signUpScreen";

// Main Screens
import MainMenuScreen from "../screens/main/mainMenuScreen";
import MapScreen from "../screens/main/mapScreen";
import PlaceDetails from "../screens/main/placeDetails";
import AddPlaceTraveledScreen from "../screens/main/addPlaceTraveledScreen";
import AddPlaceWantScreen from "../screens/main/addPlaceWantScreen";
import EditPlaceScreen from "../screens/main/editPlacesScreen";
import TraveledTo from "../screens/main/traveledTo";
import WantToTravel from "../screens/main/wantToTravel";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", paddingLeft: 15 }}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="blue" />
              <Text style={{ fontSize: 17, color: "blue", marginLeft: 5 }}>Back</Text>
            </TouchableOpacity>
          ),
          headerBackTitleVisible: false,
        })}
      >
        {/* Show Auth Screens if not authenticated */}
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login">
              {() => <LoginScreen setIsAuthenticated={setIsAuthenticated} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            {/* Main App Screens */}
            <Stack.Screen name="MainMenu" component={MainMenuScreen} options={{ title: "Main Menu" }} />
            <Stack.Screen name="MapScreen" component={MapScreen} options={{ title: "Map" }} />
            <Stack.Screen name="PlaceDetails" component={PlaceDetails} options={{ title: "Place Details" }} />
            <Stack.Screen name="AddPlaceTraveled" component={AddPlaceTraveledScreen} options={{ title: "Add Traveled Place" }} />
            <Stack.Screen name="AddPlaceWant" component={AddPlaceWantScreen} options={{ title: "Add Wishlist Place" }} />
            <Stack.Screen name="EditPlace" component={EditPlaceScreen} options={{ title: "Edit Place" }} />
            <Stack.Screen name="TraveledTo" component={TraveledTo} options={{ title: "Places She Has Gone" }} />
            <Stack.Screen name="WantToTravel" component={WantToTravel} options={{ title: "Places She Wants to Visit" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}