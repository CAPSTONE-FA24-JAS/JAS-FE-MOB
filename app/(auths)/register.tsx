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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Response } from "../types/respone_type";
import { SignUpUser } from "../types/signup_type";
import { MaterialIcons } from "@expo/vector-icons";
import LoadingOverlay from "@/components/LoadingOverlay";

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const validateField = (field: string, value: string) => {
    let newErrors = { ...errors };
    switch (field) {
      case "firstName":
        newErrors.firstName = value.length > 20 ? "Max 20 characters" : "";
        break;
      case "lastName":
        newErrors.lastName = value.length > 20 ? "Max 20 characters" : "";
        break;
      case "phoneNumber":
        newErrors.phoneNumber = !/^0\d{9}$/.test(value)
          ? "Phone number must start with 0 and have 10 digits"
          : "";
        break;
      case "email":
        newErrors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Invalid email format"
          : "";
        break;
      case "password":
        newErrors.password = !/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/.test(
          value
        )
          ? "Password must be 8+ chars, 1 uppercase, 1 special char, 1 number"
          : "";
        break;
      case "retypePassword":
        newErrors.retypePassword =
          value !== password ? "Passwords do not match" : "";
        break;
    }
    setErrors(newErrors);
  };

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

    if (Object.values(errors).some((err) => err !== "")) {
      showErrorMessage("Please correct all fields before submitting.");
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
      setIsLoading(true); // Bắt đầu trạng thái loading
      await registerApi(signupUser); // Gọi API đăng ký
      showSuccessMessage(
        "Register successful! Please check email to confirm account and log in to continue"
      );
      // Reset các ô input sau khi đăng ký thành công
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
      setIsLoading(false); // Kết thúc trạng thái loading
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LoadingOverlay visible={isLoading} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1">
          <ImageBackground
            source={require("../../assets/Vector-11.png")}
            className="relative justify-end w-full h-64"
          >
            <Text className="absolute mb-4 ml-4 text-3xl font-bold text-white top-20 left-40">
              JAS
            </Text>
            <Image
              className="absolute bottom-0 w-32 h-32 top-28 right-32"
              source={require("../../assets/Mask Group.png")}
            />
          </ImageBackground>
          <View className="flex-1 px-4 pt-6">
            <Text className="mb-4 text-3xl font-bold text-blue-500">
              Sign up
            </Text>
            <View className="mb-4">
              {/* First Name */}
              <Text>First Name</Text>
              <TextInput
                placeholder="Enter First Name"
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text.slice(0, 20));
                  validateField("firstName", text);
                }}
                className="border border-gray-300 rounded px-2 mb-1"
              />
              {errors.firstName ? (
                <Text className="text-red-500 text-xs mb-2">
                  {errors.firstName}
                </Text>
              ) : null}
            </View>

            <View className="mb-4">
              {/* Last Name */}
              <Text>Last Name</Text>
              <TextInput
                placeholder="Enter Last Name"
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text.slice(0, 20));
                  validateField("lastName", text);
                }}
                className="border border-gray-300 rounded px-2 mb-1"
              />
              {errors.lastName ? (
                <Text className="text-red-500 text-xs mb-2">
                  {errors.lastName}
                </Text>
              ) : null}
            </View>

            <View className="mb-4">
              {/* Phone Number */}
              <Text>Phone Number</Text>
              <TextInput
                placeholder="Enter Phone Number"
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text.replace(/[^0-9]/g, "").slice(0, 10));
                  validateField("phoneNumber", text);
                }}
                keyboardType="number-pad"
                className="border border-gray-300 rounded px-2 mb-1"
              />
              {errors.phoneNumber ? (
                <Text className="text-red-500 text-xs mb-2">
                  {errors.phoneNumber}
                </Text>
              ) : null}
            </View>

            <View className="mb-4">
              {/* Email */}
              <Text>Email</Text>
              <TextInput
                placeholder="Enter Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  validateField("email", text);
                }}
                keyboardType="email-address"
                className="border border-gray-300 rounded px-2 mb-1"
              />
              {errors.email ? (
                <Text className="text-red-500 text-xs mb-2">
                  {errors.email}
                </Text>
              ) : null}
            </View>

            <View className="mb-4">
              {/* Password */}
              <Text>Password</Text>
              <TextInput
                placeholder="Enter Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  validateField("password", text);
                }}
                secureTextEntry
                className="border border-gray-300 rounded px-2 mb-1"
              />
              {errors.password ? (
                <Text className="text-red-500 text-xs mb-2">
                  {errors.password}
                </Text>
              ) : null}
            </View>

            <View className="mb-4">
              {/* Retype Password */}
              <Text>Re-type Password</Text>
              <View className="relative">
                <TextInput
                  placeholder="Re-type Password"
                  value={retypePassword}
                  onChangeText={(text) => {
                    setRetypePassword(text);
                    validateField("retypePassword", text);
                  }}
                  secureTextEntry
                  className="border border-gray-300 rounded px-2 mb-1"
                />
                {retypePassword === password && retypePassword.length > 0 && (
                  <MaterialIcons
                    name="check-circle"
                    size={24}
                    color="green"
                    style={{ position: "absolute", right: 10, top: 10 }}
                  />
                )}
              </View>
              {errors.retypePassword ? (
                <Text className="text-red-500 text-xs mb-2">
                  {errors.retypePassword}
                </Text>
              ) : null}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              className="bg-blue-500 rounded py-2 mt-4"
              disabled={Object.values(errors).some((err) => err !== "")}
            >
              <Text className="text-white text-center font-bold">
                Create Account
              </Text>
            </TouchableOpacity>

            <Link href="/(auths)/login" asChild>
              <TouchableOpacity className="mt-4">
                <Text className="text-center text-blue-500">
                  Log in instead
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
