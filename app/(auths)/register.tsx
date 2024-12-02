import { registerApi } from "@/api/authApi";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { useAppDispatch } from "@/redux/store";
import axios from "axios";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Response } from "../types/respone_type";
import { SignUpUser } from "../types/signup_type";

const SignUpScreen = () => {
  const dispatch = useAppDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleRegister = async () => {
    const date = new Date();
    const dateNow = date.toISOString();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !retypePassword ||
      !phoneNumber
    ) {
      showErrorMessage("Error, Please fill in all fields");
      return;
    }
    if (password !== retypePassword) {
      showErrorMessage("Error, Passwords do not match");
      return;
    }
    const signupUser: SignUpUser = {
      email,
      passwordHash: password,
      phoneNumber,
      registerCustomerDTO: {
        firstName,
        lastName,
        profilePicture: "",
        gender: "male",
        dateOfBirth: dateNow,
        address: "",
        citizenIdentificationCard: "",
        idIssuanceDate: dateNow,
        idExpirationDate: dateNow,
      },
    };
    try {
      setIsLoading(true); // Start loading
      await registerApi(signupUser); // Call the register API
      showSuccessMessage(
        "Register successful! Please check email to confirm account and log in to continue"
      );
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setRetypePassword("");
      setPhoneNumber("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const apiResponse = error.response.data as Response<any>;
          showErrorMessage(
            apiResponse.message || "An unexpected error occurred."
          );
        } else {
          showErrorMessage(error.message);
        }
      } else if (error instanceof Error) {
        showErrorMessage(error.message);
      } else {
        showErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../../assets/Vector-11.png")}
        className="relative justify-end w-full h-64">
        <Text className="absolute mb-4 ml-4 text-3xl font-bold text-white top-20 left-40">
          JAS
        </Text>
        <Image
          className="absolute bottom-0 w-32 h-32 top-28 right-32"
          source={require("../../assets/Mask Group.png")}
        />
      </ImageBackground>
      <View className="flex-1 px-4 pt-6">
        <Text className="mb-4 text-xl font-bold">Sign up</Text>
        <Text className="mb-2 font-bold">Account Details</Text>
        <TextInput
          className="w-full h-10 px-2 mb-4 border border-gray-300 rounded"
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          returnKeyType="done"
        />
        <TextInput
          className="w-full h-10 px-2 mb-4 border border-gray-300 rounded"
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          returnKeyType="done"
        />
        <TextInput
          className="w-full h-10 px-2 mb-4 border border-gray-300 rounded"
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="email-address"
          returnKeyType="done"
        />
        <TextInput
          className="w-full h-10 px-2 mb-4 border border-gray-300 rounded"
          placeholder="E-Mail Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          returnKeyType="done"
        />
        <TextInput
          className="w-full h-10 px-2 mb-1 border border-gray-300 rounded"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="done"
        />
        <Text className="mb-4 text-xs text-gray-500">
          Must be at least 6 characters and has at least one number
        </Text>
        <TextInput
          className="w-full h-10 px-2 mb-4 border border-gray-300 rounded"
          placeholder="Re-type Password"
          value={retypePassword}
          onChangeText={setRetypePassword}
          secureTextEntry
          returnKeyType="done"
        />

        <TouchableOpacity
          disabled={isLoading} // Disable button when loading
          className={`w-full py-3 mt-4 bg-blue-500 rounded ${
            isLoading ? "opacity-50" : ""
          }`}
          onPress={handleRegister}>
          <Text className="text-base font-bold text-center text-white">
            Create Account
          </Text>
        </TouchableOpacity>

        <Link href="/(auths)/login" asChild>
          <TouchableOpacity className="mt-4">
            <Text className="text-center text-blue-500">Log in instead</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default SignUpScreen;
