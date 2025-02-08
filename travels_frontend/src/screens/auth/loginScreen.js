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
        const data = await login({ email, password });
    
        console.log("Received data:", data);
    
        if (data && data.token) {
          await saveToStorage("userToken", data.token);
    
          // Instead of using reset, we can use navigate to go to the MainMenuScreen
          navigation.navigate("MainMenuScreen");
    
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