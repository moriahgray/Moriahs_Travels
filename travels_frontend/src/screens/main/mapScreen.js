import { Platform } from 'react-native';

let MapScreen;

if (Platform.OS === 'web') {
  MapScreen = require('./mapScreen.web').default;
} else {
  // Native (iOS/Android): Using react-native-maps
  const React = require('react');
  const { StyleSheet, View } = require('react-native');
  const MapView = require('react-native-maps').default;
  const Marker = require('react-native-maps').Marker;

  function MapScreenNative({ route }) {
    const { latitude, longitude, name } = route.params;

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            }}
            title={name}
          />
        </MapView>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
  });

  MapScreen = MapScreenNative;
}

export default MapScreen;