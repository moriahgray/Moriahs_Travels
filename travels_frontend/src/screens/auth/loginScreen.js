import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { login } from '../../utils/api';  // Import the login function from api.js
import { saveToStorage } from '../../utils/storage';  // Assuming this is your custom storage function

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            // Use the login function from api.js to make the login request
            const data = await login({ email, password });

            if (data.token) {
                // If the login is successful, save the JWT token using your custom storage function
                await saveToStorage('jwtToken', data.token);
                console.log('Login successful');

                // Navigate to MainMenuScreen inside MainNavigator after successful login
                navigation.replace('MainNavigator', { screen: 'MainMenuScreen' });
            } else {
                // If no token is returned, show an error
                Alert.alert('Login Error', 'Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            // Handle error and show an alert with the error message
            Alert.alert('Login Error', error.message || 'Something went wrong. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <Text style={styles.header}>Log In</Text>

            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Log In" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'top', padding: 20, backgroundColor: '#FFF' },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        padding: 10, 
        marginBottom: 10, 
        borderRadius: 5 
    }
  });