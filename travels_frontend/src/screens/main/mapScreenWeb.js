import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function MapScreenWeb({ route }) {
  const { latitude, longitude } = route.params || { latitude: 37.7749, longitude: -122.4194 }; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map View (Web)</Text>
      <WebView
        style={styles.map}
        source={{
          uri: `https://www.google.com/maps/embed/v1/view?key=AIzaSyB04WXuf61NNG0W4Gxr0yYxEIuMgN61eBQ&center=${latitude},${longitude}&zoom=14`,
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
