import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function MainMenuScreen({ navigation }) {
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log('Logout successful');
                
                // Use `navigation.replace` to prevent the user from going back to the main app after logging out
                navigation.replace('AuthNavigator', { screen: 'Welcome' }); 
            })
            .catch(error => {
                console.error('Error signing out:', error);
                Alert.alert("Error", "Failed to log out. Please try again.");
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Moriah's Travels</Text>
            <Text style={styles.subtitle}>Pick a link to see what is inside!</Text>
            <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('TraveledTo')}>
                <Text style={styles.linkText}>Where She Has Gone</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('WantToTravel')}>
                <Text style={styles.linkText}>Where She Will Go</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F8FF', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 18, marginBottom: 30 },
    link: { marginTop: 20, paddingVertical: 10 },
    linkText: { fontSize: 18, color: 'green', textDecorationLine: 'underline' },
    logoutButton: { position: 'absolute', top: 10, right: 10 },
    logoutText: { fontSize: 16, color: 'red' },
});