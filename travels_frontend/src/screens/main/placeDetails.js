import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity } from "react-native";
import { deletePlace } from "../../utils/api";
import { MaterialIcons } from "@expo/vector-icons";
import API_URL from "../../utils/api"; // Ensure API_URL is imported

export default function PlaceDetails({ route, navigation }) {
  const { place } = route.params;

  useEffect(() => {
    console.log("Place details:", place); // Debugging: Check if image_uri exists
    console.log("Full Image URL:", `${API_URL}/uploads/${place.image_uri}`); // Debugging

    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerIcons}>
          <MaterialIcons
            name="edit"
            size={30}
            color="blue"
            style={styles.icon}
            onPress={handleEdit}
          />
          <MaterialIcons
            name="delete"
            size={30}
            color="red"
            style={styles.icon}
            onPress={handleDelete}
          />
        </View>
      ),
    });
  }, [navigation, place]);

  // Navigate to edit screen with placeId and category
  const handleEdit = () => {
    navigation.navigate("EditPlace", { placeId: place.id, category: place.category });
  };

  // Delete the place and handle navigation
  const handleDelete = async () => {
    Alert.alert(
      "Delete Place",
      `Are you sure you want to delete "${place.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await deletePlace(place.id);
              if (result) {
                Alert.alert("Success", `${place.title} has been deleted.`);
                navigation.goBack();
              }
            } catch (error) {
              console.error("Error deleting place:", error);
              Alert.alert("Error", "Failed to delete the place.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleShowOnMap = () => {
    navigation.navigate("MapScreen", {
      latitude: place.latitude,
      longitude: place.longitude,
      name: place.title,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{place.title}</Text>
        {place.description && <Text style={styles.description}>{place.description}</Text>}

        {/* ✅ FIXED: Ensure Image is Displayed with Full URL */}
        {place.image_uri ? (
          <Image
            source={{ uri: `${API_URL}/uploads/${place.image_uri}` }} // Ensuring full path
            style={styles.image}
            onError={(e) => console.log("Image load error:", e.nativeEvent)}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.noImageText}>No image available</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Plans</Text>
        <Text style={styles.content}>
          {place.plans ? place.plans.split("; ").join("\n") : "No plans available"}
        </Text>

        <Text style={styles.sectionTitle}>Hotels</Text>
        <Text style={styles.content}>{place.hotels || "No hotel information available"}</Text>

        <Text style={styles.sectionTitle}>Restaurants</Text>
        <Text style={styles.content}>{place.restaurants || "No restaurant information available"}</Text>

        <TouchableOpacity style={styles.showOnMapButton} onPress={handleShowOnMap}>
          <Text style={styles.showOnMapText}>Show on Map</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20, paddingBottom: 50 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 5 },
  content: { fontSize: 16 },
  image: { width: "100%", height: 200, marginBottom: 10, borderRadius: 10 },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 10,
    marginBottom: 10,
  },
  noImageText: { fontSize: 16, color: "#555" },
  showOnMapButton: { backgroundColor: "#28A745", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 20 },
  showOnMapText: { color: "#fff", fontSize: 16 },
  headerIcons: { flexDirection: "row", marginRight: 10 },
  icon: { marginHorizontal: 10 },
});