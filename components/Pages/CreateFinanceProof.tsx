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
  >(null); // Single file state
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
      } else {
        Alert.alert("File picking cancelled.");
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

      console.log("Uploading file:", {
        fileUri,
        fileName,
        fileType,
        CustomerId,
      });

      // Check if file exists and log its details
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      console.log("File info:", fileInfo);

      if (!fileInfo.exists) {
        throw new Error(`File does not exist at path: ${fileUri}`);
      }

      const result = await createFinancialProof(
        fileUri,
        fileType,
        fileName,
        CustomerId
      );
      console.log("Upload result:", result);

      setIsUploading(false);
      Alert.alert("Success", "File uploaded successfully.");
      setSelectedFile(null); // Clear file after successful upload
      navigation.goBack();
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading file:", error);
      Alert.alert(
        "Upload failed",
        "There was an error uploading the file. Please check the console for more details."
      );
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 p-6">
        <Text className="mb-4 text-base text-center">
          We Accept Bank Statements, Income Certificates, And Other Financial
          Documents That Verify Your Financial Status.
        </Text>

        <Text className="mb-6 text-base text-center">
          You Can Upload Files In The Following Formats:
        </Text>

        <View className="items-start mb-8 ml-6">
          <Text className="text-base font-bold">JPG</Text>
          <Text className="text-base font-bold">PNG</Text>
          <Text className="text-base font-bold">PDF</Text>
        </View>

        <TouchableOpacity
          className="items-center self-center justify-center w-32 h-32 mb-4 rounded-full"
          onPress={handleFilePicker}>
          <Image
            className="object-cover"
            source={require("../../assets/Cloudupload.png")}
          />
        </TouchableOpacity>

        {selectedFile && (
          <View className="flex-row items-center justify-between p-2 mb-2 bg-gray-100 rounded">
            <Text numberOfLines={1} className="flex-1 mr-2">
              {selectedFile[0].name}
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedFile(null)} // Allow removing file
              className="p-2">
              <Text className="text-red-500">Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          className="items-center p-4 mt-6 bg-blue-500 rounded-full"
          onPress={handleFileUpload}
          disabled={isUploading}>
          {isUploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-lg font-bold text-white">
              {selectedFile ? `Upload File` : "Select File"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateFinanceProof;
