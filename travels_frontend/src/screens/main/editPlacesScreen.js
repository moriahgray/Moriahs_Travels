import React, { useEffect, useState } from "react";
import { 
  View, TextInput, Button, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Text 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { updatePlace, getPlaceDetails } from "../../utils/api";

export default function EditPlaceScreen({ route, navigation }) {
  const { placeId, category } = route.params;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [plans, setPlans] = useState("");
  const [hotels, setHotels] = useState("");
  const [restaurants, setRestaurants] = useState("");
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    navigation.setOptions({ 
      title: "Edit Place",
      headerBackTitle: "Back",
      headerBackTitleVisible: false,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
          <Text style={{ color: "blue", fontSize: 17 }}>Back</Text>
        </TouchableOpacity>
      ),
    });

    const loadPlaceDetails = async () => {
      try {
        const place = await getPlaceDetails(placeId);
        if (place) {
          setName(place.title || "");
          setDescription(place.description || "");
          setAddress(place.address || "");
          setPlans(place.plans || "");
          setHotels(place.hotels || "");
          setRestaurants(place.restaurants || "");
          setImageUri(place.image_uri || null);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
        Alert.alert("Error", "Failed to load place details.");
      }
    };

    loadPlaceDetails();
  }, [placeId, navigation]);

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

  const handleUpdatePlace = async () => {
    if (!name || !address || !hotels || !restaurants || !plans) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      await updatePlace(placeId, {
        title: name,
        description,
        address,
        plans,
        hotels,
        restaurants,
        imageUri,
        category,
      });

      Alert.alert("Success", "Place updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating place:", error);
      Alert.alert("Error", "Failed to update place.");
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

          <Button title="Update Place" onPress={handleUpdatePlace} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flexGrow: 1, padding: 20 },
  innerContainer: { flexGrow: 1 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 10, backgroundColor: "#f9f9f9" },
  imagePicker: { alignItems: "center", justifyContent: "center", marginBottom: 20 },
  image: { width: 200, height: 200, borderRadius: 10 },
});