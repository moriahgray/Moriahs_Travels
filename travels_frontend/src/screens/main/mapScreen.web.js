// mapScreenWeb.js
import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { GoogleMap, useLoadScript, Marker as WebMarker } from '@react-google-maps/api';

export default function MapScreenWeb({ route }) {
  const { latitude, longitude, name } = route.params;
  
  // Replace with your actual API key
  const googleMapsApiKey = your_api_key;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
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
        <WebMarker
          position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
          title={name}
        />
      </GoogleMap>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', fontSize: 18 },
});