import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface StepContent1Props {
  selectedImages: string[];
  setSelectedImages: (images: string[]) => void;
}

const StepContent1: React.FC<StepContent1Props> = ({
  selectedImages,
  setSelectedImages,
}) => {
  useEffect(() => {
    const getPermission = async () => {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: galleryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || galleryStatus !== "granted") {
        showErrorMessage(
          "Permissions Required, Permissions to access camera and gallery are required!"
        );
      }
    };
    getPermission();
  }, []);

  // Handle Camera Picker
  const pickImageFromCamera = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || galleryStatus !== "granted") {
      showErrorMessage("Permissions Required for Camera and Gallery access.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled && selectedImages.length < 4) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
  };

  // Handle Image Picker from Gallery
  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled && selectedImages.length < 4) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
  };

  // Remove image from the list
  const removeImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  return (
    <View>
      <Text className="text-lg font-semibold">
        Consignment is a simple process that allows you to send us your valuable
        items for review. We can estimate its value and eventually offer it at
        one of our auctions!
      </Text>

      <View className="flex-row flex-wrap justify-around mt-6">
        {selectedImages.map((uri, index) => (
          <View key={index} className="relative">
            <Image source={{ uri }} className="w-24 h-24 rounded-lg" />
            <TouchableOpacity
              onPress={() => removeImage(index)}
              className="absolute top-0 right-0 bg-gray-700 rounded-full w-6 h-6 justify-center items-center"
            >
              <Text className="text-white font-bold">X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View className="mx-auto mt-4">
        {selectedImages.length < 4 && (
          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={pickImageFromCamera}
              className="w-24 h-24 bg-gray-200 rounded-lg justify-center items-center"
            >
              <Text className="text-gray-500 text-lg">
                <MaterialCommunityIcons name="camera" size={30} color="gray" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={pickImageFromGallery}
              className="w-24 h-24 bg-gray-200 rounded-lg justify-center items-center"
            >
              <MaterialCommunityIcons name="upload" size={30} color="gray" />
            </TouchableOpacity>
          </View>
        )}
        <Text className="text-sm mt-2 text-gray-400 font-base">
          (Upload maximum 4 photos.)
        </Text>
      </View>
    </View>
  );
};

export default StepContent1;
