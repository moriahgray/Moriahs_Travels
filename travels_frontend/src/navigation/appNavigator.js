import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainMenuScreen from '../screens/main/mainMenuScreen';
import TraveledTo from '../screens/main/traveledTo';
import WantToTravel from '../screens/main/wantToTravel';
import PlaceDetails from '../screens/main/placeDetails';
import AddPlacesTraveledScreen from '../screens/main/addPlaceTraveledScreen';
import AddPlacesWantScreen from '../screens/main/addPlaceWantScreen';
import MapScreen from '../screens/main/mapScreen';
import WelcomeScreen from '../screens/auth/welcomeScreen';
import LoginScreen from '../screens/auth/loginScreen';
import SignUpScreen from '../screens/auth/signUpScreen';

const Stack = createStackNavigator();

export default function AppNavigator({ isAuthenticated }) {
  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? "MainMenuScreen" : "Welcome"}>
    {isAuthenticated ? (
      <>
        <Stack.Screen name="MainMenuScreen" component={MainMenuScreen} />
        <Stack.Screen name="TraveledTo" component={TraveledTo} />
        <Stack.Screen name="WantToTravel" component={WantToTravel} />
        <Stack.Screen name="PlaceDetails" component={PlaceDetails} />
        <Stack.Screen name="AddPlaceTraveledScreen" component={AddPlacesTraveledScreen} initialParams={{ category: 'traveled' }} />
        <Stack.Screen name="AddPlaceWantScreen" component={AddPlacesWantScreen} initialParams={{ category: 'wantToTravel' }} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        </>
      ) : (
        // Routes for unauthenticated users
        <>
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}