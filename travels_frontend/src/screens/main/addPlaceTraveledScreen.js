import React, { useEffect, useState } from "react";
import {
  View, TextInput, Button, Alert, StyleSheet, FlatList, TouchableOpacity,
  Text, ScrollView, KeyboardAvoidingView, Platform, Modal, Image
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function AddPlaceTraveledScreen({ navigation }) {
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
    if (Platform.OS !== "web") {
      (async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Please grant permission to access photos.");
        }
      })();
    }
  }, []);

  const handleAddPlan = () => {
    if (!currentPlan.trim()) {
      Alert.alert("Error", "Plan cannot be empty.");
      return;
    }
    setPlans([...plans, currentPlan.trim()]);
    setCurrentPlan("");
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.assets || result.assets.length === 0) {
        console.log("No image selected.");
        return;
      }

      const imageUri = result.assets[0].uri;

      if (Platform.OS === "web" || Platform.OS === "android") {
        setTempImageUri(imageUri);
        setModalVisible(true); // ✅ Ensuring modal is properly opened
        return;
      }

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
    setModalVisible(false); // ✅ Ensuring modal properly closes
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setCustomImageName("");
  };

  const handleAddPlace = () => {
    if (!name || !address || !hotels || !restaurants || plans.length === 0 || !selectedImage) {
      Alert.alert("Error", "All fields and an image are required.");
      return;
    }

    if (selectedImage && !customImageName.trim()) {
      Alert.alert("Error", "Please enter a name for the image.");
      return;
    }

    console.log({
      name,
      description,
      address,
      plans: plans.join("; "),
      hotels,
      restaurants,
      imageUri: selectedImage,
      imageName: customImageName,
    });

    Alert.alert("Success", "Place added successfully!");
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.innerContainer}>
          <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
          <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription} />
          <TextInput placeholder="Address" style={styles.input} value={address} onChangeText={setAddress} />
          <TextInput placeholder="Hotels" style={styles.input} value={hotels} onChangeText={setHotels} />
          <TextInput placeholder="Restaurants" style={styles.input} value={restaurants} onChangeText={setRestaurants} />

          {/* ✅ "Add Plan" Button Now Works */}
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

          {/* Plans List */}
          <FlatList
            data={plans}
            renderItem={({ item, index }) => (
              <View style={styles.planItemContainer}>
                <TouchableOpacity onPress={() => setPlans(plans.filter((_, i) => i !== index))}>
                  <Text style={styles.deletePlanButton}>X</Text>
                </TouchableOpacity>
                <Text style={styles.planItem}>{item}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          {/* Show "Choose Image" button only if no image is selected */}
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

          <Modal visible={modalVisible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}> 
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Name Your Image</Text>
                <TextInput
                  placeholder="Enter image name"
                  style={styles.modalInput}
                  value={customImageName}
                  onChangeText={setCustomImageName}
                />
                <TouchableOpacity style={styles.modalButton} onPress={handleConfirmImageName}>
                  <Text style={styles.modalButtonText}>CONFIRM</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Button title="Add Place" onPress={handleAddPlace} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:"#fff"},
  scrollContainer:{flexGrow:1,padding:20,paddingBottom:50},
  input:{borderWidth:1,borderColor:"#ccc",borderRadius:5,padding:10,marginBottom:10},
  planInputContainer:{flexDirection:"row",alignItems:"center",marginBottom:10},
  addButton:{backgroundColor:"green",padding:10,borderRadius:5,marginLeft:10,alignItems:"center",justifyContent:"center"},
  addButtonText:{color:"white",fontSize:16,fontWeight:"bold"},
  deletePlanButton:{color:"red",fontSize:18,marginRight:10},
  imagePickerButton:{backgroundColor:"#007BFF",padding:12,borderRadius:5,alignItems:"center",marginVertical:10},
  imagePickerText:{color:"white",fontSize:16,fontWeight:"bold"},
  imageNameContainer:{flexDirection:"column",alignItems:"center",marginTop:10},
  imagePreview:{width:100,height:100,borderRadius:10,marginTop:10},
  imageNameText:{fontSize:16,marginTop:5},
  deleteImageText:{color:"red",fontSize:18,marginTop:5},
  modalContainer:{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"rgba(0,0,0,0.5)"},
  modalContent:{backgroundColor:"#fff",padding:20,width:"80%",borderRadius:10,alignItems:"center"},
  modalTitle:{fontSize:18,fontWeight:"bold",marginBottom:10,textAlign:"center"},
  modalInput:{width:"100%",borderWidth:1,borderColor:"#ccc",borderRadius:5,padding:10,marginBottom:15,fontSize:16},
  modalButton:{backgroundColor:"#007BFF",paddingVertical:12,paddingHorizontal:20,borderRadius:5,alignItems:"center",width:"100%"},
  modalButtonText:{color:"white",fontSize:16,fontWeight:"bold",textAlign:"center"}
});