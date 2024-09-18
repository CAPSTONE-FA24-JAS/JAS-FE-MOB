import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

interface PreValuationDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  details: {
    id: number;
    images: string[];
    name: string;
    owner: string;
    artist: string;
    category: string;
    weight: string;
    height: string;
    depth: string;
    description: string;
    estimatedCost: number;
    note: string;
  };
}

const PreValuationDetailsModal: React.FC<PreValuationDetailsModalProps> = ({
  isVisible,
  onClose,
  onApprove,
  onReject,
  details,
}) => {
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
          <Text className="mt-10 mb-4 text-xl uppercase font-bold text-center">
            Preliminary Valuation Details
          </Text>

          <ScrollView className="max-h-[80%]">
            {/* Images (2 rows, 2 columns) */}
            <View className="flex-row justify-between mb-4">
              {details.images.slice(0, 2).map((img, idx) => (
                <Image
                  key={idx}
                  source={{ uri: img }}
                  className="w-1/2 h-40 m-1 rounded-md"
                  resizeMode="cover"
                />
              ))}
            </View>
            <View className="flex-row justify-between mb-4">
              {details.images.slice(2, 4).map((img, idx) => (
                <Image
                  key={idx}
                  source={{ uri: img }}
                  className="w-1/2 h-40 m-1 rounded-md"
                  resizeMode="cover"
                />
              ))}
            </View>
            {/* Item details */}
            <Text className="mb-2 text-2xl font-bold">{details.name}</Text>

            {/* <View className="flex-row gap-2 my-2">
              <Text className="text-lg font-bold text-gray-700 ">Owner:</Text>
              <Text className="text-lg font-semibold text-blue-500">
                {" "}
                {details.owner}
              </Text>
            </View>

            <View className="flex-row gap-2 mb-2">
              <Text className="text-lg font-bold text-gray-700 ">Artist:</Text>
              <Text className="text-lg text-gray-800"> {details.artist}</Text>
            </View> */}
            {/* <View className="flex-row gap-2 mb-2">
              <Text className="text-lg font-bold text-gray-700 ">
                Category:
              </Text>
              <Text className="text-lg text-gray-800"> {details.category}</Text>
            </View> */}

            <View className="ml-4">
              <View className="flex-row items-start gap-2">
                <Text className="text-lg text-gray-800">•</Text>

                <Text className="text-lg font-bold text-gray-700 ">
                  Weight:
                </Text>
                <Text className="text-lg text-gray-800">
                  {" "}
                  {details.weight} cm
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-lg text-gray-800">•</Text>
                <Text className="text-lg font-bold text-gray-700 ">
                  Height:
                </Text>
                <Text className="text-lg text-gray-800">
                  {" "}
                  {details.height} cm
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-lg text-gray-800">•</Text>
                <Text className="text-lg font-bold text-gray-700 ">Depth:</Text>
                <Text className="text-lg text-gray-800">
                  {" "}
                  {details.depth} cm
                </Text>
              </View>
            </View>
            <View className="flex-row w-full gap-2 my-2">
              <Text className="text-lg font-bold text-gray-700 w-[100px] ">
                Description:
              </Text>
              <Text className="text-lg text-gray-800 w-[70%] ">
                {" "}
                {details.description}
              </Text>
            </View>

            <View className="flex-row justify-between w-[90%] my-5">
              <Text className="text-xl font-bold text-gray-900 w-[70%]">
                Total estimated retail replacement cost:
              </Text>
              {details.estimatedCost ? (
                <Text className="text-2xl text-[#D80000] font-bold">
                  {" "}
                  ${details.estimatedCost}
                </Text>
              ) : (
                <Text className="text-2xl text-[#D80000] font-bold"> $0</Text>
              )}
            </View>

            <Text className="text-lg mb-4 text-[#D80000] font-bold">
              Note: {details.note}
            </Text>
          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row justify-around mt-4">
            <TouchableOpacity
              className="px-8 py-3 bg-red-500 rounded-lg"
              onPress={onReject}
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
        </View>
      </View>
    </Modal>
  );
};

export default PreValuationDetailsModal;
