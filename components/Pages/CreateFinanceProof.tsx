import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { createFinancialProof } from "@/api/financeProofApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "expo-router";

const CreateFinanceProof: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<
    DocumentPicker.DocumentPickerAsset[] | null
  >(null);
  const navigation = useNavigation();
  const [isUploading, setIsUploading] = useState(false);
  const { userResponse } = useSelector((state: RootState) => state.auth);

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "application/pdf"],
        copyToCacheDirectory: false,
        multiple: false,
      });

      if (!(result.canceled = false)) {
        setSelectedFile(result.assets);
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "There was an error selecting file.");
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      Alert.alert("No file selected", "Please select a file to upload.");
      return;
    }

    setIsUploading(true);

    try {
      if (!userResponse) {
        Alert.alert("Error", "User information is missing.");
        setIsUploading(false);
        return;
      }

      const CustomerId = userResponse.customerDTO.id;
      const file = selectedFile[0];
      const fileUri = file.uri;
      const fileName = file.name || "unknown_file";
      const fileType = file.mimeType || "application/octet-stream";

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error(`File does not exist at path: ${fileUri}`);
      }

      const result = await createFinancialProof(
        fileUri,
        fileType,
        fileName,
        CustomerId
      );

      setIsUploading(false);
      Alert.alert("Success", "File uploaded successfully.");
      setSelectedFile(null);
      navigation.goBack();
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading file:", error);
      Alert.alert("Upload failed", "There was an error uploading the file.");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-6">
        {/* Header Section */}
        <View className="mb-8">
          <Text className="mb-2 text-xl font-semibold text-center text-gray-800">
            Upload Financial Document
          </Text>
          <Text className="text-base text-center text-gray-600">
            Please provide documents that verify your financial status
          </Text>
        </View>

        {/* Accepted Formats Section */}
        <View className="p-4 mb-8 bg-blue-50 rounded-xl">
          <Text className="mb-3 text-base font-medium text-blue-800">
            Accepted File Formats
          </Text>
          <View className="flex-row space-x-4">
            {["JPG", "PNG", "PDF"].map((format) => (
              <View key={format} className="px-4 py-2 bg-white rounded-lg">
                <Text className="font-medium text-blue-600">{format}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Upload Section */}
        <TouchableOpacity
          onPress={handleFilePicker}
          className="items-center p-8 mb-6 border-2 border-gray-300 border-dashed bg-gray-50 rounded-xl">
          <Image
            className="w-16 h-16 mb-4"
            source={require("../../assets/Cloudupload.png")}
            resizeMode="contain"
          />
          <Text className="font-medium text-gray-600">
            {selectedFile ? "Tap to change file" : "Tap to select file"}
          </Text>
        </TouchableOpacity>

        {/* Selected File Display */}
        {selectedFile && (
          <View className="flex-row items-center justify-between p-4 mb-6 rounded-lg bg-gray-50">
            <View className="flex-1">
              <Text
                className="text-sm font-medium text-gray-800"
                numberOfLines={1}>
                {selectedFile[0].name}
              </Text>
              <Text className="text-xs text-gray-500">Ready to upload</Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelectedFile(null)}
              className="p-2 ml-4">
              <Text className="font-medium text-red-500">Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Upload Button */}
        <TouchableOpacity
          className={`p-4 rounded-xl ${
            selectedFile ? "bg-blue-500 active:bg-blue-600" : "bg-gray-300"
          }`}
          onPress={handleFileUpload}
          disabled={isUploading || !selectedFile}>
          {isUploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-base font-semibold text-center text-white">
              {selectedFile ? "Upload Document" : "Select Document First"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateFinanceProof;
