import React, { useEffect, useState } from "react";
import { 
  View, TextInput, Button, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, TouchableOpacity 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { addPlace } from "../../utils/api";

export default function AddPlaceWantScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [plans, setPlans] = useState("");
  const [hotels, setHotels] = useState("");
  const [restaurants, setRestaurants] = useState("");
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: "Add Place (Want to Visit)",
      headerBackTitle: "Back"
    });

    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "You need to allow access to photos.");
        }
      }
    })();
  }, []);

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddPlace = async () => {
    if (!name || !address || !hotels || !restaurants || !plans) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      await addPlace({
        title: name,
        description,
        address,
        plans,
        hotels,
        restaurants,
        imageUri,
        category: "wantToVisit",
      });

      Alert.alert("Success", "Place added successfully!");
      setName(""); setDescription(""); setAddress(""); setPlans(""); setHotels(""); setRestaurants(""); setImageUri(null);
    } catch (error) {
      console.error("Error adding place:", error);
      Alert.alert("Error", "Failed to add place.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
          <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription} multiline />
          <TextInput placeholder="Address" style={styles.input} value={address} onChangeText={setAddress} />
          <TextInput placeholder="Plans" style={styles.input} value={plans} onChangeText={setPlans} multiline />
          <TextInput placeholder="Hotels" style={styles.input} value={hotels} onChangeText={setHotels} />
          <TextInput placeholder="Restaurants" style={styles.input} value={restaurants} onChangeText={setRestaurants} />

          <TouchableOpacity style={styles.imagePicker} onPress={handleChooseImage}>
            {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : <Button title="Choose Image" onPress={handleChooseImage} />}
          </TouchableOpacity>

          <Button title="Add Place" onPress={handleAddPlace} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
