import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Moriah's Travels</Text>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>LOG IN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.linkText}>SIGN UP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  linkText: {
    fontSize: 16,
    color: "#007BFF",
    textDecorationLine: "underline",
    marginVertical: 5,
  },
});