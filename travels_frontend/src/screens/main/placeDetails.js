import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity } from "react-native";
import { deletePlace } from "../../utils/api";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

export default function PlaceDetails({ route, navigation }) {
  const { place } = route.params;
  const [imageExists, setImageExists] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Place Details",
      headerBackTitle: "Back",
      headerBackTitleVisible: false,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
          <MaterialIcons name="arrow-back" size={24} color="blue" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      ),
    });

    console.log("Loaded place details:", place);
    checkFileExists(place.image_uri);
  }, [navigation, place]);

  const checkFileExists = async (uri) => {
    if (uri) {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      console.log("File Info:", fileInfo);
      setImageExists(fileInfo.exists);
    }
  };

  const handleEdit = () => {
    navigation.navigate("EditPlaceScreen", { placeId: place.id, category: place.category });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Place",
      `Are you sure you want to delete "${place.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePlace(place.id);
              Alert.alert("Success", `${place.title} has been deleted.`);
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "Failed to delete the place.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{place.title}</Text>
        {place.description && <Text style={styles.description}>{place.description}</Text>}

        {/* Debugging: Show Image URI */}
        <Text style={{ color: "red" }}>Image URI: {place.image_uri}</Text>

        {imageExists ? (
          <Image source={{ uri: place.image_uri }} style={styles.image} />
        ) : (
          <Text style={{ color: "red", textAlign: "center" }}>Image not found!</Text>
        )}

        <Text style={styles.sectionTitle}>Plans</Text>
        <Text style={styles.content}>{place.plans || "No plans available"}</Text>

        <Text style={styles.sectionTitle}>Hotels</Text>
        <Text style={styles.content}>{place.hotels || "No hotel information available"}</Text>

        <Text style={styles.sectionTitle}>Restaurants</Text>
        <Text style={styles.content}>{place.restaurants || "No restaurant information available"}</Text>

        <TouchableOpacity
          style={styles.showOnMapButton}
          onPress={() => navigation.navigate("MapScreen", { latitude: place.latitude, longitude: place.longitude })}
        >
          <Text style={styles.showOnMapText}>Show on Map</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <MaterialIcons name="edit" size={24} color="white" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <MaterialIcons name="delete" size={24} color="white" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  content: { fontSize: 16 },
  image: { width: "100%", height: 250, borderRadius: 10, marginBottom: 10, resizeMode: "cover" },
  showOnMapButton: { backgroundColor: "#28A745", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 20 },
  showOnMapText: { color: "#fff", fontSize: 16 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  editButton: { backgroundColor: "#007BFF", flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 5 },
  deleteButton: { backgroundColor: "#DC3545", flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 5 },
  buttonText: { color: "white", fontSize: 16, marginLeft: 5 },
  backText: { fontSize: 17, color: "blue", marginLeft: 5 },
});