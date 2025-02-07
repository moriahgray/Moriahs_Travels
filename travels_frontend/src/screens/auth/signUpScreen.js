import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { signup } from "../../utils/api";

export default function SignUpScreen({ navigation }) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user_id, setUserId] = useState("");

  // Function to generate user ID based on first and last names
  useEffect(() => {
    if (first_name && last_name) {
      const generateUserId = `${first_name.slice(0, 3).toLowerCase()}${last_name.slice(0, 3).toLowerCase()}`;
      setUserId(generateUserId);
    }
  }, [first_name, last_name]);

  const handleSignUp = async () => {
    if (!first_name || !last_name || !email || !password) {
      console.error("Signup failed: Please fill in all fields.");
      return;
    }
  
    try {
      await signup({ user_id, first_name, last_name, email, password });
      navigation.navigate("Login");
    } catch (error) {
      console.error("Signup failed:", error.message || error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="First Name"
        style={styles.input}
        onChangeText={setFirstName}
        value={first_name}
      />
      <TextInput
        placeholder="Last Name"
        style={styles.input}
        onChangeText={setLastName}
        value={last_name}
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
      <TextInput
        placeholder="User ID (Auto-generated)"
        style={styles.input}
        value={user_id}
        editable={false}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
});