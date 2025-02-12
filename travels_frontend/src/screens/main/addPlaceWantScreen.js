import React, { useEffect, useState } from "react";
import { 
  View, TextInput, Button, Alert, StyleSheet, FlatList, TouchableOpacity, 
  Text, ScrollView, KeyboardAvoidingView, Platform, Modal, Image
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
  const [customImageName, setCustomImageName] = useState(""); 
  const [modalVisible, setModalVisible] = useState(false);
  const [tempImageUri, setTempImageUri] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: "Places She Wants to Visit",
      headerBackTitle: "Back",
    });

    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Please grant permission to access photos.");
        }
      }
    })();
  }, []);

  const handleAddPlan = () => {
    if (!currentPlan.trim()) {
      Alert.alert("Error", "Plan cannot be empty.");
      return;
    }
    setPlans([...plans, currentPlan.trim()]);
    setCurrentPlan(""); 
  };

  const handleDeletePlan = (index) => {
    setPlans(plans.filter((_, i) => i !== index));
  };

  const pickImage = async () => {
    if (selectedImage) {
      Alert.alert("Action Required", "Please remove the existing image before selecting a new one.");
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Image,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.assets || result.assets.length === 0) {
        console.log("No image selected.");
        return;
      }

      const imageUri = result.assets[0].uri;

      if (Platform.OS === "ios") {
        Alert.prompt(
          "Name Your Image",
          "Please enter a name for this image before continuing.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "OK",
              onPress: (input) => {
                if (!input.trim()) {
                  Alert.alert("Error", "Image name cannot be empty.");
                  return;
                }
                setSelectedImage(imageUri);
                setCustomImageName(input.trim());
              },
            },
          ],
          "plain-text"
        );
      } else {
        setTempImageUri(imageUri);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert("Error", "Something went wrong while picking the image.");
    }
  };

  const handleConfirmImageName = () => {
    if (!customImageName.trim()) {
      Alert.alert("Error", "Image name cannot be empty.");
      return;
    }
    setSelectedImage(tempImageUri);
    setModalVisible(false);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setCustomImageName("");
  };

  const handleAddPlace = async () => {
    if (!name || !address || !hotels || !restaurants || plans.length === 0) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      await addPlace({
        name,
        description,
        address,
        plans: plans.join("; "),
        hotels,
        restaurants,
        imageUri: selectedImage, 
        imageName: customImageName,
        category: "wantToTravel",
      });

      Alert.alert("Success", "Place added successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding place:", error);
      Alert.alert("Error", "Failed to add place.");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.innerContainer}>
          <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
          <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription} />
          <TextInput placeholder="Address" style={styles.input} value={address} onChangeText={setAddress} />
          <TextInput placeholder="Hotels" style={styles.input} value={hotels} onChangeText={setHotels} />
          <TextInput placeholder="Restaurants" style={styles.input} value={restaurants} onChangeText={setRestaurants} />

          <View style={styles.planInputContainer}>
            <TextInput 
              placeholder="Add a plan" 
              style={[styles.input, { flex: 1 }]} 
              value={currentPlan} 
              onChangeText={setCurrentPlan} 
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddPlan}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={plans}
            renderItem={({ item, index }) => (
              <View style={styles.planItemContainer}>
                <Text style={styles.planItem}>{item}</Text>
                <TouchableOpacity onPress={() => handleDeletePlan(index)}>
                  <Text style={styles.deletePlanButton}>X</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          {!selectedImage && (
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Text style={styles.imagePickerText}>📷 Choose Image (Optional)</Text>
            </TouchableOpacity>
          )}

          {selectedImage && (
            <View style={styles.imageNameContainer}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              <Text style={styles.imageNameText}>{customImageName}</Text>
              <TouchableOpacity onPress={handleRemoveImage}>
                <Text style={styles.deleteImageText}>X</Text>
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
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 10 },
  planInputContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  addButton: { backgroundColor: "green", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, marginLeft: 10, alignItems: "center", justifyContent: "center" },
  addButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  deletePlanButton: { color: "red", fontSize: 18, marginRight: 10 },
  imagePickerButton: { backgroundColor: "#007BFF", padding: 10, borderRadius: 5, alignItems: "center", marginVertical: 8, width: "80%", alignSelf: 'center' },
  imagePickerText: { color: "white", fontSize: 14, fontWeight: "bold" },
});