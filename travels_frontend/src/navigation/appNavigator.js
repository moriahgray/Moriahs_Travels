import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import MainMenuScreen from "../screens/MainMenuScreen";
import MapScreen from "../screens/MapScreen";
import PlaceDetails from "../screens/PlaceDetails";
import AddPlaceTraveledScreen from "../screens/AddPlaceTraveledScreen";
import AddPlaceWantScreen from "../screens/AddPlaceWantScreen";
import EditPlaceScreen from "../screens/EditPlaceScreen";
import TraveledTo from "../screens/TraveledTo";
import WantToTravel from "../screens/WantToTravel";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", paddingLeft: 15 }} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color="blue" />
              <Text style={{ fontSize: 17, color: "blue", marginLeft: 5 }}>Back</Text>
            </TouchableOpacity>
          ),
          headerBackTitleVisible: false, // Ensures default back button text does not override
        })}
      >
        <Stack.Screen name="MainMenu" component={MainMenuScreen} options={{ title: "Main Menu" }} />
        <Stack.Screen name="MapScreen" component={MapScreen} options={{ title: "Map" }} />
        <Stack.Screen name="PlaceDetails" component={PlaceDetails} options={{ title: "Place Details" }} />
        <Stack.Screen name="AddPlaceTraveled" component={AddPlaceTraveledScreen} options={{ title: "Add Traveled Place" }} />
        <Stack.Screen name="AddPlaceWant" component={AddPlaceWantScreen} options={{ title: "Add Wishlist Place" }} />
        <Stack.Screen name="EditPlace" component={EditPlaceScreen} options={{ title: "Edit Place" }} />
        <Stack.Screen name="TraveledTo" component={TraveledTo} options={{ title: "Places She Has Gone" }} />
        <Stack.Screen name="WantToTravel" component={WantToTravel} options={{ title: "Places She Wants to Visit" }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: "Sign Up" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}