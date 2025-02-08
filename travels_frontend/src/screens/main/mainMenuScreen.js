import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { removeToken } from "../../utils/storage"; // Import removeToken for logout

export default function MainMenuScreen({ navigation, setIsAuthenticated }) {
  useEffect(() => {
    navigation.setOptions({
      title: "Home",
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Logout Function
  const handleLogout = async () => {
    try {
      await removeToken(); 
      setIsAuthenticated(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Logout Failed", "An error occurred while logging out.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Moriah's Travels</Text>

      <TouchableOpacity onPress={() => navigation.navigate("TraveledTo")}>
        <Text style={styles.linkText}>Where She Has Gone</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("WantToTravel")}>
        <Text style={styles.linkText}>Where She Wants to Go</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  linkText: {
    fontSize: 18,
    color: "#007BFF", // Same color as links in authentication screens
    textDecorationLine: "underline", // Underlined text
    marginVertical: 10,
  },
  logoutText: {
    fontSize: 16,
    color: "#DC3545", 
    marginRight: 15, 
  },
});