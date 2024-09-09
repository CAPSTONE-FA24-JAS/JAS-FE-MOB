import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, Text, Modal } from "react-native";
import StepContent1 from "./ContentConsign/StepContent1";
import StepContent2 from "./ContentConsign/StepContent2";
import StepContent3 from "./ContentConsign/StepContent3";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

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

  // Handle navigation between steps
  const goNext = () => {
    if (currentStep === 2) {
      // Show confirmation modal before going to Step 3
      setConfirmModalVisible(true);
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show success modal after completing Step 3
      setModalVisible(true);
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

  const confirmNext = () => {
    setCurrentStep(3);
    closeConfirmModal();
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
          <StepContent2 setIsStep2Valid={setIsStep2Valid} />
        )}
        {currentStep === 3 && <StepContent3 />}
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
