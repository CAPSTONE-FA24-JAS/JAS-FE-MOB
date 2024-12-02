import { consignAnItem } from "@/api/consignAnItemApi";
import { RootState } from "@/redux/store";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import LoadingOverlay from "../LoadingOverlay";
import StepContent1 from "./ContentConsign/StepContent1";
import StepContent2 from "./ContentConsign/StepContent2";
import StepContent3 from "./ContentConsign/StepContent3";
import * as DocumentPicker from "expo-document-picker";

// Define the types for navigation routes
type RootStackParamList = {
  HomePage: undefined;
  HistoryItemConsign: undefined;
};

const ConsignStep: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [fileValuation, setFileValuation] = useState<
    DocumentPicker.DocumentPickerAsset[] | null
  >([]);
  const [isStep2Valid, setIsStep2Valid] = useState(false); // Track Step 2 validity
  const [selectedFiles, setSelectedFiles] = useState<
    { uri: string; name: string; type: string }[]
  >([]);

  // console.log("selectedImages", selectedImages);
  // console.log("selectedFiles", selectedFiles);

  // State để lưu giá trị từ StepContent2
  const [description, setDescription] = useState("");
  const [nameConsign, setNameConsign] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [loadingConssign, setLoadingConssign] = useState(false);

  // State để lưu data response của consignAnItem
  const [apiResponseData, setApiResponseData] = useState<any>(); // Đây là nơi lưu URL hình ảnh từ API

  // Get the sellerId from Redux
  const sellerId = useSelector(
    (state: RootState) => state.auth.userResponse?.customerDTO.id
  );

  const handleConsignItem = async () => {
    try {
      if (sellerId !== undefined) {
        const response = await consignAnItem(
          sellerId,
          nameConsign,
          Number(height),
          Number(width),
          Number(depth),
          description,
          selectedImages,
          fileValuation,
          0
        );
        setApiResponseData(response.data);
      }
    } catch (error) {
      console.error("Error consigning item:", error);
      throw error;
    }
  };

  const goNext = () => {
    if (currentStep === 2) {
      // Hiển thị modal xác nhận trước khi tiếp tục đến bước 3
      setConfirmModalVisible(true);
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setModalVisible(true); // Hiển thị modal thành công khi hoàn tất step 3
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeConfirmModal = () => {
    setConfirmModalVisible(false);
  };

  const confirmNext = async () => {
    if (currentStep === 2) {
      // Người dùng xác nhận tiếp tục sau khi hiện modal xác nhận
      setLoadingConssign(true); // Hiển thị loading khi gọi API
      try {
        await handleConsignItem(); // Gọi API consignAnItem

        // Nếu API thành công, chuyển sang bước 3
        setCurrentStep(3);
      } catch (error) {
        console.error("Error consigning item:", error);
      } finally {
        closeConfirmModal(); // Đóng modal xác nhận sau khi API hoàn thành (dù thành công hay thất bại)
        setLoadingConssign(false); // Hiển thị loading khi gọi API
      }
    }
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <LoadingOverlay visible={loadingConssign} />
      {/* Step Indicator */}
      <View className="flex-row items-center pb-6 my-4 border-b-2 border-gray-400 justify-evenly">
        {["1", "2", "3"].map((step, index) => (
          <View
            key={`step-${index}`}
            className="flex-row items-center justify-between">
            <View
              className={`w-16 h-16 rounded-full justify-center items-center ${
                currentStep === index + 1 ? "bg-blue-500" : "bg-gray-300"
              }`}>
              <Text className="text-2xl font-bold text-white">{step}</Text>
            </View>
            {index < 2 && (
              <Text
                key={`arrow-${index}`}
                className="ml-6 text-3xl font-semibold text-gray-700">
                {">"}
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* Step Content */}
      <ScrollView className="flex-1">
        {currentStep === 1 && (
          <StepContent1
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            setSelectedFiles={setSelectedFiles}
            selectedFiles={selectedFiles}
            setFileValuation={setFileValuation}
            fileValuation={fileValuation}
          />
        )}
        {currentStep === 2 && (
          <StepContent2
            setIsStep2Valid={setIsStep2Valid}
            setDescription={setDescription}
            setHeight={setHeight}
            setWidth={setWidth}
            setDepth={setDepth}
            setNameConsign={setNameConsign}
          />
        )}
        {currentStep === 3 && (
          <StepContent3
            apiResponseData={apiResponseData}
            height={height}
            width={width}
            depth={depth}
            nameConsign={nameConsign}
            description={description}
          />
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 p-4">
        <View className="flex-row justify-between">
          {/* Hide Previous button on Step 3 */}
          {currentStep !== 3 && (
            <TouchableOpacity
              onPress={goBack}
              className={`py-3 px-8 w-[45%] flex-row justify-center rounded-lg ${
                currentStep === 1 ? "bg-gray-300" : "bg-blue-500"
              }`}
              disabled={currentStep === 1}>
              <Text className="text-lg font-semibold text-white">Previous</Text>
            </TouchableOpacity>
          )}

          {/* Disable Next button if Step 2 is invalid */}
          <TouchableOpacity
            onPress={goNext}
            className={`py-3 px-8 ${
              currentStep === 3 ? "w-full" : "w-[45%]"
            } flex-row justify-center rounded-lg ${
              (currentStep === 1 && selectedImages?.length === 0) ||
              (currentStep === 2 && !isStep2Valid)
                ? "bg-gray-300"
                : "bg-blue-500"
            }`}
            disabled={
              (currentStep === 1 && selectedImages?.length === 0) ||
              (currentStep === 2 && !isStep2Valid)
            }>
            <Text className="w-full text-lg font-semibold text-center text-white">
              {currentStep === 3 ? "Finish" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Success Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}>
        <View className="items-center justify-center flex-1 bg-black/50">
          <View className="items-center w-11/12 p-6 bg-white rounded-lg">
            <Text className="mb-4 text-3xl font-bold text-green-500">
              Success!
            </Text>
            <Text className="mb-8 text-lg text-center">
              Your item has been sent to the manager for review. Please wait for
              further evaluation. You can follow the item in the history
              section.
            </Text>

            {/* History Button */}
            <TouchableOpacity
              className="px-8 py-3 mb-4 bg-blue-500 rounded-lg"
              onPress={() => {
                closeModal();
                navigation.navigate("HistoryItemConsign"); // Navigate to History Page
              }}>
              <Text className="text-lg font-semibold text-white">
                History Item Consign
              </Text>
            </TouchableOpacity>

            {/* Home Button */}
            <TouchableOpacity
              className="px-8 py-3 bg-gray-500 rounded-lg"
              onPress={() => {
                closeModal();
                navigation.navigate("HomePage"); // Navigate back to Home
              }}>
              <Text className="text-lg font-semibold text-white">
                Return to Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal using React Native's Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isConfirmModalVisible}
        onRequestClose={closeConfirmModal}>
        <View className="items-center justify-center flex-1 bg-black/50">
          <View className="items-center w-10/12 p-6 bg-white rounded-lg">
            <Text className="mb-4 text-3xl font-bold text-blue-500">
              Confirm
            </Text>
            <Text className="mb-4 text-xl text-center">
              Are you sure you want to proceed to Step 3?
            </Text>
            <View className="flex-row w-full justify-evenly">
              <TouchableOpacity
                onPress={closeConfirmModal}
                className="px-8 py-3 bg-gray-500 rounded-lg">
                <Text className="font-semibold text-white">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmNext}
                className="px-8 py-3 bg-blue-500 rounded-lg">
                <Text className="text-base font-semibold text-white">
                  Yes, Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ConsignStep;
