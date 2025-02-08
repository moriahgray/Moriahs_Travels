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

// Main stack navigator for main app screens
const MainStack = createStackNavigator();

// Auth stack navigator for authentication screens
const AuthStack = createStackNavigator();

function MainNavigator() {
    return (
        <MainStack.Navigator initialRouteName="MainMenuScreen">
            <MainStack.Screen name="MainMenuScreen" component={MainMenuScreen} />
            <MainStack.Screen name="TraveledTo" component={TraveledTo} />
            <MainStack.Screen name="WantToTravel" component={WantToTravel} />
            <MainStack.Screen name="PlaceDetails" component={PlaceDetails} />
            <MainStack.Screen name="AddPlaceTraveledScreen" component={AddPlacesTraveledScreen} initialParams={{ category: 'traveled' }} />
            <MainStack.Screen name="AddPlaceWantScreen" component={AddPlacesWantScreen} initialParams={{ category: 'wantToTravel' }} />
            <MainStack.Screen name="MapScreen" component={MapScreen} />
        </MainStack.Navigator>
    );
}

function AuthNavigator() {
    return (
        <AuthStack.Navigator initialRouteName="Welcome">
            <AuthStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="SignUp" component={SignUpScreen} />
        </AuthStack.Navigator>
    );
}

export default function AppNavigator({ isAuthenticated }) {
    return (
        // No NavigationContainer here
        <>
            {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
        </>
    );
}