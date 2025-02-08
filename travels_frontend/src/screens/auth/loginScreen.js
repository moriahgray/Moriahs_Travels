import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Text, ActivityIndicator } from "react-native";
import { login } from "../../utils/api";
import { saveToStorage } from "../../utils/storage";

export default function LoginScreen({ navigation, setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const data = await login({ email, password });

      if (data.token) {
        await saveToStorage("jwtToken", data.token);
        console.log("Login successful, token saved.");

        // Update authentication state in App.js
        setIsAuthenticated(true);

        // Reset navigation stack to MainMenuScreen
        console.log("Current Navigation State:", navigation.getState());

        navigation.navigate("MainMenuScreen");


      } else {
        Alert.alert("Login Error", "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Login Error", error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
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
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title={isLoading ? "Logging In..." : "Log In"} onPress={handleLogin} disabled={isLoading} />
        {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#FFF" },
  header: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 30 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  buttonContainer: { marginTop: 20, alignItems: "center" },
});