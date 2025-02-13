import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { deletePlace, getPlaceDetails } from "../../utils/api";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

export default function PlaceDetails({ route, navigation }) {
  const { place } = route.params;
  const [updatedPlace, setUpdatedPlace] = useState(place);
  const [imageExists, setImageExists] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Add loading state

  // **Fetch latest place details from the backend**
  const fetchUpdatedPlace = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching latest place details for ID:", place.id);
      const latestPlace = await getPlaceDetails(place.id);
      console.log("✅ Updated place details:", latestPlace);
      setUpdatedPlace(latestPlace);
      checkFileExists(latestPlace.image_uri);
    } catch (error) {
      console.error("❌ Error fetching updated place details:", error);
      Alert.alert("Error", "Failed to refresh place details.");
    } finally {
      setLoading(false);
    }
  };

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

    console.log("Loaded place details:", updatedPlace);
    checkFileExists(updatedPlace.image_uri);
  }, [navigation, updatedPlace]);

  // ✅ **Force refresh when returning from EditPlaceScreen**
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("🔄 Reloading place details from backend after edit...");
      fetchUpdatedPlace(); // ✅ Fetch latest data instead of using route.params
    });

    return unsubscribe;
  }, [navigation]);

  const checkFileExists = async (uri) => {
    if (uri) {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      console.log("📂 File Info:", fileInfo);
      setImageExists(fileInfo.exists);
    }
  };

  const handleEdit = () => {
    navigation.navigate("EditPlaceScreen", { placeId: updatedPlace.id, category: updatedPlace.category });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Place",
      `Are you sure you want to delete "${updatedPlace.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePlace(updatedPlace.id);
              Alert.alert("Success", `${updatedPlace.title} has been deleted.`);
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
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text>Loading updated details...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>{updatedPlace.title}</Text>
          {updatedPlace.description && <Text style={styles.description}>{updatedPlace.description}</Text>}

          {imageExists ? (
            <Image source={{ uri: updatedPlace.image_uri }} style={styles.image} />
          ) : (
            <Text style={{ color: "red", textAlign: "center" }}>Image not found!</Text>
          )}

          <Text style={styles.sectionTitle}>Plans</Text>
          <Text style={styles.content}>{updatedPlace.plans || "No plans available"}</Text>

          <Text style={styles.sectionTitle}>Hotels</Text>
          <Text style={styles.content}>{updatedPlace.hotels || "No hotel information available"}</Text>

          <Text style={styles.sectionTitle}>Restaurants</Text>
          <Text style={styles.content}>{updatedPlace.restaurants || "No restaurant information available"}</Text>

          <TouchableOpacity
            style={styles.showOnMapButton}
            onPress={() => navigation.navigate("MapScreen", { latitude: updatedPlace.latitude, longitude: updatedPlace.longitude })}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
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
