import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview"; // For Expo & RN CLI

export default function MapScreenWeb({ route }) {
  const { latitude, longitude } = route.params || { latitude: 37.7749, longitude: -122.4194 }; // Default: San Francisco

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map View (Web)</Text>
      <WebView
        style={styles.map}
        source={{
          uri: `https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${latitude},${longitude}&zoom=14`,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  map: { width: "100%", height: "80%" },
});