import { showErrorMessage } from "@/components/FlashMessageHelpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

interface StepContent1Props {
  selectedImages: string[];
  setSelectedImages: (images: string[]) => void;
  selectedFiles: any[];
  setSelectedFiles: (files: any[]) => void;
  setFileValuation: React.Dispatch<
    React.SetStateAction<DocumentPicker.DocumentPickerAsset[] | null>
  >;
  fileValuation: DocumentPicker.DocumentPickerAsset[] | null;
}

const StepContent1: React.FC<StepContent1Props> = ({
  selectedImages,
  setSelectedImages,
  selectedFiles,
  setSelectedFiles,
  setFileValuation,
  fileValuation,
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
  // Remove file from the list
  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setFileValuation(updatedFiles);
  };

  const pickFileValu = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
        copyToCacheDirectory: false,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        const filename = result.assets[0].name;
        setFileValuation([{ uri: fileUri, name: filename }]);
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "There was an error selecting the document.");
    }
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
              className="absolute top-0 right-0 items-center justify-center w-6 h-6 bg-gray-700 rounded-full"
            >
              <Text className="font-bold text-white">X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View className="mx-auto mt-4">
        {selectedImages.length < 4 && (
          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={pickImageFromCamera}
              className="items-center justify-center w-24 h-24 bg-gray-200 rounded-lg"
            >
              <Text className="text-lg text-gray-500">
                <MaterialCommunityIcons name="camera" size={30} color="gray" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={pickImageFromGallery}
              className="items-center justify-center w-24 h-24 bg-gray-200 rounded-lg"
            >
              <MaterialCommunityIcons name="upload" size={30} color="gray" />
            </TouchableOpacity>
          </View>
        )}
        <Text className="mt-2 text-sm text-gray-400 font-base">
          (Upload maximum 4 photos.)
        </Text>
      </View>

      {/* Display Selected Files */}
      {selectedFiles.length > 0 && (
        <View className="mt-6 mb-3">
          <Text className="text-lg font-semibold">
            Uploaded Files Gemstone:
          </Text>
          {selectedFiles.map((file, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between px-4 py-4 mt-2 border-2 border-blue-200 rounded-md"
            >
              <Text className="text-base w-[80%] text-gray-600">{file}</Text>
              <TouchableOpacity onPress={() => removeFile(index)}>
                <MaterialCommunityIcons name="delete" size={26} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* File Upload Button */}

      <View className="w-full mx-auto mt-4">
        <TouchableOpacity
          onPress={pickFileValu}
          className="flex-row items-center justify-center w-full h-16 bg-gray-200 rounded-lg"
        >
          <Text className="mr-2 text-lg font-semibold text-gray-700">
            {fileValuation ? "Change File" : "Upload File"}
          </Text>
          <MaterialCommunityIcons name="upload" size={30} color="gray" />
        </TouchableOpacity>
        <Text className="mt-2 text-sm text-gray-400 font-base">
          (Upload minimum 1 files Your Gemstone: PDF, DOC, DOCX.)
        </Text>
      </View>

      {fileValuation && (
        <View className="mt-6 mb-3">
          <Text className="text-lg font-semibold">Uploaded File:</Text>
          {fileValuation.map((file, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between px-4 py-4 mt-2 border-2 border-blue-200 rounded-md"
            >
              <Text className="text-base w-[80%] text-gray-600">
                {file.name}
              </Text>
              <TouchableOpacity onPress={() => setFileValuation([])}>
                <MaterialCommunityIcons name="delete" size={26} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default StepContent1;
