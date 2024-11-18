import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker from Expo
import { Checkbox } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  showSuccessMessage,
  showErrorMessage,
} from "@/components/FlashMessageHelpers";
import { uploadBillForInvoice } from "@/api/invoiceApi"; // Import the API function
import { MyBidData } from "@/app/types/bid_type";

// Define the types for navigation routes
type RootStackParamList = {
  PaymentSuccess: {
    invoiceId: number;
    itemDetailBid: MyBidData;
    yourMaxBid: number;
    totalPrice: number;
  };
  PaymentUpload: {
    invoiceId: number;
    itemDetailBid: MyBidData;
    yourMaxBid: number;
    totalPrice: number;
  };
};

type PaymentUploadRouteProp = RouteProp<RootStackParamList, "PaymentUpload">;
type PaymentUploadNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PaymentUpload"
>;

const PaymentUpload: React.FC = () => {
  const navigation = useNavigation<PaymentUploadNavigationProp>();
  const route = useRoute<PaymentUploadRouteProp>();
  const { invoiceId, itemDetailBid, yourMaxBid, totalPrice } = route.params;

  const [image, setImage] = useState<string | null>(null);
  const [termsChecked, setTermsChecked] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

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
  const handleSave = async () => {
    if (!image) {
      Alert.alert("Error", "Please upload a payment image.");
      return;
    }

    if (!termsChecked) {
      Alert.alert("Error", "You must agree to the terms and conditions.");
      return;
    }

    setUploading(true); // Start uploading

    try {
      // Prepare the file object
      const fileName = image.split("/").pop();
      const file = {
        uri: image,
        name: fileName || "payment_bill.jpg",
        type: "image/jpeg",
      };

      // Call the API to upload the bill
      const response = await uploadBillForInvoice(invoiceId, file);

      if (response?.isSuccess) {
        showSuccessMessage("Your payment has been uploaded successfully.");
        navigation.navigate("PaymentSuccess", {
          invoiceId,
          itemDetailBid,
          yourMaxBid,
          totalPrice: totalPrice,
        });
      } else {
        showErrorMessage(
          response?.message || "Failed to upload the payment image."
        );
      }
    } catch (error) {
      showErrorMessage("An error occurred while uploading the payment image.");
      console.error("Upload Error:", error);
    } finally {
      setUploading(false); // End uploading
    }
  };

  return (
    <View style={styles.container}>
      {/* Upload Section */}
      <View style={styles.uploadSection}>
        <TouchableOpacity
          onPress={pickImageFromGallery}
          style={styles.uploadButton}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.uploadedImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholder}>
              <MaterialCommunityIcons name="upload" size={40} color="gray" />
              <Text style={styles.placeholderText}>Upload Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Reselect Button */}
        {image && (
          <TouchableOpacity
            onPress={pickImageFromGallery}
            style={styles.reselectButton}
          >
            <Text style={styles.reselectButtonText}>Reselect</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Checkbox and Terms */}
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={termsChecked ? "checked" : "unchecked"}
          onPress={() => setTermsChecked(!termsChecked)}
        />
        <Text style={styles.checkboxText}>
          I confirm that this is my transfer bill and I have completed the order
          according to <Text style={styles.linkText}>terms and policies</Text>{" "}
          of JAS.
        </Text>
      </View>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>SAVE</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  uploadSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  uploadButton: {
    width: 256, // 64 * 4
    height: 256,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "gray",
    marginTop: 8,
    fontSize: 16,
  },
  reselectButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
  reselectButtonText: {
    color: "#333",
    textAlign: "center",
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  checkboxText: {
    flex: 1,
    color: "#4a4a4a",
    fontSize: 16,
  },
  linkText: {
    color: "#1e90ff",
    textDecorationLine: "underline",
  },
  saveButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: "#1e90ff",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PaymentUpload;
