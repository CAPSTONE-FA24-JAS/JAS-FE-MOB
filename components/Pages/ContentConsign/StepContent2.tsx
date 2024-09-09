import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Switch } from "react-native";

interface StepContent2Props {
  setIsStep2Valid: (isValid: boolean) => void;
}

const StepContent2: React.FC<StepContent2Props> = ({ setIsStep2Valid }) => {
  const [isMetric, setIsMetric] = useState(true); // true for CM, false for IN
  const [description, setDescription] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [email, setEmail] = useState("");

  const toggleSwitch = () => setIsMetric((previousState) => !previousState);

  // Check if all inputs are filled
  useEffect(() => {
    if (description && height && width && depth && email) {
      setIsStep2Valid(true); // All fields are filled
    } else {
      setIsStep2Valid(false); // Not all fields are filled
    }
  }, [description, height, width, depth, email]);

  return (
    <View>
      <Text className="text-lg font-semibold">Description</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 my-4"
        placeholder="Enter here..."
        value={description}
        onChangeText={setDescription}
      />

      <Text className="text-lg font-semibold">Dimensions</Text>
      {/* Toggle for IN/CM */}
      <View className="flex-row  items-center my-4">
        {/* IN Text */}
        <Text
          className={`text-lg mr-6 ${
            !isMetric ? "font-bold text-black" : "text-gray-400"
          }`}
        >
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
          }`}
        >
          CM
        </Text>
      </View>
      <View className="flex-row justify-between items-center my-4 w-full">
        <Text className="text-lg w-[20%]">Height</Text>
        <TextInput
          className="border border-gray-300 w-[80%] rounded-md p-2"
          placeholder="Enter height..."
          value={height}
          onChangeText={setHeight}
        />
      </View>
      <View className="flex-row justify-between items-center my-4">
        <Text className="text-lg w-[20%]">Width</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-2 w-[80%]"
          placeholder="Enter width..."
          value={width}
          onChangeText={setWidth}
        />
      </View>
      <View className="flex-row justify-between items-center my-4">
        <Text className="text-lg w-[20%]">Depth</Text>
        <TextInput
          className="border border-gray-300 w-[80%] rounded-md p-2"
          placeholder="Enter depth..."
          value={depth}
          onChangeText={setDepth}
        />
      </View>
      <View className="my-4">
        <Text className="text-lg w-[20%] font-bold mb-4">Contact</Text>
        <View className="w-full">
          <TextInput
            className="border border-gray-300 w-full rounded-md p-2"
            placeholder="Enter email..."
            value={email}
            onChangeText={setEmail}
          />
          <Text className="text-sm mt-2 text-gray-400 font-base">
            (Your email address based on your login)
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StepContent2;
