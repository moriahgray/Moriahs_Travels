import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { saveToken, getToken } from "../../utils/storage"; // Utility functions to manage token storage
import { login } from "../../utils/api"; // API call function to login

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Call login API and get the JWT token
      const { token } = await login({ email, password });

      // Save token securely
      await saveToken(token);
      
      // Navigate to the main screen
      navigation.navigate("MainNavigator");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={setPassword} />
      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
});