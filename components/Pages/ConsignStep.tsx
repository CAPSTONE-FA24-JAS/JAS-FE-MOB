import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, Text, Modal } from "react-native";
import StepContent1 from "./ContentConsign/StepContent1";
import StepContent2 from "./ContentConsign/StepContent2";
import StepContent3 from "./ContentConsign/StepContent3";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { consignAnItem } from "@/api/consignAnItemApi";

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
  const [isStep2Valid, setIsStep2Valid] = useState(false); // Track Step 2 validity

  // State để lưu giá trị từ StepContent2
  const [description, setDescription] = useState("");
  const [nameConsign, setNameConsign] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  // State để lưu data response của consignAnItem
  const [apiResponseData, setApiResponseData] = useState<string[]>([]); // Đây là nơi lưu URL hình ảnh từ API

  // Get the sellerId from Redux
  const sellerId = useSelector(
    (state: RootState) => state.auth.userResponse?.id
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
          selectedImages
        );
        // Lưu dữ liệu từ response vào state
        setApiResponseData(response.data);
        // navigation.navigate("HistoryItemConsign");
      } else {
        console.error("Error: sellerId is undefined");
      }
    } catch (error) {
      console.error("Error consigning item:", error);
      throw error; // Ném lỗi để có thể bắt được trong confirmNext
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
      try {
        await handleConsignItem(); // Gọi API consignAnItem

        // Nếu API thành công, chuyển sang bước 3
        setCurrentStep(3);
      } catch (error) {
        console.error("Error consigning item:", error);
      } finally {
        closeConfirmModal(); // Đóng modal xác nhận sau khi API hoàn thành (dù thành công hay thất bại)
      }
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      {/* Step Indicator */}
      <View className="flex-row justify-evenly items-center my-4 border-b-2 border-gray-400 pb-6">
        {["1", "2", "3"].map((step, index) => (
          <View
            key={`step-${index}`}
            className="flex-row justify-between items-center"
          >
            <View
              className={`w-16 h-16 rounded-full justify-center items-center ${
                currentStep === index + 1 ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <Text className="text-white text-2xl font-bold">{step}</Text>
            </View>
            {index < 2 && (
              <Text
                key={`arrow-${index}`}
                className="ml-6 text-gray-700 text-3xl font-semibold"
              >
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
              disabled={currentStep === 1}
            >
              <Text className="text-white text-lg font-semibold">Previous</Text>
            </TouchableOpacity>
          )}

          {/* Disable Next button if Step 2 is invalid */}
          <TouchableOpacity
            onPress={goNext}
            className={`py-3 px-8 w-[45%] flex-row justify-center rounded-lg ${
              (currentStep === 1 && selectedImages.length === 0) ||
              (currentStep === 2 && !isStep2Valid)
                ? "bg-gray-300"
                : "bg-blue-500"
            }`}
            disabled={
              (currentStep === 1 && selectedImages.length === 0) ||
              (currentStep === 2 && !isStep2Valid)
            }
          >
            <Text className="text-white text-lg font-semibold">
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
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-11/12 bg-white rounded-lg p-6 items-center">
            <Text className="text-3xl text-green-500 font-bold mb-4">
              Success!
            </Text>
            <Text className="text-lg text-center mb-8">
              Your item has been sent to the manager for review. Please wait for
              further evaluation. You can follow the item in the history
              section.
            </Text>

            {/* History Button */}
            <TouchableOpacity
              className="bg-blue-500 py-3 px-8 rounded-lg mb-4"
              onPress={() => {
                closeModal();
                navigation.navigate("HistoryItemConsign"); // Navigate to History Page
              }}
            >
              <Text className="text-white text-lg font-semibold">
                History Item Consign
              </Text>
            </TouchableOpacity>

            {/* Home Button */}
            <TouchableOpacity
              className="bg-gray-500 py-3 px-8 rounded-lg"
              onPress={() => {
                closeModal();
                navigation.navigate("HomePage"); // Navigate back to Home
              }}
            >
              <Text className="text-white text-lg font-semibold">
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
        onRequestClose={closeConfirmModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-10/12 bg-white rounded-lg p-6 items-center">
            <Text className="text-3xl text-blue-500 font-bold mb-4">
              Confirm
            </Text>
            <Text className="text-xl text-center mb-4">
              Are you sure you want to proceed to Step 3?
            </Text>
            <View className="flex-row justify-evenly w-full">
              <TouchableOpacity
                onPress={closeConfirmModal}
                className="bg-gray-500 py-3 px-8 rounded-lg"
              >
                <Text className="font-semibold text-white">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmNext}
                className="bg-blue-500 py-3 px-8 rounded-lg"
              >
                <Text className="font-semibold text-white text-base">
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
