import React, { useEffect, useState } from "react";
import { View, FlatList, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { getPlaces } from "../../utils/api";

export default function TraveledTo({ navigation }) {
  const [locations, setLocations] = useState([]);

  const loadPlaces = async () => {
    try {
      const places = await getPlaces("traveled");
      setLocations(places);
    } catch (error) {
      console.error("Error fetching places:", error);
      Alert.alert("Error", "Failed to load places.");
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: "Where She Has Gone",
      headerBackTitle: "Back", 
    });

    loadPlaces(); 
  }, [navigation]);

  //Force refresh when returning from Add or Place Details screens
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadPlaces();
    });

    return unsubscribe;
  }, [navigation]);

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
        onPress={() => navigation.navigate("AddPlaceTraveledScreen", { category: "traveled" })}
      >
        <Text style={styles.addButtonText}>Oop, She Went Somewhere!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ccc", marginBottom: 10, backgroundColor: "#FFF", borderRadius: 5 },
  itemText: { fontSize: 18, marginBottom: 10 },
  button: { backgroundColor: "#28A745", padding: 10, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#FFF", fontSize: 16 },
  addButton: { backgroundColor: "#007BFF", padding: 15, borderRadius: 5, alignItems: "center", marginTop: 20 },
  addButtonText: { color: "#FFF", fontSize: 16 },
  emptyText: { textAlign: "center", fontSize: 16, color: "#555", marginTop: 20 },
});
