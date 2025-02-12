import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
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
      headerBackTitle: "Back",
      headerBackTitleVisible: false,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
          <Text style={{ color: "blue", fontSize: 17 }}>Back</Text>
        </TouchableOpacity>
      ),
    });

    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "You need to allow access to photos.");
        }
      }
    })();
  }, [navigation]);

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      try {
        const pickedUri = result.assets[0].uri;
        const fileName = pickedUri.split("/").pop() || `image_${Date.now()}.jpg`;
        const localFolder = `${FileSystem.documentDirectory}myImages/`;
        await FileSystem.makeDirectoryAsync(localFolder, { intermediates: true });
        const newPath = `${localFolder}${fileName}`;

        await FileSystem.copyAsync({ from: pickedUri, to: newPath });
        setImageUri(newPath);
      } catch (err) {
        console.error("Error copying file:", err);
        Alert.alert("Error", "Failed to save image locally.");
      }
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
      setName("");
      setDescription("");
      setAddress("");
      setPlans("");
      setHotels("");
      setRestaurants("");
      setImageUri(null);
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
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <Button title="Choose Image" onPress={handleChooseImage} />
            )}
          </TouchableOpacity>

          <Button title="Add Place" onPress={handleAddPlace} />
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