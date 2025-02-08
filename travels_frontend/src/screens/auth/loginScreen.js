import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { login } from '../../utils/api';
import { saveToStorage } from '../../utils/storage';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const data = await login({ email, password });

            if (data.token) {
                await saveToStorage('jwtToken', data.token);
                console.log('Login successful');
                navigation.replace('MainMenuScreen');
            } else {
                Alert.alert('Login Error', 'Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            Alert.alert('Login Error', error.message || 'Something went wrong. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
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
    },
});