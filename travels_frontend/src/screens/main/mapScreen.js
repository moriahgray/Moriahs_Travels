import React, { useLayoutEffect, useRef, useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, Text, Platform } from "react-native";
import MapView from "react-native-maps";
import MapScreenWeb from "./mapScreenWeb";

const MapScreen = ({ route, navigation }) => {
  if (Platform.OS === "web") {
    return <MapScreenWeb route={route} />;
  }

  const { latitude, longitude } = route.params || {};
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
      setZoomLevel((prevZoom) => prevZoom / 2);
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: zoomLevel / 2,
        longitudeDelta: zoomLevel / 2,
      }, 1000);
    }
  };

  const zoomOutHandler = () => {
    if (mapRef.current) {
      setZoomLevel((prevZoom) => prevZoom * 2);
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: zoomLevel * 2,
        longitudeDelta: zoomLevel * 2,
      }, 1000);
    }
  };

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
      />
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
});

export default MapScreen;