import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

const CreateFinanceProof: React.FC = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 p-6">
        <Text className="mb-4 text-base text-center">
          We Accept Bank Statements, Income Certificates, And Other Financial
          Documents That Verify Your Financial Status.
        </Text>

        <Text className="mb-6 text-base text-center">
          You Can Upload Files In The Following Formats:
        </Text>

        <View className="items-start mb-8 ml-6">
          <Text className="text-base font-bold">JPG</Text>
          <Text className="text-base font-bold">PNG</Text>
          <Text className="text-base font-bold">PDF</Text>
        </View>

        {/* Upload Button */}
        <TouchableOpacity className="items-center self-center justify-center w-32 h-32 rounded-full">
          <Image
            className="object-cover "
            source={require("../../assets/Cloudupload.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateFinanceProof;
