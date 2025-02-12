import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
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
import EditPlaceScreen from "../screens/main/editPlacesScreen";

const Stack = createStackNavigator();

export default function AppNavigator({ isAuthenticated, setIsAuthenticated }) {
  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? "MainMenuScreen" : "Welcome"}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainMenuScreen">
            {(props) => <MainMenuScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
          </Stack.Screen>
          <Stack.Screen name="TraveledTo" component={TraveledTo} />
          <Stack.Screen name="WantToTravel" component={WantToTravel} />
          <Stack.Screen name="PlaceDetails" component={PlaceDetails} />
          <Stack.Screen name="AddPlaceTraveledScreen" component={AddPlacesTraveledScreen} />
          <Stack.Screen name="AddPlaceWantScreen" component={AddPlacesWantScreen} />
          <Stack.Screen name="MapScreen" component={MapScreen} />
          <Stack.Screen name="EditPlace" component={EditPlaceScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}