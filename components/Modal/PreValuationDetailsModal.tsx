import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment-timezone";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface PreValuationDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
  details: {
    id: number;
    images: { id: number; imageLink: string }[];
    name: string;
    owner: string;
    artist: string;
    category: string;
    width: string;
    height: string;
    depth: string;
    description: string;
    estimatedCost: number;
    note: string;
    status: string;
    creationDate: string;
  };
}

const PreValuationDetailsModal: React.FC<PreValuationDetailsModalProps> = ({
  isVisible,
  onClose,
  onApprove,
  onReject,
  details,
}) => {
  const [rejectReasonModalVisible, setRejectReasonModalVisible] =
    useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState<string>("");
  const [customReason, setCustomReason] = useState("");

  const suggestedReasons = [
    "Not meeting requirements",
    "Incomplete information",
    "Quality issue",
    "Incorrect details",
    "Other",
  ];

  const handleConfirmReject = () => {
    const reason =
      selectedReason === "Other" ? otherReason : selectedReason || "";
    if (reason.trim() === "") {
      alert("Please provide a reason for rejection.");
      return;
    }

    setRejectReasonModalVisible(false);
    onReject(reason); // Truyền lý do cho hàm `onReject`
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="items-center justify-center flex-1 bg-black/50">
        <View className="w-11/12 bg-[#FBFBFB] rounded-lg p-4">
          <TouchableOpacity
            onPress={onClose}
            className="absolute pb-2 top-4 right-4"
          >
            <MaterialCommunityIcons name="close" size={24} color="#000" />
          </TouchableOpacity>
          {/* Modal Title */}
          <Text className="mt-10 mb-4 text-xl font-bold text-center uppercase">
            Preliminary Valuation Details
          </Text>

          <ScrollView className="max-h-[80%]">
            {/* Images (2 rows, 2 columns) */}
            <View className="flex-row justify-between mx-auto mb-4">
              {details?.images?.map((img, idx) => (
                <Image
                  key={idx}
                  source={{ uri: img?.imageLink }}
                  className="w-1/2 h-40 m-1 rounded-md"
                  resizeMode="cover"
                />
              ))}
            </View>

            {/* Item details */}
            <Text className="mb-2 text-sm font-semibold text-gray-600">
              {moment(details?.creationDate).format("HH:mm A, DD/MM/YYYY")}
            </Text>
            <Text className="mb-2 text-2xl font-bold">{details?.name}</Text>

            <View className="flex-row gap-2 my-2">
              <Text className="text-lg font-bold text-gray-700 ">Owner:</Text>
              <Text className="text-lg font-semibold text-blue-500">
                {" "}
                {details?.owner}
              </Text>
            </View>
            {details?.artist && (
              <View className="flex-row gap-2 mb-2">
                <Text className="text-lg font-bold text-gray-700 ">
                  Artist:
                </Text>
                <Text className="text-lg text-gray-800">
                  {" "}
                  {details?.artist}
                </Text>
              </View>
            )}
            {details?.category && (
              <View className="flex-row gap-2 mb-2">
                <Text className="text-lg font-bold text-gray-700 ">
                  Category:
                </Text>
                <Text className="text-lg text-gray-800">
                  {" "}
                  {details?.category}
                </Text>
              </View>
            )}

            <View className="ml-4">
              <View className="flex-row items-start gap-2">
                <Text className="text-lg text-gray-800">•</Text>

                <Text className="text-lg font-bold text-gray-700 w-[30%]">
                  Width:
                </Text>
                <Text className="text-lg text-gray-800">
                  {" "}
                  {details?.width} cm
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-lg text-gray-800">•</Text>
                <Text className="text-lg font-bold text-gray-700  w-[30%]">
                  Height:
                </Text>
                <Text className="text-lg text-gray-800">
                  {" "}
                  {details?.height} cm
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-lg text-gray-800">•</Text>
                <Text className="text-lg font-bold text-gray-700  w-[30%]">
                  Depth:
                </Text>
                <Text className="text-lg text-gray-800">
                  {" "}
                  {details?.depth} cm
                </Text>
              </View>
            </View>
            <View className="flex-row w-full gap-2 my-2">
              <Text className="text-lg font-bold text-gray-700 w-[30%] ">
                Description:
              </Text>
              <Text className="text-lg text-gray-800 w-[70%] ">
                {" "}
                {details?.description}
              </Text>
            </View>

            <View className="flex-row justify-between w-[90%] my-5">
              <Text className="text-xl font-bold text-gray-900 w-[50%]">
                Total estimated retail replacement cost:
              </Text>
              {details?.estimatedCost ? (
                <Text className="text-lg w-[50%] text-right text-[#D80000] font-bold">
                  {" "}
                  {details?.estimatedCost}
                </Text>
              ) : (
                <Text className="text-lg w-[50%] text-right  text-[#D80000] font-bold">
                  {" "}
                  $0
                </Text>
              )}
            </View>

            <Text className="text-lg mb-4 text-[#D80000] font-bold">
              Note: {details?.note}
            </Text>
          </ScrollView>
          {details?.status === "Preliminary" && (
            <View className="flex-row justify-around mt-4">
              <TouchableOpacity
                className="px-8 py-3 bg-red-500 rounded-lg"
                onPress={() => setRejectReasonModalVisible(true)}
              >
                <Text className="font-bold text-white">REJECT</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-8 py-3 bg-green-500 rounded-lg"
                onPress={onApprove}
              >
                <Text className="font-bold text-white">APPROVE</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Reject Reason Modal */}
      <Modal
        visible={rejectReasonModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setRejectReasonModalVisible(false)}
      >
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
                onPress={() => setRejectReasonModalVisible(false)}
              >
                <Text className="font-bold text-center text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 ml-2 bg-red-500 rounded-lg"
                onPress={handleConfirmReject}
              >
                <Text className="font-bold text-center text-white">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

export default PreValuationDetailsModal;
