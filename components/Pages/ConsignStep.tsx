import { consignAnItem } from "@/api/consignAnItemApi";
import { RootState } from "@/redux/store";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import LoadingOverlay from "../LoadingOverlay";
import StepContent1 from "./ContentConsign/StepContent1";
import StepContent2 from "./ContentConsign/StepContent2";
import StepContent3 from "./ContentConsign/StepContent3";
import * as DocumentPicker from "expo-document-picker";

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
  const [isStep2Valid, setIsStep2Valid] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<
    { uri: string; name: string; type: string }[]
  >([]);
  const [description, setDescription] = useState("");
  const [nameConsign, setNameConsign] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [loadingConssign, setLoadingConssign] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [apiResponseData, setApiResponseData] = useState<any>();

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
      setConfirmModalVisible(true);
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
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

  const confirmNext = async () => {
    if (currentStep === 2) {
      setConfirmLoading(true);
      setLoadingConssign(true);
      try {
        await handleConsignItem();
        setCurrentStep(3);
      } catch (error) {
        console.error("Error consigning item:", error);
      } finally {
        closeConfirmModal();
        setLoadingConssign(false);
        setConfirmLoading(false);
      }
    }
  };

  return (
    <View className="flex-1 bg-white">
      <LoadingOverlay visible={loadingConssign} />

      {/* Main Container */}
      <View className="flex-1 p-4">
        {/* Step Indicator */}
        <View className="flex-row items-center pb-6 mb-4 border-b-2 border-gray-400 justify-evenly">
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
                <Text className="ml-6 text-3xl font-semibold text-gray-700">
                  {">"}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Content ScrollView with padding bottom for buttons */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}>
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

        {/* Navigation Buttons */}
        <View className="px-4 py-4 bg-white border-t border-gray-200">
          <View className="flex-row justify-between">
            {currentStep !== 3 && (
              <TouchableOpacity
                onPress={goBack}
                className={`py-3 px-8 w-[45%] flex-row justify-center rounded-lg ${
                  currentStep === 1 ? "bg-gray-300" : "bg-blue-500"
                }`}
                disabled={currentStep === 1}>
                <Text className="text-lg font-semibold text-white">
                  Previous
                </Text>
              </TouchableOpacity>
            )}

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

            <TouchableOpacity
              className="px-8 py-3 mb-4 bg-blue-500 rounded-lg"
              onPress={() => {
                closeModal();
                navigation.navigate("HistoryItemConsign");
              }}>
              <Text className="text-lg font-semibold text-white">
                History Item Consign
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-8 py-3 bg-gray-500 rounded-lg"
              onPress={() => {
                closeModal();
                navigation.navigate("HomePage");
              }}>
              <Text className="text-lg font-semibold text-white">
                Return to Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
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
                disabled={confirmLoading}
                className="px-8 py-3 bg-gray-500 rounded-lg">
                <Text className="font-semibold text-white">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmNext}
                disabled={confirmLoading}
                className={`px-8 py-3 rounded-lg ${
                  confirmLoading ? "bg-blue-300" : "bg-blue-500"
                }`}>
                {confirmLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text className="text-base font-semibold text-white">
                    Yes, Continue
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ConsignStep;
