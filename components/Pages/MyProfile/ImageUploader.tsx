import React, { useState } from "react";
import { View, TouchableOpacity, Text, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ImageUploaderProps {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUri,
  setImageUri,
}) => {
  const defaultAvatar = "https://via.placeholder.com/150";

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const galleryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      cameraPermission.status !== "granted" ||
      galleryPermission.status !== "granted"
    ) {
      Alert.alert(
        "Permission Required",
        "Please grant camera and gallery access."
      );
    }
  };

  // Handle Camera Picker
  const pickImageFromCamera = async () => {
    await requestPermissions();
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Handle Gallery Picker
  const pickImageFromGallery = async () => {
    await requestPermissions();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View className="items-center">
      {/* Display Current Image */}
      <Image
        source={{ uri: imageUri || defaultAvatar }}
        className="w-32 h-32 rounded-full border-2 border-gray-400"
      />

      {/* Buttons */}
      <View className="flex-row space-x-4 mt-4">
        <TouchableOpacity
          onPress={pickImageFromCamera}
          className="p-3 bg-gray-200 rounded-lg flex-row items-center"
        >
          <MaterialCommunityIcons name="camera" size={24} color="gray" />
          <Text className="ml-2 font-semibold text-gray-700">Chụp ảnh</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={pickImageFromGallery}
          className="p-3 bg-gray-200 rounded-lg flex-row items-center"
        >
          <MaterialCommunityIcons name="image" size={24} color="gray" />
          <Text className="ml-2 font-semibold text-gray-700">Upload ảnh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ImageUploader;
