import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { createFinancialProof } from "@/api/financeProofApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "expo-router";

const CreateFinanceProof: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<
    DocumentPicker.DocumentPickerAsset[]
  >([]);
  const navigation = useNavigation();
  const [isUploading, setIsUploading] = useState(false);
  const { userResponse } = useSelector((state: RootState) => state.auth);

  const handleFilePicker = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "application/pdf"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.assets) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...result.assets]);
      } else {
        Alert.alert("File picking cancelled.");
      }
    } catch (error) {
      console.error("Error picking files:", error);
      Alert.alert("Error", "There was an error selecting files.");
    }
  };
  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert("No file selected", "Please select a file to upload.");
      return;
    }

    setIsUploading(true);

    try {
      const accountId = userResponse?.id || 0;
      const file = selectedFiles[0]; // Get the first (and only) file

      const fileUri = file.uri;
      const fileName = file.name || "unknown_file";
      const fileType = file.mimeType || "application/octet-stream";

      console.log("Uploading file:", {
        fileUri,
        fileName,
        fileType,
        accountId,
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
        accountId
      );
      console.log("Upload result:", result);

      setIsUploading(false);
      Alert.alert("Success", "File uploaded successfully.");
      setSelectedFiles([]); // Clear file after successful upload
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

  const renderFileItem = ({
    item,
  }: {
    item: DocumentPicker.DocumentPickerAsset;
  }) => (
    <View className="flex-row items-center justify-between p-2 mb-2 bg-gray-100 rounded">
      <Text numberOfLines={1} className="flex-1 mr-2">
        {item.name}
      </Text>
      <TouchableOpacity
        onPress={() =>
          setSelectedFiles((files) => files.filter((f) => f.uri !== item.uri))
        }
        className="p-2">
        <Text className="text-red-500">Remove</Text>
      </TouchableOpacity>
    </View>
  );

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

        <FlatList
          data={selectedFiles}
          renderItem={renderFileItem}
          keyExtractor={(item) => item.uri}
          ListEmptyComponent={
            <Text className="text-center">No files selected</Text>
          }
          className="mb-4"
        />

        <TouchableOpacity
          className="items-center p-4 mt-6 bg-blue-500 rounded-full"
          onPress={handleFileUpload}
          disabled={isUploading || selectedFiles.length === 0}>
          {isUploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-lg font-bold text-white">
              {selectedFiles.length > 0
                ? `Upload ${selectedFiles.length} File(s)`
                : "Select Files"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateFinanceProof;
