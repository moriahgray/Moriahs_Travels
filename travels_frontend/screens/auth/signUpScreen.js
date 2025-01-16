import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { signup } from "../../utils/api";

export default function SignUpScreen({ navigation }) {
  const [user_id, setUserId] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await signup({ user_id, first_name, last_name, email, password });
      navigation.navigate("Login");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="User ID" style={styles.input} onChangeText={setUserId} />
      <TextInput placeholder="First Name" style={styles.input} onChangeText={setFirstName} />
      <TextInput placeholder="Last Name" style={styles.input} onChangeText={setLastName} />
      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={setPassword} />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
});