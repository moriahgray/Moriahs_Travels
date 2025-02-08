import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { signup } from "../../utils/api";

export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async () => {
    try {
      const userData = {
        first_name: firstName, // Change to snake_case
        last_name: lastName,   // Change to snake_case
        email,
        password,
      };
  
      // Call signup API
      const response = await signup(userData);
  
      // After successful sign-up, navigate to login screen
      if (response) {
        navigation.navigate("Login");
      } else {
        throw new Error("Unknown sign-up error");
      }
    } catch (error) {
      console.error("Sign-up failed:", error);
      setErrorMessage(error.message || "Sign-up failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="First Name"
        style={styles.input}
        onChangeText={setFirstName}
        value={firstName}
      />
      <TextInput
        placeholder="Last Name"
        style={styles.input}
        onChangeText={setLastName}
        value={lastName}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
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
  }
});