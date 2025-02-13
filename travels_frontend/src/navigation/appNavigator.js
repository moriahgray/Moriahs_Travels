import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
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

export default function AppNavigator({ isAuthenticated, setIsAuthenticated }) {
  console.log("AppNavigator - isAuthenticated:", isAuthenticated);

  return (
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
        headerTitle: "",
      })}
    >
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
            {(props) => {
              return <MainMenuScreen {...props} setIsAuthenticated={setIsAuthenticated} />;
            }}
          </Stack.Screen>
          <Stack.Screen name="MapScreen">{(props) => <MapScreen {...props} />}</Stack.Screen>
          <Stack.Screen name="PlaceDetails">{(props) => <PlaceDetails {...props} />}</Stack.Screen>
          <Stack.Screen name="AddPlaceTraveledScreen">{(props) => <AddPlaceTraveledScreen {...props} />}</Stack.Screen>
          <Stack.Screen name="AddPlaceWantScreen">{(props) => <AddPlaceWantScreen {...props} />}</Stack.Screen>
          <Stack.Screen name="EditPlaceScreen">{(props) => <EditPlaceScreen {...props} />}</Stack.Screen>
          <Stack.Screen name="TraveledTo">{(props) => <TraveledTo {...props} />}</Stack.Screen>
          <Stack.Screen name="WantToTravel">{(props) => <WantToTravel {...props} />}</Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}