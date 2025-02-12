import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity } from "react-native";
import { deletePlace } from "../../utils/api";
import { MaterialIcons } from "@expo/vector-icons";

export default function PlaceDetails({ route, navigation }) {
  const { place } = route.params;

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
  }, [navigation, place]);

  // Navigate to Edit screen
  const handleEdit = () => {
    navigation.navigate("EditPlaceScreen", { placeId: place.id, category: place.category });
  };

  // Delete the place
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
        {place.imageUri || place.image_uri ? (
          <Image source={{ uri: place.imageUri || place.image_uri }} style={styles.image} />
        ) : (
          <Image source={require("../../../assets/splash-icon.png")} style={styles.image} />
        )}

        <Text style={styles.sectionTitle}>Plans</Text>
        <Text style={styles.content}>{place.plans || "No plans available"}</Text>

        <Text style={styles.sectionTitle}>Hotels</Text>
        <Text style={styles.content}>{place.hotels || "No hotel information available"}</Text>

        <Text style={styles.sectionTitle}>Restaurants</Text>
        <Text style={styles.content}>{place.restaurants || "No restaurant information available"}</Text>

        <TouchableOpacity style={styles.showOnMapButton} onPress={() => navigation.navigate("MapScreen", { latitude: place.latitude, longitude: place.longitude })}>
          <Text style={styles.showOnMapText}>Show on Map</Text>
        </TouchableOpacity>

        {/* ✅ Edit & Delete Buttons */}
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