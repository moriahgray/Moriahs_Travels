import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

export default function MapScreen({ route, navigation }) {
  const { latitude, longitude, name } = route.params;
  const googleMapsApiKey = your_google_api_key;

  useEffect(() => {
    navigation.setOptions({
      title: "Map",
      headerBackTitle: "Back",
      headerBackTitleVisible: false,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
          <Text style={{ color: "blue", fontSize: 17 }}>Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
  });

  if (loadError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading map.</Text>
      </View>
    );
  }

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GoogleMap
        mapContainerStyle={styles.map}
        center={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
        zoom={15}
      >
        <Marker position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }} title={name} />
      </GoogleMap>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  map: { width: "100%", height: "100%" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 18 },
});