// OTP.tsx
import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Button } from "react-native-paper";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledButton = styled(Button);

// Define the types for navigation routes
type RootStackParamList = {
  PowerOfAttorney: undefined;
};

const OTP: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [otp, setOtp] = useState<string[]>(["", "", "", ""]); // To store each OTP digit
  const inputRefs = useRef<Array<TextInput | null>>([]); // Store references to each TextInput

  const handleChangeText = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to the next input field if there's a value
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      // Move to the previous input field on Backspace if empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    // Clear the OTP input fields
    setOtp(["", "", "", ""]);
    inputRefs.current[0]?.focus(); // Focus back to the first input field
  };

  const handleVerify = () => {
    console.log("OTP Verified", otp.join(""));
    navigation.navigate("PowerOfAttorney");
  };
  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <StyledView className="w-full pt-10 items-center">
        <StyledView className="mb-6">
          <Image
            source={require("../../../assets/icons/OTP.png")}
            className="w-56 h-56"
          />
        </StyledView>

        <StyledText className="text-xl font-semibold text-gray-800 mb-4">
          OTP Verification
        </StyledText>

        <StyledText className="text-sm text-gray-800 mb-4 text-base">
          Enter the OTP sent to <Text className="font-bold">+81 987987333</Text>
        </StyledText>

        <StyledView className="flex-row justify-between w-full mb-6 px-10">
          {otp.map((digit, index) => (
            <StyledTextInput
              key={index}
              ref={(ref: TextInput | null) => (inputRefs.current[index] = ref)} // Store the reference
              className="border-b-2 border-gray-400 text-center text-lg w-12"
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)} // Handle Backspace
            />
          ))}
        </StyledView>

        <StyledTouchableOpacity className="mb-4" onPress={handleResend}>
          <StyledText className="text-sm text-blue-500">Resend OTP</StyledText>
        </StyledTouchableOpacity>

        <StyledButton
          mode="contained"
          className="rounded-full w-full mt-10 bg-blue-600"
          onPress={handleVerify}
        >
          <Text className="text-xl font-semibold uppercase">Verify</Text>
        </StyledButton>
      </StyledView>
    </SafeAreaView>
  );
};

export default OTP;
