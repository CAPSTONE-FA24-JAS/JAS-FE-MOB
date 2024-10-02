import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker from Expo
import { Checkbox, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { showSuccessMessage } from "@/components/FlashMessageHelpers";

// Define the types for navigation routes
type RootStackParamList = {
  PaymentSuccess: undefined;
};

const PaymentUpload: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [image, setImage] = useState<string | null>(null);
  const [termsChecked, setTermsChecked] = useState<boolean>(false);

  // Handle Image Picker from Gallery
  const pickImageFromGallery = async () => {
    // Request permission to access the gallery
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Denied",
        "You need to grant permission to access the gallery."
      );
      return;
    }

    // Launch the gallery
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri); // Set the selected image URI
    }
  };

  // Function to handle saving
  const handleSave = () => {
    if (!image) {
      Alert.alert("Error", "Please upload a payment image.");
      return;
    }

    if (!termsChecked) {
      Alert.alert("Error", "You must agree to the terms and conditions.");
      return;
    }
    showSuccessMessage("Your payment has been uploaded successfully.");
    navigation.navigate("PaymentSuccess");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Upload Section */}
      <View className="flex-1 justify-center items-center p-4">
        <TouchableOpacity
          onPress={pickImageFromGallery}
          className="w-64 h-64 border border-gray-300 rounded-lg justify-center items-center"
        >
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-full h-full rounded-lg"
              resizeMode="contain"
            />
          ) : (
            <View className="justify-center items-center">
              <MaterialCommunityIcons name="upload" size={40} color="gray" />
              <Text className="text-gray-600">Upload Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Reselect Button */}
        {image && (
          <TouchableOpacity
            onPress={pickImageFromGallery}
            className="mt-4 p-3 rounded bg-gray-300"
          >
            <Text className="text-center text-gray-800">Chọn lại</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Checkbox and Terms */}
      <View className="px-4 mb-4 flex-row">
        <Checkbox
          status={termsChecked ? "checked" : "unchecked"}
          onPress={() => setTermsChecked(!termsChecked)}
        />
        <Text className="text-gray-700 w-[90%]">
          Tôi cam đoan đây là bill chuyển khoản của tôi và hoàn thành đặt đơn
          như{" "}
          <Text className="text-blue-500 underline">
            điều khoản và chính sách
          </Text>{" "}
          của JAS
        </Text>
      </View>

      {/* Save Button */}
      <View className="px-4 mb-4">
        <TouchableOpacity
          className="p-3 rounded bg-blue-500"
          onPress={handleSave}
        >
          <Text className="text-white text-center text-lg font-bold">SAVE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentUpload;
