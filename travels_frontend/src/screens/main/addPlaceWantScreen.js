import React, { useEffect, useState } from "react";
import { 
  View, TextInput, Button, Alert, StyleSheet, FlatList, TouchableOpacity, 
  Text, Image, ScrollView, KeyboardAvoidingView, Platform 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { addPlace } from "../../utils/api";

export default function AddPlaceWantScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState("");
  const [hotels, setHotels] = useState("");
  const [restaurants, setRestaurants] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: "Send Her Somewhere",
      headerBackTitle: "Back",
    });
  }, [navigation]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to grant photo library access to select an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

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
        category: "wantToTravel",
        hotels,
        restaurants,
        imageUri: selectedImage,
      });

      if (result) {
        Alert.alert("Success", "Place added successfully!");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to add place.");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.innerContainer}>
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
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />

          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <Text style={styles.imagePickerText}>Choose Image (Optional)</Text>
          </TouchableOpacity>

          {selectedImage && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.image} />
              <TouchableOpacity onPress={() => setSelectedImage(null)}>
                <Text style={styles.deleteImage}>X</Text>
              </TouchableOpacity>
            </View>
          )}

          <Button title="Add Place" onPress={handleAddPlace} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flexGrow: 1, padding: 20, paddingBottom: 50 },
  innerContainer: { flexGrow: 1 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 10 },
  addButton: { backgroundColor: "#28A745", padding: 10, alignItems: "center", borderRadius: 5, marginBottom: 10 },
  addButtonText: { color: "#fff", fontSize: 16 },
  planItemContainer: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  planItem: { fontSize: 16 },
  deletePlanButton: { color: "red", marginLeft: 10, fontSize: 16 },
  imagePickerButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  imagePickerText: { color: "#fff", fontSize: 16 },
  imageContainer: { alignItems: "center", marginTop: 10 },
  image: { width: "100%", height: 200, marginBottom: 10 },
  deleteImage: { color: "red", fontSize: 18 },
});