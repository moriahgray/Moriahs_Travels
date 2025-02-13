import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { addPlace } from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddPlaceWantScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [plans, setPlans] = useState("");
  const [hotels, setHotels] = useState("");
  const [restaurants, setRestaurants] = useState("");
  const [imageUri, setImageUri] = useState(null);

  const handleAddPlace = async () => {
    if (!name || !address || !hotels || !restaurants || !plans) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const user_id = await AsyncStorage.getItem("user_id");

      if (!user_id) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }

      await addPlace({
        title: name,
        description,
        address,
        plans,
        hotels,
        restaurants,
        imageUri,
        category: "wantToTravel",
        user_id,
      });

      Alert.alert("Success", "Place added successfully.");
      setName("");
      setDescription("");
      setAddress("");
      setPlans("");
      setHotels("");
      setRestaurants("");
      setImageUri(null);
      navigation.goBack();
    } catch (error) {
      console.error("Error adding place:", error);
      Alert.alert("Error", "Failed to add place.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>Address</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />

      <Text style={styles.label}>Plans</Text>
      <TextInput style={styles.input} value={plans} onChangeText={setPlans} multiline />

      <Text style={styles.label}>Hotels</Text>
      <TextInput style={styles.input} value={hotels} onChangeText={setHotels} />

      <Text style={styles.label}>Restaurants</Text>
      <TextInput style={styles.input} value={restaurants} onChangeText={setRestaurants} />

      <TouchableOpacity style={styles.button} onPress={handleAddPlace}>
        <Text style={styles.buttonText}>Add Place</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 15 },
  button: { backgroundColor: "#007BFF", padding: 15, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#FFF", fontSize: 16 },
});