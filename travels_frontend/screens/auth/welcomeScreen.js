import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Moriah's Travels</Text>
      <Button title="Log In" onPress={() => navigation.navigate("Login")} />
      <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});