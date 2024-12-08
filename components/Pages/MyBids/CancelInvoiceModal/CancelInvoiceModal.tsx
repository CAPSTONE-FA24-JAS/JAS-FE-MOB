import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { cancelInvoiceByBuyer } from "@/api/invoiceApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";

const CancelInvoiceModal: React.FC<{
  invoiceId: number;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ invoiceId, onClose, onSuccess }) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const suggestedReasons = [
    "Not interested anymore",
    "Found a better option",
    "Incorrect details",
    "Other",
  ];

  const handleConfirmCancel = async () => {
    const reason =
      selectedReason === "Other" ? otherReason : selectedReason || "";
    if (reason.trim() === "") {
      Alert.alert("Validation", "Please provide a reason for cancellation.");
      return;
    }

    try {
      setLoading(true);
      const response = await cancelInvoiceByBuyer(invoiceId, reason);
      if (response?.isSuccess) {
        showSuccessMessage("Invoice cancelled successfully.");
        onClose();
        onSuccess(); // Trigger any refresh or navigation after success
      } else {
        showErrorMessage(response?.message || "Failed to cancel invoice.");
      }
    } catch (error) {
      console.error("Error cancelling invoice:", error);
      showErrorMessage("Unable to cancel invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View className="items-center justify-center flex-1 bg-black/50">
        <View className="w-11/12 p-4 bg-white rounded-lg">
          <Text className="mb-4 text-lg font-bold">Select a Reason</Text>
          <ScrollView className="max-h-[60%]">
            {suggestedReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center mb-2 p-3 rounded-lg ${
                  selectedReason === reason ? "bg-blue-100" : "bg-gray-100"
                }`}
                onPress={() => setSelectedReason(reason)}
              >
                <View className="flex items-center justify-center w-5 h-5 mr-4 border-2 border-blue-600 rounded-full">
                  {selectedReason === reason && (
                    <View className="h-2.5 w-2.5 bg-blue-600 rounded-full" />
                  )}
                </View>
                <Text className="text-base text-gray-700">{reason}</Text>
              </TouchableOpacity>
            ))}
            {selectedReason === "Other" && (
              <TextInput
                className="p-3 mt-4 border border-gray-300 rounded-lg"
                placeholder="Enter your reason"
                value={otherReason}
                onChangeText={setOtherReason}
              />
            )}
          </ScrollView>
          <View className="flex-row justify-between mt-6">
            <TouchableOpacity
              className="flex-1 py-3 mr-2 bg-gray-300 rounded-lg"
              onPress={onClose}
            >
              <Text className="font-bold text-center text-gray-700">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 ml-2 bg-red-500 rounded-lg"
              onPress={handleConfirmCancel}
              disabled={loading}
            >
              <Text className="font-bold text-center text-white">
                {loading ? "Processing..." : "Confirm"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CancelInvoiceModal;
