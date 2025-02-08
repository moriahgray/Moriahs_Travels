import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet, FlatList, TouchableOpacity, Text, Image } from "react-native";
import { addPlace } from "../../utils/api";

export default function AddPlaceTraveledScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState("");
  const [hotels, setHotels] = useState("");
  const [restaurants, setRestaurants] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const handleAddPlace = async () => {
    if (!name || !address || !hotels || !restaurants || plans.length === 0) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const plansString = plans.join("; ");

      const result = await addPlace({
        name,
        description,
        address,
        latitude: 0,
        longitude: 0,
        plans: plansString,
        category: "traveled",
        hotels,
        restaurants,
        imageUri: selectedImage,
      });

      if (result) {
        Alert.alert("Success", "Place added successfully!");
        navigation.goBack(); // Go back after adding place
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to add place.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription} />
      <TextInput placeholder="Address" style={styles.input} value={address} onChangeText={setAddress} />
      <TextInput placeholder="Hotels" style={styles.input} value={hotels} onChangeText={setHotels} />
      <TextInput placeholder="Restaurants" style={styles.input} value={restaurants} onChangeText={setRestaurants} />

      <TextInput placeholder="Add a plan" style={styles.input} value={currentPlan} onChangeText={setCurrentPlan} />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          if (currentPlan.trim()) {
            setPlans([...plans, currentPlan.trim()]);
            setCurrentPlan("");
          }
        }}
      >
        <Text style={styles.addButtonText}>Add Plan</Text>
      </TouchableOpacity>

      <FlatList
        data={plans}
        renderItem={({ item, index }) => (
          <View style={styles.planItemContainer}>
            <Text style={styles.planItem}>{`Plan ${index + 1}: ${item}`}</Text>
            <TouchableOpacity onPress={() => setPlans(plans.filter((_, i) => i !== index))}>
              <Text style={styles.deletePlanButton}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {!selectedImage && (
        <Button title="Choose Image (Optional)" onPress={() => setSelectedImage("path/to/image.jpg")} />
      )}

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
          <TouchableOpacity onPress={() => setSelectedImage("")}>
            <Text style={styles.deleteImage}>X</Text>
          </TouchableOpacity>
        </View>
      )}

      <Button
        title="Add Place"
        onPress={handleAddPlace}
        disabled={!name || !address || !hotels || !restaurants || plans.length === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", marginTop: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 10 },
  addButton: { backgroundColor: "#28A745", padding: 10, alignItems: "center", borderRadius: 5, marginBottom: 10 },
  addButtonText: { color: "#fff", fontSize: 16 },
  planItemContainer: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  planItem: { fontSize: 16 },
  deletePlanButton: { color: "red", marginLeft: 10, fontSize: 16 },
  imageContainer: { alignItems: "center", marginTop: 10 },
  image: { width: "100%", height: 200, marginBottom: 10 },
  deleteImage: { color: "red", fontSize: 18 },
});