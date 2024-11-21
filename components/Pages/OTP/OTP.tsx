// OTP.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button } from "react-native-paper";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { checkOTP, requestOTPMail } from "@/api/OTPApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import LoadingOverlay from "@/components/LoadingOverlay";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledButton = styled(Button);

// Define the types for navigation routes
type RootStackParamList = {
  PowerOfAttorney: {
    details: {
      id: number;
      images: string[];
      name: string;
      owner: string;
      artist: string;
      category: string;
      width: string;
      height: string;
      depth: string;
      description: string;
      estimatedCost: number;
      note: string;
      address: string;
      CCCD: string;
      idIssuanceDate: string;
      idExpirationDate: string;
      country: string;
      sellerId: number;
      email: string;
    };
    isOTP: boolean;
  }; // Update the type to accept details and isOTP parameters
};

interface RouteParams {
  valuationId: number;
  sellerId: number;
  email: string;
  details: {
    id: number;
    images: string[];
    name: string;
    owner: string;
    artist: string;
    category: string;
    width: string;
    height: string;
    depth: string;
    description: string;
    estimatedCost: number;
    note: string;
    address: string;
    CCCD: string;
    idIssuanceDate: string;
    idExpirationDate: string;
    country: string;
    sellerId: number;
    email: string;
  }; // Replace 'any' with the appropriate type
}
const OTP: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { valuationId, sellerId, email, details } = route.params;
  // console.log("valuationId", valuationId, "sellerId", sellerId);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]); // To store each OTP digit
  const [countdown, setCountdown] = useState(60); // Countdown timer state
  const [isDisabled, setIsDisabled] = useState(true); // Track button disabled state
  const inputRefs = useRef<Array<TextInput | null>>([]); // Store references to each TextInput
  const [Loading, setLoading] = useState(false);
  const [LoadingResend, setLoadingResend] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null); // To manage timer ref

  useEffect(() => {
    // Start countdown timer when component is mounted
    startCountdown();
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current); // Clean up the timer
      }
    };
  }, []);

  const startCountdown = () => {
    setCountdown(60); // Reset countdown to 60 seconds
    if (countdownRef.current) {
      clearInterval(countdownRef.current); // Clear any previous interval
    }
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1 && countdownRef.current) {
          clearInterval(countdownRef.current); // Stop the timer at 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChangeText = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to the next input field if there's a value
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      // Move to the previous input field on Backspace if empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Check if all OTP digits are filled
  useEffect(() => {
    setIsDisabled(otp.some((digit) => digit === ""));
  }, [otp]);

  const handleResend = async () => {
    // Clear the OTP input fields
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus(); // Focus back to the first input field
    try {
      setLoadingResend(true);
      // Call the requestOTPMail function with valuationId and sellerId
      const response = await requestOTPMail(valuationId, sellerId);

      // If successful, proceed to OTP page
      if (response.message) {
        console.log(response.message); // Optionally log the success message
        setLoadingResend(false);
        startCountdown();
        showSuccessMessage(response.message);
      }
    } catch (error) {
      setLoadingResend(false);
      console.error("Failed to request OTP:", error);
    }
    setLoadingResend(false);
  };

  const handleVerify = async () => {
    try {
      const otpValue = otp.join(""); // Join OTP array into a single string
      console.log("OTP Verified", otpValue);
      setLoading(true);

      // Call checkOTP API
      const response = await checkOTP(valuationId, sellerId, otpValue);

      // If the response message is "Authorized Successfully", navigate back
      if (response.isSuccess) {
        console.log(response.message); // Optionally log the success message
        setLoading(response.isSuccess);

        showSuccessMessage(response.message);
        navigation.navigate("PowerOfAttorney", {
          details: details,
          isOTP: true,
        }); // Navigate back to the previous screen
      } else {
        setLoading(false);
        showErrorMessage(response.message);

        console.log("OTP verification failed.");
      }
    } catch (error) {
      setLoading(false);

      console.error("Error during OTP verification:", error);
    }
    setLoading(false);
  };

  return (
    <>
      {Loading && <LoadingOverlay visible={Loading} />}
      <SafeAreaView className="flex-1 bg-white px-4">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80} // Offset for the header height
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
            keyboardShouldPersistTaps="handled"
          ></ScrollView>
          <StyledView className="mb-6">
            <Image
              source={require("../../../assets/icons/OTP.png")}
              className="w-56 h-56"
            />
          </StyledView>

          <StyledText className="text-xl font-semibold text-gray-800 mb-4">
            OTP Verification
          </StyledText>

          <StyledText className=" text-gray-800 mb-4 text-base">
            Enter the OTP sent to{" "}
            <Text className="font-bold">{email ? email : "Your Email"}</Text>
          </StyledText>

          <StyledView className="flex-row justify-between w-full mb-6 px-10">
            {otp.map((digit, index) => (
              <StyledTextInput
                key={index}
                ref={(ref: TextInput | null) =>
                  (inputRefs.current[index] = ref)
                } // Store the reference
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
            <StyledText className="text-sm text-center text-red-500">
              {countdown > 0
                ? `OTP will expire in ${countdown} seconds`
                : "OTP has expired"}
            </StyledText>
            <StyledText className="text-sm text-center  mt-2 text-blue-500">
              {LoadingResend ? "Resend OTP Loading..." : "Resend OTP"}
            </StyledText>
          </StyledTouchableOpacity>

          <StyledButton
            mode="contained"
            className="rounded-full w-full mt-10 bg-blue-600"
            onPress={handleVerify}
            disabled={isDisabled} // Disable button if OTP is incomplete
          >
            <Text className="text-xl font-semibold uppercase">Verify</Text>
          </StyledButton>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default OTP;
