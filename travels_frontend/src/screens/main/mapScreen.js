import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const MapScreen = ({ route }) => {
  const { latitude = 37.7749, longitude = -122.4194 } = route.params || {};

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: enter_your_api_key,
  });

  if (loadError) return <Text style={styles.errorText}>Error loading maps</Text>;
  if (!isLoaded) return <Text style={styles.loadingText}>Loading Maps...</Text>;

  return (
    <View style={styles.container}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: latitude, lng: longitude }}
        zoom={14}
      >
        <Marker position={{ lat: latitude, lng: longitude }} />
      </GoogleMap>

      <View style={styles.zoomControls}>
        <TouchableOpacity onPress={() => alert("Zoom In")} style={styles.zoomButton}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert("Zoom Out")} style={styles.zoomButton}>
          <Text style={styles.zoomText}>-</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  zoomControls: {
    position: "absolute",
    right: 10,
    top: 10,
    flexDirection: "column",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 5,
    padding: 5,
  },
  zoomButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    marginVertical: 5,
  },
  zoomText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "red",
  },
});

export default MapScreen;
