import React from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface StepContent3Props {
  apiResponseData: {
    doucment: string[];
    images: string[];
  }; // Nhận URLs của hình ảnh từ ConsignStep
  height: string;
  width: string;
  depth: string;
  nameConsign: string;
  description: string;
}

const StepContent3: React.FC<StepContent3Props> = ({
  apiResponseData,
  height,
  width,
  depth,
  nameConsign,
  description,
}) => {
  console.log("apiResponseDataNha", apiResponseData);

  return (
    <ScrollView className="flex-1">
      <Text className="text-3xl text-blue-500 font-bold my-4">Success!</Text>
      <Text className="text-lg  font-medium text-[#A6A6A6]">
        Your item has been successfully sent for review. You will receive a
        reply soon with an estimation of the value of your item.
      </Text>

      <Text className="text-xl font-bold my-4">Review:</Text>
      <View className="mx-2">
        {/* Hiển thị các hình ảnh từ phản hồi API */}
        {apiResponseData?.images?.length > 0 && (
          <View className="flex-row flex-wrap mb-4 justify-around gap-2">
            {apiResponseData.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                className="w-40 h-40  rounded-lg shadow-md"
              />
            ))}
          </View>
        )}

        {/* Hiển thị các hình ảnh từ phản hồi API */}
        {apiResponseData?.doucment?.length > 0 && (
          <View className="w-1/2  justify-around gap-2">
            {apiResponseData.doucment.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  Linking.openURL(image);
                }}
                className="bg-blue-500 p-2 rounded-md shadow-md"
              >
                <Text className="font-semibold text-center text-base text-white">
                  {" "}
                  File Gemstone
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Hiển thị thông tin sản phẩm */}
        <Text className="text-xl font-semibold mt-4 uppercase">
          {nameConsign}
        </Text>
        <Text className="text-base font-medium texxt-gray-600">
          {description}
        </Text>
        <Text className="text-lg font-semibold mt-4">{`${height} X ${width} X ${depth} CM`}</Text>
      </View>
    </ScrollView>
  );
};

export default StepContent3;
