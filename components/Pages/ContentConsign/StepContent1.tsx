import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";

interface StepContent1Props {
  selectedImages: string[];
  setSelectedImages: (images: string[]) => void;
  selectedFiles: any[];
  setSelectedFiles: (files: any[]) => void;
}

const StepContent1: React.FC<StepContent1Props> = ({
  selectedImages,
  setSelectedImages,
  selectedFiles,
  setSelectedFiles,
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

  // Handle File Picker
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "application/pdf"],
        copyToCacheDirectory: false,
        multiple: false,
      });

      if (!(result.canceled = false)) {
        setSelectedFiles(result.assets);
      } else {
        Alert.alert("File picking cancelled.");
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "There was an error selecting file.");
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
  // Remove file from the list
  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
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

      {/* Display Selected Files */}
      {selectedFiles.length > 0 && (
        <View className="mt-6 mb-3">
          <Text className="font-semibold text-lg">
            Uploaded Files Gemstone:
          </Text>
          {selectedFiles.map((file, index) => (
            <View
              key={index}
              className="flex-row py-4 px-4 border-2 border-blue-200 rounded-md justify-between items-center mt-2"
            >
              <Text className="text-base w-[80%] text-gray-600">
                {file.name}
              </Text>
              <TouchableOpacity onPress={() => removeFile(index)}>
                <MaterialCommunityIcons name="delete" size={26} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* File Upload Button */}

      <View className="mx-auto mt-4 w-full">
        <TouchableOpacity
          onPress={pickFile}
          className="w-full h-16 bg-gray-200 flex-row  rounded-lg justify-center items-center"
        >
          <Text className="text-lg font-semibold mr-2  text-gray-700">
            {selectedFiles.length > 0 ? "Change File" : "Upload File"}
          </Text>
          <MaterialCommunityIcons name="upload" size={30} color="gray" />
        </TouchableOpacity>
        <Text className="text-sm mt-2 text-gray-400 font-base">
          (Upload minimum 1 files Your Gemstone: PDF, DOC, DOCX.)
        </Text>
      </View>
    </View>
  );
};

export default StepContent1;
