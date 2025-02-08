import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { login } from "../../utils/api"; 
import { saveToStorage } from "../../utils/storage";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      // Make login API call
      const data = await login({ email, password });

      // Log the received data to verify it contains the token
      console.log("Received data:", data);

      // Ensure token exists before saving it to storage
      if (data && data.token) {
        // Save the JWT token to AsyncStorage
        await saveToStorage("userToken", data.token);

        // After successful login, navigate to the home/dashboard screen
        navigation.navigate("Home");
      } else {
        throw new Error("Token not received from server.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default Login;