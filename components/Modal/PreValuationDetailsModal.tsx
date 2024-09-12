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
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-11/12 bg-[#FBFBFB] rounded-lg p-4">
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 pb-2 right-4"
          >
            <MaterialCommunityIcons name="close" size={24} color="#000" />
          </TouchableOpacity>
          {/* Modal Title */}
          <Text className="text-2xl font-bold text-center mb-4  mt-10">
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
            <Text className="text-2xl mb-2 font-bold text-2xl">
              {details.name}
            </Text>

            <View className="flex-row gap-2 my-2">
              <Text className="text-lg font-bold text-gray-700 ">Owner:</Text>
              <Text className="text-lg text-blue-500 font-semibold">
                {" "}
                {details.owner}
              </Text>
            </View>

            <View className="flex-row gap-2 mb-2">
              <Text className="text-lg font-bold text-gray-700 ">Artist:</Text>
              <Text className="text-lg text-gray-800"> {details.artist}</Text>
            </View>
            <View className="flex-row gap-2 mb-2">
              <Text className="text-lg font-bold text-gray-700 ">
                Category:
              </Text>
              <Text className="text-lg text-gray-800"> {details.category}</Text>
            </View>

            <View className="ml-4">
              <View className="flex-row gap-2 items-start">
                <Text className="text-lg text-gray-800">•</Text>

                <Text className="text-lg font-bold text-gray-700 ">
                  Weight:
                </Text>
                <Text className="text-lg text-gray-800"> {details.weight}</Text>
              </View>
              <View className="flex-row gap-2 items-start">
                <Text className="text-lg text-gray-800">•</Text>
                <Text className="text-lg font-bold text-gray-700 ">
                  Height:
                </Text>
                <Text className="text-lg text-gray-800"> {details.height}</Text>
              </View>
              <View className="flex-row gap-2 items-start">
                <Text className="text-lg text-gray-800">•</Text>
                <Text className="text-lg font-bold text-gray-700 ">Depth:</Text>
                <Text className="text-lg text-gray-800"> {details.depth}</Text>
              </View>
            </View>
            <View className="flex-row gap-2 my-2 w-full">
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
              <Text className="text-2xl text-[#D80000] font-bold">
                {" "}
                ${details.estimatedCost}
              </Text>
            </View>

            <Text className="text-lg mb-4 text-[#D80000] font-bold">
              Note: {details.note}
            </Text>
          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row justify-around mt-4">
            <TouchableOpacity
              className="bg-red-500 py-3 px-8 rounded-lg"
              onPress={onReject}
            >
              <Text className="text-white font-bold">REJECT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-green-500 py-3 px-8 rounded-lg"
              onPress={onApprove}
            >
              <Text className="text-white font-bold">APPROVE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PreValuationDetailsModal;
