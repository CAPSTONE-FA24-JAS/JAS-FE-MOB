import React from "react";
import { View, Text, Image } from "react-native";

const StepContent3: React.FC = () => {
  return (
    <View>
      <Text className="text-3xl text-blue-500 font-bold my-4">Success!</Text>
      <Text className="text-lg  font-medium text-[#A6A6A6]">
        Your item has been successfully sent for review. You will receive a
        reply soon with an estimation of the value of your item.
      </Text>

      <Text className="text-xl font-bold my-6">Review:</Text>
      {/* Add images here similar to step 1 */}
      <View className="flex-row flex-wrap justify-around mt-6">
        {/* Example of images */}
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <Image
            key={index}
            source={{
              uri: "https://mandalay.com.vn/wp-content/uploads/2024/03/day-chuy%E1%BB%81n-n%E1%BB%AF.jpg",
            }}
            className="w-32 h-32 m-1 rounded-lg"
          />
        ))}
      </View>

      <Text className="text-lg font-semibold mt-4">0 X 25 X 0 CM</Text>
      <Text className="text-lg font-semibold">Vòng Cổ Kim Cương</Text>
    </View>
  );
};

export default StepContent3;
