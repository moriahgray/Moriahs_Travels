import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { fetchPlaces } from "../../utils/api";

export default function WantToTravel({ navigation }) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        // Fetch places with category "wantToTravel" from the database
        const places = await fetchPlaces("wantToTravel");
        console.log("Fetched places for WantToTravel:", places);
        setLocations(places);
      } catch (error) {
        console.error("Error fetching places:", error);
        Alert.alert("Error", "Failed to load places.");
      }
    };

    loadPlaces();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={locations}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.title}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("PlaceDetails", { place: item })}
            >
              <Text style={styles.buttonText}>Take me there!</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No places have been added yet!</Text>}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddPlaceWantScreen", { category: "wantToTravel" })}
      >
        <Text style={styles.addButtonText}>Send Her Somewhere!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    backgroundColor: "#FFF",
    borderRadius: 5,
  },
  itemText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginTop: 20,
  },
});