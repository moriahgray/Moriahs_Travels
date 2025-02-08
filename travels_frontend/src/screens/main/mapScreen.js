import React, { useLayoutEffect, useRef, useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, Text, Platform } from "react-native";
import MapView from "react-native-maps";

const MapScreen = ({ route, navigation }) => {
  const { latitude, longitude } = route.params || {};

  // Ensure that latitude and longitude are provided
  if (!latitude || !longitude) {
    Alert.alert("Error", "Invalid location data");
    return null;
  }

  const mapRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(0.05);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: "Map View" });
  }, [navigation]);

  const zoomInHandler = () => {
    if (mapRef.current) {
      setZoomLevel((prevZoom) => {
        const newZoom = prevZoom / 2;
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: newZoom,
            longitudeDelta: newZoom,
          },
          1000
        );
        return newZoom;
      });
    }
  };

  const zoomOutHandler = () => {
    if (mapRef.current) {
      setZoomLevel((prevZoom) => {
        const newZoom = prevZoom * 2;
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: newZoom,
            longitudeDelta: newZoom,
          },
          1000
        );
        return newZoom;
      });
    }
  };

  // ✅ Handle Web Case: Show Message Instead of Map
  if (Platform.OS === "web") {
    return (
      <View style={styles.webContainer}>
        <Text style={styles.webMessage}>
          Map view is not available on Web. Please use mobile for full functionality.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        }}
        onMapReady={() => {
          if (mapRef.current) {
            mapRef.current.animateToRegion(
              {
                latitude,
                longitude,
                latitudeDelta: zoomLevel,
                longitudeDelta: zoomLevel,
              },
              1000
            );
          }
        }}
      />
      {/* Zoom controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity onPress={zoomInHandler} style={styles.zoomButton}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={zoomOutHandler} style={styles.zoomButton}>
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
  webContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  webMessage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF0000",
    textAlign: "center",
  },
});

export default MapScreen;