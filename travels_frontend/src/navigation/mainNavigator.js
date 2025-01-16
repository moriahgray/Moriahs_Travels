import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainMenuScreen from "../screens/main/mainMenuScreen";
import TraveledTo from "../screens/main/traveledTo";
import WantToTravel from "../screens/main/wantToTravel";
import AddPlaceTraveledScreen from "../screens/main/addPlaceTraveledScreen";
import AddPlaceWantScreen from "../screens/main/addPlaceWantScreen";
import MapScreen from "../screens/main/mapScreen";
import PlaceDetails from "../screens/main/placeDetails";

const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="MainMenu">
      <Stack.Screen name="MainMenu" component={MainMenuScreen} />
      <Stack.Screen name="TraveledTo" component={TraveledTo} />
      <Stack.Screen name="WantToTravel" component={WantToTravel} />
      <Stack.Screen name="AddPlaceTraveled" component={AddPlaceTraveledScreen} />
      <Stack.Screen name="AddPlaceWant" component={AddPlaceWantScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="PlaceDetails" component={PlaceDetails} />
    </Stack.Navigator>
  );
}