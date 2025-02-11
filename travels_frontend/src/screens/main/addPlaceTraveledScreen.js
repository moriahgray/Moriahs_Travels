import React, { useEffect, useState } from "react";
import { 
  View, TextInput, Button, Alert, StyleSheet, FlatList, TouchableOpacity, 
  Text, ScrollView, KeyboardAvoidingView, Platform, Modal
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function AddPlaceTraveledScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [plans, setPlans] = useState([]);  // List of plans
  const [currentPlan, setCurrentPlan] = useState(""); // Current text input for plan
  const [hotels, setHotels] = useState("");
  const [restaurants, setRestaurants] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [customImageName, setCustomImageName] = useState(""); 
  const [modalVisible, setModalVisible] = useState(false);
  const [tempImageUri, setTempImageUri] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: "Place She Visited",
      headerBackTitle: "Back",
    });
  }, [navigation]);

  const pickImage = async () => {
    if (selectedImage) {
      Alert.alert("Action Required", "Please remove the existing image before selecting a new one.");
      return;
    }

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

    if (!result.canceled && result.assets && result.assets.length > 0) {
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

  const handleAddPlan = () => {
    if (!currentPlan.trim()) {
      Alert.alert("Error", "Plan cannot be empty.");
      return;
    }
    setPlans([...plans, currentPlan.trim()]); // Add plan to the list
    setCurrentPlan(""); // Clear input after adding
  };

  const handleDeletePlan = (index) => {
    const updatedPlans = plans.filter((_, i) => i !== index);
    setPlans(updatedPlans);
  };

  const handleAddPlace = async () => {
    if (!name || !address || !hotels || !restaurants || plans.length === 0) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (selectedImage && !customImageName.trim()) {
      Alert.alert("Error", "Please enter a name for the image.");
      return;
    }

    try {
      const plansString = plans.join("; ");
      console.log({
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
        imageName: customImageName,
      });

      Alert.alert("Success", "Place added successfully!");
      navigation.goBack();
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
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.innerContainer}>
          <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
          <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription} />
          <TextInput placeholder="Address" style={styles.input} value={address} onChangeText={setAddress} />
          <TextInput placeholder="Hotels" style={styles.input} value={hotels} onChangeText={setHotels} />
          <TextInput placeholder="Restaurants" style={styles.input} value={restaurants} onChangeText={setRestaurants} />

          {/* Add Plan Input */}
          <View style={styles.planInputContainer}>
            <TextInput 
              placeholder="Add a plan" 
              style={[styles.input, { flex: 1 }]} 
              value={currentPlan} 
              onChangeText={setCurrentPlan} 
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddPlan}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Plans List */}
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

          <TouchableOpacity 
            style={styles.imagePickerButton} 
            onPress={pickImage} 
            disabled={selectedImage !== null}
          >
            <Text style={[styles.imagePickerText, selectedImage && { opacity: 0.5 }]}>
              {selectedImage ? "Image Selected" : "Choose Image (Optional)"}
            </Text>
          </TouchableOpacity>

          {selectedImage && (
            <View style={styles.imageNameContainer}>
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
  innerContainer: { flexGrow: 1 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 10 },
  planInputContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  addButton: { backgroundColor: "#28A745", padding: 10, borderRadius: 5, marginLeft: 10 },
  addButtonText: { color: "#fff", fontSize: 16 },
  planItemContainer: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 },
  deletePlanButton: { color: "red", fontSize: 16 },
});