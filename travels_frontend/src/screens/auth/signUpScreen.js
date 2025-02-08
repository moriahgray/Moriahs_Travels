import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { signup } from "../../utils/api"; 

export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to generate user_id
  const generateUserId = (firstName, lastName) => {
    const user_id = `${firstName.slice(0, 3)}${lastName.slice(0, 3)}`;
    return user_id.toLowerCase(); // Ensure it is lowercase
  };

  const handleSignUp = async () => {
    try {
      // Generate user_id based on first 3 characters of first_name and last_name
      const user_id = generateUserId(firstName, lastName);

      const userData = { firstName, lastName, email, password, user_id };

      // Call signup API and pass the generated user_id to the backend
      const response = await signup(userData);

      // After successful sign-up, navigate to login or main screen
      navigation.navigate("Login");
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