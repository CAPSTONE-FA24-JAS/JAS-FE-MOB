import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Switch, ScrollView } from "react-native";

interface StepContent2Props {
  setIsStep2Valid: (isValid: boolean) => void;
  setDescription: (desc: string) => void;
  setHeight: (height: string) => void;
  setWidth: (width: string) => void;
  setDepth: (depth: string) => void;
  setNameConsign: (name: string) => void;
}

const StepContent2: React.FC<StepContent2Props> = ({
  setIsStep2Valid,
  setDescription,
  setHeight,
  setWidth,
  setDepth,
  setNameConsign,
}) => {
  const [isMetric, setIsMetric] = useState(true); // true for CM, false for IN
  const [localDescription, setLocalDescription] = useState("");
  const [localHeight, setLocalHeight] = useState("");
  const [localWidth, setLocalWidth] = useState("");
  const [localDepth, setLocalDepth] = useState("");
  // const [email, setEmail] = useState("");
  const [localNameConsign, setLocalNameConsign] = useState("");

  const toggleSwitch = () => setIsMetric((previousState) => !previousState);

  // Check if all inputs are filled
  useEffect(() => {
    if (
      localDescription &&
      localHeight &&
      localWidth &&
      localDepth &&
      localNameConsign
    ) {
      setIsStep2Valid(true);
    } else {
      setIsStep2Valid(false);
    }

    // Cập nhật giá trị từ người dùng lên ConsignStep khi thay đổi
    setDescription(localDescription);
    setHeight(localHeight);
    setWidth(localWidth);
    setDepth(localDepth);
    setNameConsign(localNameConsign);
  }, [localDescription, localHeight, localWidth, localDepth, localNameConsign]);

  return (
    <ScrollView
      contentContainerStyle={{ paddingVertical: 20 }}
      className="mb-20">
      <View>
        <Text className="text-lg font-semibold">Name Consign</Text>
        <TextInput
          className="p-2 my-4 border border-gray-300 rounded-md"
          placeholder="Enter here..."
          value={localNameConsign}
          onChangeText={setLocalNameConsign}
          returnKeyType="done"
        />
        <Text className="text-lg font-semibold">Description</Text>
        <TextInput
          className="p-2 my-4 border border-gray-300 rounded-md"
          placeholder="Enter here..."
          value={localDescription}
          onChangeText={setLocalDescription}
          returnKeyType="done"
        />

        <Text className="text-lg font-semibold">Dimensions</Text>
        {/* Toggle for IN/CM */}
        <View className="flex-row items-center my-4">
          {/* IN Text */}
          <Text
            className={`text-lg mr-6 ${
              !isMetric ? "font-bold text-black" : "text-gray-400"
            }`}>
            IN
          </Text>

          {/* Switch */}
          <Switch
            trackColor={{ false: "#D1D5DB", true: "#60A5FA" }} // Light gray when off, blue when on
            thumbColor={isMetric ? "#34D399" : "#f4f3f4"} // Thumb color: green for CM, default for IN
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isMetric}
            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }} // Make the toggle bigger
          />

          {/* CM Text */}
          <Text
            className={`text-lg ml-4 ${
              isMetric ? "font-bold text-black" : "text-gray-400"
            }`}>
            CM
          </Text>
        </View>
        <View className="flex-row items-center justify-between w-full my-4">
          <Text className="text-lg w-[20%]">Height</Text>
          <TextInput
            className="border border-gray-300 w-[80%] rounded-md p-2"
            placeholder="Enter height..."
            value={localHeight}
            onChangeText={setLocalHeight}
            returnKeyType="done"
          />
        </View>
        <View className="flex-row items-center justify-between my-4">
          <Text className="text-lg w-[20%]">Width</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2 w-[80%]"
            placeholder="Enter width..."
            value={localWidth}
            onChangeText={setLocalWidth}
            returnKeyType="done"
          />
        </View>
        <View className="flex-row items-center justify-between my-4">
          <Text className="text-lg w-[20%]">Depth</Text>
          <TextInput
            className="border border-gray-300 w-[80%] rounded-md p-2"
            placeholder="Enter depth..."
            value={localDepth}
            returnKeyType="done"
            onChangeText={setLocalDepth}
          />
        </View>
        {/* <View className="my-4">
          <Text className="text-lg w-[20%] font-bold mb-4">Contact</Text>
          <View className="w-full">
            <TextInput
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter email..."
              value={email}
              onChangeText={setEmail}
            />
            <Text className="mt-2 text-sm text-gray-400 font-base">
              (Your email address based on your login)
            </Text>
          </View>
        </View> */}
      </View>
    </ScrollView>
  );
};

export default StepContent2;
